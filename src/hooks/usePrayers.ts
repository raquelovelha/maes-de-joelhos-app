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
        // Busca as sugestões fixas do sistema
        const qSugestoes = query(collection(db, "sugestoes_oracao"), orderBy("dia", "asc"));
        const snapSugestoes = await getDocs(qSugestoes);
        
        // Busca o progresso (notas, favoritos, se já orou) do utilizador
        const userDocRef = doc(db, "user_progress", userId);
        const userDocSnap = await getDoc(userDocRef);
        const userProgress = userDocSnap.exists() ? userDocSnap.data().prayers : {};

        const combinedData = snapSugestoes.docs.map(docSnap => {
          const data = docSnap.data();
          const dia = data.dia;
          const progress = userProgress[dia] || {};
          return {
            id: dia,
            categoria: data.categoria,
            texto: data.texto,
            versiculo: data.versiculo,
            isPrayed: progress.isPrayed || false,
            isFavorite: progress.isFavorite || false,
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

  // 2. SALVAR ESTADO DO BOTÃO (Botão Verde/Cinza)
  const saveToFirebase = async (updatedPrayers: PrayerRequest[]) => {
    if (!userId) return;
    try {
      const userDocRef = doc(db, "user_progress", userId);
      const progressToSave = updatedPrayers.reduce((acc: any, p) => {
        acc[p.id] = { isPrayed: p.isPrayed, isFavorite: p.isFavorite, personalNotes: p.personalNotes };
        return acc;
      }, {});
      await setDoc(userDocRef, { prayers: progressToSave }, { merge: true });
    } catch (e) { console.error("Erro ao salvar progresso:", e); }
  };

  // 3. CONFIRMAR ORAÇÃO (Com lógica de reset 24h)
  const togglePrayed = useCallback(async (id: number) => {
    let isMarkingAsDone = false;
    const hoje = new Date().toLocaleDateString('pt-BR');

    setPrayers(prev => {
      const prayerToUpdate = prev.find(p => p.id === id);
      isMarkingAsDone = prayerToUpdate ? !prayerToUpdate.isPrayed : false;
      const updated = prev.map(p => p.id === id ? { ...p, isPrayed: !p.isPrayed } : p);
      saveToFirebase(updated);
      return updated;
    });

    if (isMarkingAsDone && userId) {
      try {
        const userRef = doc(db, "usuarios", userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        
        // Verifica se mudou o dia para resetar o contador "Hoje" no Firebase
        const isNovoDia = userData?.dataUltimaOracao !== hoje;

        await updateDoc(userRef, { 
          pedidosConcluidosHoje: isNovoDia ? 1 : increment(1),
          pedidosTotalHistorico: increment(1),
          dataUltimaOracao: hoje
        });
      } catch (e) { console.error("Erro ao atualizar contadores:", e); }
    }
  }, [userId]);

  // 4. SALVAR TEMPO DO CRONÓMETRO (Com lógica de reset 24h)
  const saveTime = useCallback(async (minutes: number) => {
    if (!userId || minutes <= 0) return;
    const hoje = new Date().toLocaleDateString('pt-BR');

    try {
      const userRef = doc(db, "usuarios", userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      
      const isNovoDia = userData?.dataUltimaOracao !== hoje;

      await updateDoc(userRef, { 
        minutosHoje: isNovoDia ? minutes : increment(minutes),
        minutosTotalHistorico: increment(minutes),
        dataUltimaOracao: hoje
      });
    } catch (e) { console.error("Erro ao salvar tempo:", e); }
  }, [userId]);

  // 5. OUTRAS FUNÇÕES (Favoritos e Notas)
  const toggleFavorite = useCallback((id: number) => {
    setPrayers(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p);
      saveToFirebase(updated);
      return updated;
    });
  }, [userId]);

  const updateNote = useCallback((id: number, note: string) => {
    setPrayers(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, personalNotes: note } : p);
      saveToFirebase(updated);
      return updated;
    });
  }, [userId]);

  return { prayers, loading, togglePrayed, toggleFavorite, updateNote, saveTime };
};