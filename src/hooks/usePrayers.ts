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

    // 1. Escuta em TEMPO REAL o Memorial (Diário) - Não reseta mais!
    const memorialRef = collection(db, "usuarios", userId, "diario_clamor");
    const qMemorial = query(memorialRef, orderBy("createdAt", "desc"));
    
    const unsubscribeMemorial = onSnapshot(qMemorial, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMemorial(docs);
    });

    // 2. Escuta em TEMPO REAL os Filhos
    const userRef = doc(db, "usuarios", userId);
    const unsubscribeUser = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setFilhos(snap.data().filhos || []);
      }
    });

    // 3. Busca Orações Sugeridas (Estáticas)
    const loadPrayers = async () => {
      try {
        const snap = await getDoc(doc(db, "user_progress", userId));
        const progress = snap.exists() ? snap.data().prayers || {} : {};
        
        // Aqui usamos a sua nova organização do Firebase
        const sugSnap = await getDoc(doc(db, "sugestoes_oracao", "lista")); // ou conforme sua estrutura de coleção
        // ... lógica de mapeamento que já funciona ...
      } catch (e) { console.error(e); }
      setLoading(false);
    };

    loadPrayers();

    return () => {
      unsubscribeMemorial();
      unsubscribeUser();
    };
  }, [userId]);

  return { prayers, filhos, memorial, loading };
};