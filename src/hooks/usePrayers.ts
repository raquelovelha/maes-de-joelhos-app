import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, doc, getDoc, orderBy } from 'firebase/firestore';

export const usePrayers = () => {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [filhos, setFilhos] = useState<any[]>([]);
  const [memorial, setMemorial] = useState<any[]>([]); // Para destravar o Diário
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const loadData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // 1. Busca as orações (Corrigindo para ler o campo 'tema')
      const q = query(collection(db, "sugestoes_oracao"), orderBy("dia", "asc")); 
      const snap = await getDocs(q);
      
      const userDocSnap = await getDoc(doc(db, "user_progress", userId));
      const userProgress = userDocSnap.exists() ? userDocSnap.data().prayers || {} : {};

      const combinedData = snap.docs.map(docSnap => {
        const data = docSnap.data();
        const id = docSnap.id;
        const progress = userProgress[id] || {};

        return {
          id: id,
          // AJUSTE AQUI: Lendo 'tema' que é o que está no seu Firebase
          category: data.tema || data.categoria || "GERAL",
          description: data.texto || data.description || "Oração disponível",
          verse: data.versiculo || data.verse || "", 
          dia: data.dia || 0,
          isPrayed: !!progress.isPrayed,
          isFavorite: !!progress.isFavorite
        };
      });
      setPrayers(combinedData);

      // 2. Busca os filhos
      const userRef = doc(db, "usuarios", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setFilhos(userSnap.data().filhos || []);
      }

      // 3. Busca o Diário (Para tirar a tela de "Carregando memórias")
      const memorialSnap = await getDocs(collection(db, "usuarios", userId, "diario_clamor"));
      const memorialData = memorialSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMemorial(memorialData);

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

  return { prayers, filhos, memorial, loading, toggleFavorite, loadData };
};