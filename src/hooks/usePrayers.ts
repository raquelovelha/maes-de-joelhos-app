import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth'; // Adicionado
import { collection, getDocs, query, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import { PrayerRequest } from '../types';

export const usePrayers = () => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Pega o ID da usuária logada automaticamente

  // 1. CARREGAR DADOS (Orações + Progresso da Utilizadora)
  useEffect(() => {
    const loadData = async () => {
      // Se não houver usuário logado ainda, não tenta buscar dados
      if (!userId) return;

      try {
        setLoading(true);
        
        // A. Busca as 101 sugestões fixas
        const qSugestoes = query(collection(db, "sugestoes_oracao"), orderBy("dia", "asc"));
        const snapSugestoes = await getDocs(qSugestoes);
        
        // B. Busca o progresso salvo desta utilizadora específica
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
  }, [userId]); // Recarrega se o usuário mudar (login/logout)

  // 2. FUNÇÃO AUXILIAR PARA SALVAR NO FIREBASE
  const saveToFirebase = async (updatedPrayers: PrayerRequest[]) => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, "user_progress", userId);
      
      const progressToSave = updatedPrayers.reduce((acc: any, p) => {
        acc[p.id] = {
          isPrayed: p.isPrayed,
          isFavorite: p.isFavorite,
          personalNotes: p.personalNotes
        };
        return acc;
      }, {});

      await setDoc(userDocRef, { prayers: progressToSave }, { merge: true });
    } catch (e) {
      console.error("Erro ao salvar progresso:", e);
    }
  };

  // 3. MARCAR COMO ORADO
  const togglePrayed = useCallback((id: number) => {
    setPrayers(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, isPrayed: !p.isPrayed } : p);
      
      if (updated.length >= 101 && updated.every(p => p.isPrayed)) {
        alert("Glória a Deus! Você completou o ciclo de 101 orações.");
        const reseted = updated.map(p => ({ ...p, isPrayed: false }));
        saveToFirebase(reseted);
        return reseted;
      }
      
      saveToFirebase(updated);
      return updated;
    });
  }, [userId]);

  // 4. FAVORITAR
  const toggleFavorite = useCallback((id: number) => {
    setPrayers(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p);
      saveToFirebase(updated);
      return updated;
    });
  }, [userId]);

  // 5. ATUALIZAR NOTA
  const updateNote = useCallback((id: number, note: string) => {
    setPrayers(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, personalNotes: note } : p);
      saveToFirebase(updated);
      return updated;
    });
  }, [userId]);

  return { prayers, loading, togglePrayed, toggleFavorite, updateNote };
};