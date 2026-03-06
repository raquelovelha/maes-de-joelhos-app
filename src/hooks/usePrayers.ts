import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import { PrayerRequest } from '../types';

export const usePrayers = () => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true); // <--- ADICIONE ISSO
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const loadData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const qSugestoes = query(collection(db, "sugestoes_oracao"), orderBy("dia", "asc"));
      const snapSugestoes = await getDocs(qSugestoes);
      
      const userDocSnap = await getDoc(doc(db, "user_progress", userId));
      const userProgress = userDocSnap.exists() ? userDocSnap.data().prayers || {} : {};

      const combinedData = snapSugestoes.docs.map(docSnap => {
        const data = docSnap.data();
        const id = data.dia || docSnap.id;
        const progress = userProgress[id] || {};

        return {
          id: id,
          category: data.categoria || "GERAL",
          title: data.titulo || `Oração Dia ${data.dia}`,
          description: data.texto || "",
          verse: data.versiculo || "",
          isPrayed: !!progress.isPrayed,
          isFavorite: !!progress.isFavorite,
          personalNotes: progress.personalNotes || ''
        } as PrayerRequest;
      });
      setPrayers(combinedData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false); // <--- GARANTE QUE O LOADING ACABA
    }
  };

  useEffect(() => { loadData(); }, [userId]);

  const togglePrayed = useCallback(async (id: any) => {
    if (!userId) return;
    setPrayers(prev => {
      const newList = prev.map(p => String(p.id) === String(id) ? { ...p, isPrayed: !p.isPrayed } : p);
      const progressMap = newList.reduce((acc: any, p) => {
        acc[p.id] = { isPrayed: p.isPrayed, isFavorite: p.isFavorite, personalNotes: p.personalNotes };
        return acc;
      }, {});
      setDoc(doc(db, "user_progress", userId), { prayers: progressMap }, { merge: true });
      return [...newList];
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
      return [...newList];
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
      return [...newList];
    });
  }, [userId]);

  return { prayers, toggleFavorite, togglePrayed, updateNote, loading }; // <--- RETORNE O LOADING AQUI
};