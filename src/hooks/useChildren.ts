import { useState, useEffect } from 'react';
import { db } from '../firebase';
// @ts-ignore
import { collection, query, onSnapshot, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ChildOfPrayer, ChildPrayerRequest } from '../types';

export const useChildren = (initialData: ChildOfPrayer[] = []) => {
  const [children, setChildren] = useState<ChildOfPrayer[]>(initialData);

  // Monitora o banco de dados em tempo real
  useEffect(() => {
    try {
      const q = query(collection(db, "filhos"));
      const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
        const childrenArray: ChildOfPrayer[] = [];
        querySnapshot.forEach((doc: any) => {
          childrenArray.push({ id: doc.id, ...doc.data() } as ChildOfPrayer);
        });
        setChildren(childrenArray);
      }, (error: any) => {
        console.error("Erro na escuta do Firebase:", error);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Erro ao conectar com o Firestore:", error);
    }
  }, []);

  // Cadastro de novo filho
  const addChild = async (child: Omit<ChildOfPrayer, 'id'>) => {
    try {
      const childToSave = {
        ...child,
        status: 'active',
        startDate: new Date().toISOString(),
        prayerMinutes: 0,
        individualRequests: []
      };
      await addDoc(collection(db, "filhos"), childToSave);
      alert("Filho cadastrado com sucesso!");
    } catch (e: any) {
      alert("Erro ao salvar: " + (e.message || "Erro desconhecido"));
    }
  };

  // ADICIONAR PEDIDO: Grava um novo motivo de oração no Firebase
  const addRequest = async (childId: string, text: string) => {
    try {
      const childRef = doc(db, "filhos", childId);
      const child = children.find(c => c.id === childId);
      if (!child) return;

      const newRequest: ChildPrayerRequest = {
        id: crypto.randomUUID(),
        text: text,
        isCompleted: false,
        createdAt: new Date().toISOString()
      };

      await updateDoc(childRef, {
        individualRequests: [...(child.individualRequests || []), newRequest]
      });
    } catch (e) {
      console.error("Erro ao adicionar pedido:", e);
    }
  };

  // MARCAR COMO ORADO: Alterna o status do pedido no banco
  const toggleRequestStatus = async (childId: string, requestId: string) => {
    try {
      const childRef = doc(db, "filhos", childId);
      const child = children.find(c => c.id === childId);
      if (!child) return;

      const updatedRequests = child.individualRequests.map(req => 
        req.id === requestId ? { ...req, isCompleted: !req.isCompleted } : req
      );

      await updateDoc(childRef, { individualRequests: updatedRequests });
    } catch (e) {
      console.error("Erro ao atualizar pedido:", e);
    }
  };

  // REGISTRAR TEMPO: Soma minutos de oração ao total do filho
  const registerPrayerTime = async (childId: string, minutes: number) => {
    try {
      const childRef = doc(db, "filhos", childId);
      const child = children.find(c => c.id === childId);
      if (!child) return;

      await updateDoc(childRef, {
        prayerMinutes: (child.prayerMinutes || 0) + minutes
      });
    } catch (e) {
      console.error("Erro ao registrar tempo:", e);
    }
  };

  const acceptChild = async (id: string) => {
    try {
      const childRef = doc(db, "filhos", id);
      await updateDoc(childRef, { status: 'active' });
    } catch (e) {
      console.error("Erro ao aceitar filho:", e);
    }
  };

  return { 
    children, 
    addChild, 
    acceptChild, 
    addRequest, 
    toggleRequestStatus, 
    registerPrayerTime 
  };
};