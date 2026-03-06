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
          // Importante: Garantir que o ID seja consistente com o tipo recebido no toggle
          const diaId = data.dia; 
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

  // 2. SALVAMENTO OTIMISTA (Sincroniza UI primeiro, depois Banco)
  const syncWithFirebase = async (updatedList: PrayerRequest[]) => {
    if (!userId) return;
    try {
      const userDocRef = doc(db, "user_progress", userId);
      const progressMap = updatedList.reduce((acc: any, p) => {
        acc[p.id] = { isPrayed: p.isPrayed, isFavorite: p.isFavorite, personalNotes: p.personalNotes };
        return acc;
      }, {});
      await setDoc(userDocRef, { prayers: progressMap }, { merge: true });
    } catch (e) { console.error("Erro ao salvar progresso:", e); }
  };

  // 3. ALTERNAR ESTADO DE ORAÇÃO (Fix para o botão e troca de abas)
  const togglePrayed = useCallback(async (id: any) => {
    if (!userId) return;

    let newState = false;

    setPrayers(prev => {
      const newList = prev.map(p => {
        if (p.id === id) {
          newState = !p.isPrayed; // Define se estamos marcando ou desmarcando
          return { ...p, isPrayed: newState };
        }
        return p;
      });
      syncWithFirebase(newList); // Salva o estado de intercedido/motivo
      return newList;
    });

    // Só atualizamos os contadores globais (Stats) se ela estiver MARCANDO como orado
    if (newState) {
      try {
        const hoje = new Date().toLocaleDateString('pt-BR');
        const userRef = doc(db, "usuarios", userId);
        const userSnap = await getDoc(userRef);
        const isNovoDia = userSnap.data()?.dataUltimaOracao !== hoje;

        await updateDoc(userRef, { 
          pedidosTotalHistorico: increment(1),
          dataUltimaOracao: hoje,
          pedidosConcluidosHoje: isNovoDia ? 1 : increment(1)
        });
      } catch (e) { console.error("Erro ao atualizar stats:", e); }
    }
  }, [userId]);

  // 4. FAVORITOS E NOTAS
  const toggleFavorite = useCallback((id: any) => {
    setPrayers(prev => {
      const newList = prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p);
      syncWithFirebase(newList);
      return newList;
    });
  }, [userId]);

  const updateNote = useCallback((id: any, note: string) => {
    setPrayers(prev => {
      const newList = prev.map(p => p.id === id ? { ...p, personalNotes: note } : p);
      syncWithFirebase(newList);
      return newList;
    });
  }, [userId]);

  // 5. SALVAR TEMPO
  const saveTime = useCallback(async (minutes: number) => {
    if (!userId || minutes <= 0) return;
    const hoje = new Date().toLocaleDateString('pt-BR');
    try {
      const userRef = doc(db, "usuarios", userId);
      const userSnap = await getDoc(userRef);
      const isNovoDia = userSnap.data()?.dataUltimaOracao !== hoje;

      await updateDoc(userRef, { 
        minutosHoje: isNovoDia ? minutes : increment(minutes),
        minutosTotalHistorico: increment(minutes),
        dataUltimaOracao: hoje
      });
    } catch (e) { console.error("Erro ao salvar tempo:", e); }
  }, [userId]);

  return { prayers, loading, togglePrayed, toggleFavorite, updateNote, saveTime };
};