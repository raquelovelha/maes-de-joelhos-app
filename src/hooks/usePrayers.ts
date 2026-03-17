import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, doc, getDoc, orderBy } from 'firebase/firestore';

export const usePrayers = () => {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [filhos, setFilhos] = useState<any[]>([]);
  const [memorial, setMemorial] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const loadData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      console.log("=== BUSCANDO DADOS ATUALIZADOS DO FIREBASE ===");
      const q = query(collection(db, "sugestoes_oracao"), orderBy("dia", "asc")); 
      const snap = await getDocs(q);
      
      const userDocSnap = await getDoc(doc(db, "user_progress", userId));
      const userProgress = userDocSnap.exists() ? userDocSnap.data().prayers || {} : {};

      const combinedData = snap.docs.map(docSnap => {
        const data = docSnap.data();
        // Forçamos a leitura do campo 'Tema' que vimos no seu log do console
        return {
          id: docSnap.id,
          category: data.Tema || data.tema || data.categoria || "GERAL",
          description: data.Texto || data.texto || "Oração disponível",
          verse: data.Versiculo || data.versiculo || "", 
          dia: data.Dia || data.dia || 0,
          isPrayed: !!(userProgress[docSnap.id]?.isPrayed),
          isFavorite: !!(userProgress[docSnap.id]?.isFavorite)
        };
      });

      console.log("=== TOTAL DE PEDIDOS MAPEADOS:", combinedData.length);
      setPrayers(combinedData);

      // Busca Memorial para destravar "Carregando memórias..."
      const memSnap = await getDocs(collection(db, "usuarios", userId, "diario_clamor"));
      setMemorial(memSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const userSnap = await getDoc(doc(db, "usuarios", userId));
      if (userSnap.exists()) setFilhos(userSnap.data().filhos || []);

    } catch (e) {
      console.error("Erro fatal na carga:", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { loadData(); }, [loadData]);

  return { prayers, filhos, memorial, loading, loadData };
};