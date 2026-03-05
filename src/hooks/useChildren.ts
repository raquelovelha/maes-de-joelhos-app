import { useState, useEffect } from 'react';
import { db } from '../firebase';
// @ts-ignore
import { collection, query, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ChildOfPrayer, ChildPrayerRequest } from '../types';

export const useChildren = (initialData: ChildOfPrayer[] = []) => {
  const [children, setChildren] = useState<ChildOfPrayer[]>(initialData);

  // 1. ESCUTA EM TEMPO REAL: Monitora mudanças no Firestore
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

  // 2. ADICIONAR FILHO: Salva um novo registro
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

  // 3. ADICIONAR PEDIDO: Grava um novo motivo de oração
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

  // 4. MARCAR COMO ORADO: Alterna o status do pedido (check/uncheck)
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

  // 5. EXCLUIR FILHO: Remove permanentemente do Firebase
  const deleteChild = async (childId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cadastro? Esta ação não pode ser desfeita.")) {
      try {
        const childRef = doc(db, "filhos", childId);
        await deleteDoc(childRef);
        alert("Cadastro removido com sucesso!");
      } catch (e) {
        console.error("Erro ao excluir:", e);
        alert("Erro ao excluir do banco de dados.");
      }
    }
  };

  // 6. REGISTRAR TEMPO: Acumula minutos de oração
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

  // 7. ACEITAR FILHO: Altera status de pendente para ativo
  const acceptChild = async (id: string) => {
    try {
      const childRef = doc(db, "filhos", id);
      await updateDoc(childRef, { status: 'active' });
    } catch (e) {
      console.error("Erro ao aceitar filho:", e);
    }
  };

  // RETORNO: Exporta tudo para ser usado nos componentes
  return { 
    children, 
    addChild, 
    acceptChild, 
    addRequest, 
    toggleRequestStatus, 
    registerPrayerTime,
    deleteChild // Função de exclusão disponível agora!
  };
};