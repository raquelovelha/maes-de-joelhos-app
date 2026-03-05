import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth'; // Importante para filtrar por usuário
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  where 
} from "firebase/firestore"; // Use as importações normais se estiver usando npm
import { Child, ChildPrayerRequest } from '../types';

export const useChildren = (initialData: Child[] = []) => {
  const [children, setChildren] = useState<Child[]>(initialData);
  const auth = getAuth();
  const user = auth.currentUser;

  // 1. ESCUTA EM TEMPO REAL: Filtrando pelo ID da mãe logada
  useEffect(() => {
    if (!user) return;

    try {
      // Adicionamos um filtro 'where' para que uma mãe não veja os filhos da outra
      const q = query(
        collection(db, "filhos"), 
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const childrenArray: Child[] = [];
        querySnapshot.forEach((doc) => {
          childrenArray.push({ id: doc.id, ...doc.data() } as Child);
        });
        setChildren(childrenArray);
      }, (error) => {
        console.error("Erro na escuta do Firebase:", error);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Erro ao conectar com o Firestore:", error);
    }
  }, [user]);

  // 2. ADICIONAR FILHO: Agora salvando o 'type' e o 'userId'
  const addChild = async (childData: Omit<Child, 'id' | 'requests'>) => {
    if (!user) return;
    
    try {
      const childToSave = {
        ...childData,
        userId: user.uid, // Vincula o filho à mãe logada
        status: 'active',
        startDate: new Date().toISOString(),
        prayerMinutes: 0,
        requests: [] // Nome corrigido para 'requests'
      };
      await addDoc(collection(db, "filhos"), childToSave);
    } catch (e: any) {
      alert("Erro ao salvar: " + e.message);
    }
  };

  // 3. ADICIONAR PEDIDO: Sincronizado com os nomes da View
  const addRequest = async (childId: string, title: string) => {
    try {
      const childRef = doc(db, "filhos", childId);
      const child = children.find(c => c.id === childId);
      if (!child) return;

      const newRequest = {
        id: crypto.randomUUID(),
        title: title, // Usando 'title' em vez de 'text'
        completed: false, // Usando 'completed' em vez de 'isCompleted'
        createdAt: new Date().toISOString()
      };

      await updateDoc(childRef, {
        requests: [...(child.requests || []), newRequest]
      });
    } catch (e) {
      console.error("Erro ao adicionar pedido:", e);
    }
  };

  // 4. MARCAR COMO ORADO: Sincronizado com os nomes da View
  const toggleRequestStatus = async (childId: string, requestId: string) => {
    try {
      const childRef = doc(db, "filhos", childId);
      const child = children.find(c => c.id === childId);
      if (!child) return;

      const updatedRequests = child.requests.map(req => 
        req.id === requestId ? { ...req, completed: !req.completed } : req
      );

      await updateDoc(childRef, { requests: updatedRequests });
    } catch (e) {
      console.error("Erro ao atualizar pedido:", e);
    }
  };

  // 5. EXCLUIR FILHO (Mantido)
  const deleteChild = async (childId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cadastro?")) {
      try {
        await deleteDoc(doc(db, "filhos", childId));
      } catch (e) {
        console.error("Erro ao excluir:", e);
      }
    }
  };

  // 6. REGISTRAR TEMPO (Mantido)
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

  return { 
    children, 
    addChild, 
    addRequest, 
    toggleRequestStatus, 
    registerPrayerTime,
    deleteChild 
  };
};