import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import { PrayerRequest } from '../types';

export const usePrayers = () => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const loadData = async () => {
    if (!userId) return;
    try {
      // Busca a coleção de sugestões
      const qSugestoes = query(collection(db, "sugestoes_oracao"), orderBy("dia", "asc"));
      const snapSugestoes = await getDocs(qSugestoes);
      
      // Busca o progresso do usuário (favoritos, orados, notas)
      const userDocSnap = await getDoc(doc(db, "user_progress", userId));
      const userProgress = userDocSnap.exists() ? userDocSnap.data().prayers || {} : {};

      const combinedData = snapSugestoes.docs.map(docSnap => {
        const data = docSnap.data();
        const id = data.dia || docSnap.id; // Usa o 'dia' como ID principal
        const progress = userProgress[id] || {};

        // Mapeamento robusto para não vir vazio
        return {
          id: id,
          category: data.categoria || data.category || "GERAL",
          title: data.titulo || "Oração",
          description: data.texto || data.description || "", // Garante que o texto apareça
          verse: data.versiculo || data.verse || "",
          isPrayed: !!progress.isPrayed,
          isFavorite: !!progress.isFavorite,
          personalNotes: progress.personalNotes || ''
        } as PrayerRequest;
      });
      setPrayers(combinedData);
    } catch (e) { 
      console.error("Erro ao carregar orações:", e); 
    }
  };

  useEffect(() => { loadData(); }, [userId]);

  const togglePrayed = useCallback(async (id: any) => {
    if (!userId) return;
    setPrayers(prev => {
      const newList = prev.map(p => String(p.id) === String(id) ? { ...p, isPrayed: !p.isPrayed } : p);
      
      // Salva no Firebase
      const progressMap = newList.reduce((acc: any, p) => {
        acc[p.id] = { isPrayed: p.isPrayed, isFavorite: p.isFavorite, personalNotes: p.personalNotes };
        return acc;
      }, {});
      
      setDoc(doc(db, "user_progress", userId), { prayers: progressMap }, { merge: true });
      return newList;
    });
  }, [userId]);

  const toggleFavorite = useCallback(async (id: any) => {
    if (!userId) return;
    setPrayers(prev => {
      const newList = prev.map(p => String(p.id) === String(id) ? { ...p, isFavorite: !p.isFavorite } : p);
      const progressMap = newList.reduce((acc: any, p) => {
        acc[p.id] = { isPrayed: p.isPrayed, isFavorite: p.isFavorite, personalNotes: p.personalNotes };
        return acc;
      }, {});
      setDoc(doc(db, "user_progress", userId), { prayers: progressMap }, { merge: true });
      return newList;
    });
  }, [userId]);

  const updateNote = useCallback(async (id: any, note: string) => {
    if (!userId) return;
    setPrayers(prev => {
      const newList = prev.map(p => String(p.id) === String(id) ? { ...p, personalNotes: note } : p);
      const progressMap = newList.reduce((acc: any, p) => {
        acc[p.id] = { isPrayed: p.isPrayed, isFavorite: p.isFavorite, personalNotes: p.personalNotes };
        return acc;
      }, {});
      setDoc(doc(db, "user_progress", userId), { prayers: progressMap }, { merge: true });
      return newList;
    });
  }, [userId]);

  return { prayers, togglePrayed, toggleFavorite, updateNote };
};