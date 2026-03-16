import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, doc, getDoc, orderBy, onSnapshot } from 'firebase/firestore';

export const usePrayers = () => {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [filhos, setFilhos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const loadData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // 1. Busca as orações gerais
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

      // 2. Busca os dados dos filhos do usuário
      const userRef = doc(db, "usuarios", userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setFilhos(userData.filhos || []);
      }

    } catch (e) {
      console.error("Erro ao carregar dados:", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleFavorite = useCallback((id: any) => {
    setPrayers(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  }, []);

  return { prayers, filhos, loading, toggleFavorite, loadData };
};