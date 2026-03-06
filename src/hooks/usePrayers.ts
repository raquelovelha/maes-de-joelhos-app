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
        const diaId = data.dia; 
        const progress = userProgress[diaId] || {};

        return {
          id: diaId,
          categoria: data.categoria || "GERAL",
          texto: data.texto || "",
          versiculo: data.versiculo || "",
          isPrayed: !!progress.isPrayed,
          isFavorite: !!progress.isFavorite,
          personalNotes: progress.personalNotes || ''
        } as PrayerRequest;
      });
      setPrayers(combinedData);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [userId]);

  const syncWithFirebase = async (updatedList: PrayerRequest[]) => {
    if (!userId) return;
    try {
      const userDocRef = doc(db, "user_progress", userId);
      const progressMap = updatedList.reduce((acc: any, p) => {
        acc[p.id] = { isPrayed: p.isPrayed, isFavorite: p.isFavorite, personalNotes: p.personalNotes };
        return acc;
      }, {});
      await setDoc(userDocRef, { prayers: progressMap }, { merge: true });
    } catch (e) { console.error("Erro ao sincronizar:", e); }
  };

  const togglePrayed = useCallback(async (id: any) => {
    if (!userId) return;
    let isNowPrayed = false;

    setPrayers(prev => {
      const newList = prev.map(p => {
        if (String(p.id) === String(id)) {
          isNowPrayed = !p.isPrayed;
          return { ...p, isPrayed: isNowPrayed };
        }
        return p;
      });
      syncWithFirebase(newList);
      return newList;
    });

    if (isNowPrayed) {
      try {
        const hoje = new Date().toLocaleDateString('pt-BR');
        const userRef = doc(db, "usuarios", userId);
        await updateDoc(userRef, { 
          pedidosTotalHistorico: increment(1),
          dataUltimaOracao: hoje
        });
      } catch (e) { console.warn("Doc de usuário não encontrado para stats"); }
    }
  }, [userId]);

  const toggleFavorite = useCallback((id: any) => {
    setPrayers(prev => {
      const newList = prev.map(p => String(p.id) === String(id) ? { ...p, isFavorite: !p.isFavorite } : p);
      syncWithFirebase(newList);
      return newList;
    });
  }, [userId]);

  return { prayers, loading, togglePrayed, toggleFavorite };
};