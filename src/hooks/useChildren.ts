import { useState, useEffect } from 'react';
import { db } from '../firebase';
// @ts-ignore
import { collection, query, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";
import { ChildOfPrayer } from '../types';

export const useChildren = (initialData: ChildOfPrayer[] = []) => {
  const [children, setChildren] = useState<ChildOfPrayer[]>(initialData);

  // Busca os nomes do Firebase em tempo real
  useEffect(() => {
    const q = query(collection(db, "filhos"));
    const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
      const childrenArray: ChildOfPrayer[] = [];
      querySnapshot.forEach((doc: any) => {
        childrenArray.push({ id: doc.id, ...doc.data() } as ChildOfPrayer);
      });
      setChildren(childrenArray);
    });
    return () => unsubscribe();
  }, []);

  // Função para a mãe cadastrar um novo filho no banco
  const addChild = async (child: Omit<ChildOfPrayer, 'id'>) => {
    try {
      await addDoc(collection(db, "filhos"), {
        ...child,
        status: 'pending_review',
        startDate: new Date().toISOString()
      });
    } catch (e) {
      console.error("Erro ao salvar filho: ", e);
    }
  };

  // Funções de apoio (vazias por enquanto para não dar erro no App.tsx)
  const acceptChild = (id: string) => {};
  const addRequest = (childId: string, text: string) => {};
  const toggleRequestStatus = (childId: string, requestId: string) => {};
  const registerPrayerTime = (childId: string, minutes: number) => {};

  return { 
    children, 
    addChild, 
    acceptChild, 
    addRequest, 
    toggleRequestStatus, 
    registerPrayerTime 
  };
};