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

  // 1. CARREGAR DADOS (Lê o progresso para não resetar os botões verdes)
  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const qSugestoes = query(collection(db, "sugestoes_oracao"), orderBy("dia", "asc"));
        const snapSugestoes = await getDocs(qSugestoes);
        
        // Busca o progresso específico do usuário
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

  // 2. SALVAR PROGRESSO (Garante que o botão "Concluído" permaneça verde)
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

  // 3. MARCAR COMO ORADO E SUBIR O CONTADOR NO PERFIL
  const togglePrayed = useCallback(async (id: number) => {
    let isMarkingAsDone = false;

    setPrayers(prev => {
      const prayerToUpdate = prev.find(p => p.id === id);
      isMarkingAsDone = prayerToUpdate ? !prayerToUpdate.isPrayed : false;
      const updated = prev.map(p => p.id === id ? { ...p, isPrayed: !p.isPrayed } : p);
      saveToFirebase(updated); // Salva o estado do botão
      return updated;
    });

    // Se marcou como feito, aumenta o número de "Pedidos" na Home/Perfil
    if (isMarkingAsDone && userId) {
      try {
        const userRef = doc(db, "usuarios", userId);
        await updateDoc(userRef, { 
          pedidosConcluidos: increment(1) 
        });
      } catch (e) { console.error("Erro ao atualizar contador:", e); }
    }
  }, [userId]);

  // 4. SALVAR TEMPO DE ORAÇÃO (Para o cronômetro)
  const saveTime = useCallback(async (minutes: number) => {
    if (!userId || minutes <= 0) return;
    try {
      const userRef = doc(db, "usuarios", userId);
      await updateDoc(userRef, { 
        minutosIntercedidos: increment(minutes) 
      });
    } catch (e) { console.error("Erro ao salvar tempo:", e); }
  }, [userId]);

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