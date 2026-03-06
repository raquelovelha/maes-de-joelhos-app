import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, orderBy, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { PrayerRequest } from '../types';

export const usePrayers = () => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  // 1. CARREGAR DADOS INICIAIS
  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const qSugestoes = query(collection(db, "sugestoes_oracao"), orderBy("dia", "asc"));
        const snapSugestoes = await getDocs(qSugestoes);
        
        const userDocRef = doc(db, "user_progress", userId);
        const userDocSnap = await getDoc(userDocRef);
        const userProgress = userDocSnap.exists() ? userDocSnap.data().prayers || {} : {};

        const combinedData = snapSugestoes.docs.map(docSnap => {
          const data = docSnap.data();
          // GARANTINDO QUE O ID SEJA UM NÚMERO PARA O FILTRO FUNCIONAR
          const diaId = Number(data.dia); 
          const progress = userProgress[diaId] || {};

          return {
            id: diaId,
            categoria: data.categoria || "Geral",
            texto: data.texto || "",
            versiculo: data.versiculo || "",
            isPrayed: !!progress.isPrayed,
            isFavorite: !!progress.isFavorite,
            personalNotes: progress.personalNotes || ''
          } as PrayerRequest;
        });
        setPrayers(combinedData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  // 2. FUNÇÃO AUXILIAR PARA SALVAR (Fora do loop de render)
  const syncWithFirebase = async (updatedList: PrayerRequest[]) => {
    if (!userId) return;
    const userDocRef = doc(db, "user_progress", userId);
    const progressMap = updatedList.reduce((acc: any, p) => {
      acc[p.id] = { isPrayed: p.isPrayed, isFavorite: p.isFavorite, personalNotes: p.personalNotes };
      return acc;
    }, {});
    await setDoc(userDocRef, { prayers: progressMap }, { merge: true });
  };

  // 3. CONFIRMAR ORAÇÃO (AJUSTADO)
  const togglePrayed = useCallback(async (id: number) => {
    if (!userId) return;
    
    // Atualização Otimista (Muda na tela na hora)
    setPrayers(prev => {
      const newList = prev.map(p => p.id === id ? { ...p, isPrayed: !p.isPrayed } : p);
      syncWithFirebase(newList); // Salva em background
      return newList;
    });

    // Atualiza contadores no perfil do usuário
    try {
      const hoje = new Date().toLocaleDateString('pt-BR');
      const userRef = doc(db, "usuarios", userId);
      const userSnap = await getDoc(userRef);
      const isNovoDia = userSnap.data()?.dataUltimaOracao !== hoje;

      await updateDoc(userRef, { 
        pedidosTotalHistorico: increment(1),
        dataUltimaOracao: hoje,
        ...(isNovoDia ? { pedidosConcluidosHoje: 1 } : { pedidosConcluidosHoje: increment(1) })
      });
    } catch (e) { console.error("Erro nos stats:", e); }
  }, [userId]);

  // 4. FAVORITOS
  const toggleFavorite = useCallback((id: number) => {
    setPrayers(prev => {
      const newList = prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p);
      syncWithFirebase(newList);
      return newList;
    });
  }, [userId]);

  // 5. NOTAS
  const updateNote = useCallback((id: number, note: string) => {
    setPrayers(prev => {
      const newList = prev.map(p => p.id === id ? { ...p, personalNotes: note } : p);
      syncWithFirebase(newList);
      return newList;
    });
  }, [userId]);

  return { prayers, loading, togglePrayed, toggleFavorite, updateNote };
};