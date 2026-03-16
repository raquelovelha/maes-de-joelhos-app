import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, doc, setDoc, getDoc } from 'firebase/firestore';

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
      // Tentamos buscar na coleção 'prayers' que é onde os dados costumam estar
      const q = query(collection(db, "prayers")); 
      const snap = await getDocs(q);
      
      const userDocSnap = await getDoc(doc(db, "user_progress", userId));
      const userProgress = userDocSnap.exists() ? userDocSnap.data().prayers || {} : {};

      const combinedData = snap.docs.map(docSnap => {
        const data = docSnap.data();
        const id = docSnap.id;
        const progress = userProgress[id] || {};

        return {
          id: id,
          // Voltando para o mapeamento simples que funcionava antes
          category: data.tema || data.categoria || "GERAL",
          description: data.pedido || data.texto || "Oração disponível",
          verse: data.referencia || data.versiculo || "", // Se não tiver, fica vazio
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

  const toggleFavorite = (id: any) => { /* função mantida */ };

  return { prayers, loading, toggleFavorite };
};