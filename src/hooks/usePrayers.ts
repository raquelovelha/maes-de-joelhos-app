import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import { PrayerRequest } from '../types';

export const usePrayers = () => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const loadData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      // 1. CORREÇÃO: Coleção correta é 'prayers' (conforme sua planilha importada)
      // Se no seu Firebase a coleção tiver outro nome, mude "prayers" abaixo.
      const qSugestoes = query(collection(db, "prayers")); 
      const snapSugestoes = await getDocs(qSugestoes);
      
      const userDocSnap = await getDoc(doc(db, "user_progress", userId));
      const userProgress = userDocSnap.exists() ? userDocSnap.data().prayers || {} : {};

      const combinedData = snapSugestoes.docs.map(docSnap => {
        const data = docSnap.data();
        // 2. CORREÇÃO: Mapeando os nomes exatos da sua planilha
        const id = docSnap.id;
        const progress = userProgress[id] || {};

        return {
          id: id,
          // Pega 'tema' ou 'Tema' ou 'categoria' (flexibilidade para acentos)
          category: data.tema || data.Tema || data.categoria || "GERAL",
          // Pega 'pedido' ou 'texto' ou 'Pedido Original'
          description: data.pedido || data.texto || data["Pedido Original"] || "",
          // Pega 'referencia' ou 'versiculo'
          verse: data.referencia || data.versiculo || data["Referência Bíblica"] || "",
          dia: data.dia || data.ordem || 0,
          isPrayed: !!progress.isPrayed,
          isFavorite: !!progress.isFavorite,
          personalNotes: progress.personalNotes || ''
        } as unknown as PrayerRequest;
      });

      // Ordena pelo dia (para ficar na ordem da planilha)
      combinedData.sort((a: any, b: any) => (a.dia || 0) - (b.dia || 0));
      
      setPrayers(combinedData as any);
    } catch (e) {
      console.error("Erro ao carregar orações:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
  }, [userId]);

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

  return { prayers, toggleFavorite, togglePrayed, updateNote, loading };
};