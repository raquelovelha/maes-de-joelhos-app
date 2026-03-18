import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { getAuth } from 'firebase/auth';
import { collection, query, doc, orderBy, onSnapshot, getDoc } from 'firebase/firestore';

export const usePrayers = () => {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [filhos, setFilhos] = useState<any[]>([]);
  const [memorial, setMemorial] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // 1. Escuta em TEMPO REAL o Memorial (Para não resetar)
    const memorialRef = collection(db, "usuarios", userId, "diario_clamor");
    const qMemorial = query(memorialRef, orderBy("createdAt", "desc"));
    const unsubscribeMemorial = onSnapshot(qMemorial, (snap) => {
      setMemorial(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 2. Escuta em TEMPO REAL os Filhos
    const userRef = doc(db, "usuarios", userId);
    const unsubscribeUser = onSnapshot(userRef, (snap) => {
      if (snap.exists()) setFilhos(snap.data().filhos || []);
    });

    // 3. Escuta em TEMPO REAL as Sugestões de Oração (Novos Temas)
    const qPrayers = query(collection(db, "sugestoes_oracao"), orderBy("dia", "asc"));
    const unsubscribePrayers = onSnapshot(qPrayers, async (snapshot) => {
      try {
        const progSnap = await getDoc(doc(db, "user_progress", userId));
        const progress = progSnap.exists() ? progSnap.data().prayers || {} : {};

        const combined = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            // Lê exatamente os campos que você organizou no Firebase
            category: data.Tema || data.tema || "GERAL",
            description: data.Texto || data.texto || "",
            verse: data.Versiculo || data.versiculo || "",
            isPrayed: !!(progress[docSnap.id]?.isPrayed)
          };
        });
        setPrayers(combined);
      } catch (e) {
        console.error("Erro ao carregar orações:", e);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeMemorial();
      unsubscribeUser();
      unsubscribePrayers();
    };
  }, [userId]);

  return { prayers, filhos, memorial, loading };
};