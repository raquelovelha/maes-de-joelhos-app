import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, doc, setDoc, getDoc, orderBy } from 'firebase/firestore';

export const usePrayers = () => {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const loadData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      // APONTANDO PARA A PASTA CORRETA: sugestoes_oracao
      const q = query(collection(db, "sugestoes_oracao"), orderBy("dia", "asc")); 
      const snap = await getDocs(q);
      
      const userDocSnap = await getDoc(doc(db, "user_progress", userId));
      const userProgress = userDocSnap.exists() ? userDocSnap.data().prayers || {} : {};

      const combinedData = snap.docs.map(docSnap => {
        const data = docSnap.data();
        const id = data.dia || docSnap.id;
        const progress = userProgress[id] || {};

        return {
          id: id,
          category: data.categoria || "GERAL",
          description: data.texto || "Oração disponível",
          verse: data.versiculo || "", 
          dia: data.dia || 0,
          isPrayed: !!progress.isPrayed,
          isFavorite: !!progress.isFavorite
        };
      });

      setPrayers(combinedData);
    } catch (e) {
      console.error("Erro ao carregar:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [userId]);

  const toggleFavorite = (id: any) => { /* mantido */ };

  return { prayers, loading, toggleFavorite, loadData };
};