import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { getAuth } from 'firebase/auth';
import { collection, query, doc, orderBy, onSnapshot, getDoc } from 'firebase/firestore';

export const usePrayers = () => {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [memorial, setMemorial] = useState<any[]>([]);
  const [filhos, setFilhos] = useState<any[]>([]); // Nova linha
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Busca Perfil do Usuário (onde ficam os filhos)
const userRef = doc(db, "usuarios", userId);
const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
  if (docSnap.exists()) {
    setFilhos(docSnap.data().filhos || []); // <--- Isso aqui alimenta a aba Filhos
  }
});

    // Memorial em tempo real
    const memorialRef = collection(db, "usuarios", userId, "diario_clamor");
    const qMemorial = query(memorialRef, orderBy("createdAt", "desc"));
    const unsubscribeMemorial = onSnapshot(qMemorial, (snap) => {
      setMemorial(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Orações Sugeridas
    const qPrayers = query(collection(db, "sugestoes_oracao"), orderBy("dia", "asc"));
    const unsubscribePrayers = onSnapshot(qPrayers, async (snapshot) => {
      try {
        const progSnap = await getDoc(doc(db, "user_progress", userId));
        const progress = progSnap.exists() ? progSnap.data().prayers || {} : {};

        const combined = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            category: data.Tema || data.tema || "GERAL",
            description: data.Texto || data.texto || "",
            verse: data.Versiculo || data.versiculo || "",
            isPrayed: !!(progress[docSnap.id]?.isPrayed)
          };
        });
        setPrayers(combined);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeUser();
      unsubscribeMemorial();
      unsubscribePrayers();
    };
  }, [userId]);

  return { prayers, memorial, filhos, loading }; // Retorna 'filhos' agora
};