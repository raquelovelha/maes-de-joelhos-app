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
      }, (error: any) => {
        console.error("Erro no Snapshot do Firebase:", error);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Erro ao conectar com o Firestore:", error);
    }
  }, []);

  // Função de salvar com limpeza de campos para evitar erros
  const addChild = async (child: Omit<ChildOfPrayer, 'id'>) => {
    try {
      console.log("Iniciando salvamento no Firebase...");
      
      // Criamos um objeto limpo para o Firebase não rejeitar campos 'undefined'
      const childToSave = {
        name: child.name || "Sem Nome",
        type: child.type || "biologico",
        birthDate: child.birthDate || "",
        whatsapp: child.whatsapp || "",
        status: 'active', // Força 'active' para aparecer na lista
        startDate: new Date().toISOString(),
        prayerMinutes: 0,
        individualRequests: [],
        location: child.location || "Não informada",
        notes: child.notes || ""
      };

      const docRef = await addDoc(collection(db, "filhos"), childToSave);
      
      console.log("Sucesso! ID gerado:", docRef.id);
      alert("Filho cadastrado com sucesso!");
    } catch (e: any) {
      console.error("ERRO COMPLETO DO FIREBASE:", e);
      // O alerta agora mostrará o motivo real (ex: falta de permissão)
      alert("Erro ao salvar: " + (e.message || "Erro desconhecido"));
    }
  };

  const acceptChild = (id: string) => {
    console.log("Função acceptChild chamada para:", id);
  };

  const addRequest = (childId: string, text: string) => {
    console.log("Adicionando pedido para:", childId);
  };

  const toggleRequestStatus = (childId: string, requestId: string) => {
    console.log("Alternando status do pedido:", requestId);
  };

  const registerPrayerTime = (childId: string, minutes: number) => {
    console.log("Registrando tempo de oração:", minutes);
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