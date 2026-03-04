import { useState, useEffect } from 'react';
import { db } from '../firebase';
// @ts-ignore
import { collection, query, onSnapshot, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ChildOfPrayer } from '../types';

export const useChildren = (initialData: ChildOfPrayer[] = []) => {
  const [children, setChildren] = useState<ChildOfPrayer[]>(initialData);

  // Busca os nomes do Firebase em tempo real
  useEffect(() => {
    try {
      const q = query(collection(db, "filhos"));
      const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
        const childrenArray: ChildOfPrayer[] = [];
        querySnapshot.forEach((doc: any) => {
          childrenArray.push({ id: doc.id, ...doc.data() } as ChildOfPrayer);
        });
        setChildren(childrenArray);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Erro ao conectar com o Firestore:", error);
    }
  }, []);

  // O restante das funções permanece igual...
 const addChild = async (child: Omit<ChildOfPrayer, 'id'>) => {
    try {
      // Adiciona o documento na coleção "filhos" que já existe no seu Firebase
      const docRef = await addDoc(collection(db, "filhos"), {
        ...child,
        status: 'active', // Mudamos para active para aparecer na hora
        startDate: new Date().toISOString(),
        prayerMinutes: 0
      });
      console.log("Filho salvo com ID: ", docRef.id);
      alert("Filho cadastrado com sucesso!");
    } catch (e) {
      console.error("Erro detalhado ao salvar: ", e);
      alert("Erro ao salvar no banco. Verifique o console.");
    }
  };

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