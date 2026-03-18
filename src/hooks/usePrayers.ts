import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, query, doc, getDoc, orderBy, onSnapshot } from 'firebase/firestore';

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

    // Busca o Memorial (Diário) em tempo real para não resetar
    const memorialRef = collection(db, "usuarios", userId, "diario_clamor");
    const qMemorial = query(memorialRef, orderBy("createdAt", "desc"));
    const unsubscribeMemorial = onSnapshot(qMemorial, (snap) => {
      setMemorial(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Busca os Filhos em tempo real
    const userRef = doc(db, "usuarios", userId);
    const unsubscribeUser = onSnapshot(userRef, (snap) => {
      if (snap.exists()) setFilhos(snap.data().filhos || []);
    });

    // Busca as Sugestões de Oração da nova estrutura
    const loadPrayers = async () => {
      try {
        const q = query(collection(db, "sugestoes_oracao"), orderBy("dia", "asc"));
        const snap = await getDoc(doc(db, "user_progress", userId));
        const progress = snap.exists() ? snap.data().prayers || {} : {};

        onSnapshot(q, (snapshot) => {
          const combined = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              // Aqui o código aceita tanto 'Tema' quanto 'tema' do seu novo banco
              category: data.Tema || data.tema || "GERAL",
              description: data.Texto || data.texto || "",
              verse: data.Versiculo || data.versiculo || "",
              isPrayed: !!(progress[docSnap.id]?.isPrayed)
            };
          });
          setPrayers(combined);
          setLoading(false);
        });
      } catch (e) {
        console.error("Erro ao restaurar:", e);
        setLoading(false);
      }
    };

    loadPrayers();
    return () => {
      unsubscribeMemorial();
      unsubscribeUser();
    };
  }, [userId]);

  return { prayers, filhos, memorial, loading };
};