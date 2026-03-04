import { useState, useCallback } from 'react';
import { ChildOfPrayer, ChildPrayerRequest } from '../types';
import dadosFilhos from '../assets/filhos.json';

// Função para converter o JSON do Excel para o formato que o App entende
const transformarDadosIniciais = (): ChildOfPrayer[] => {
  // Filtramos o primeiro item se ele estiver vazio e mapeamos o restante
  return dadosFilhos
    .filter(item => item.Assistido !== "") 
    .map((item) => ({
      id: item.Código || Math.random().toString(36).substr(2, 9),
      name: item.Assistido,
      type: 'biologico', // Padrão inicial
      birthDate: item["Data de Nascimento Assistido"],
      whatsapp: item["Telefone Assistido"],
      prayerMinutes: 0,
      status: 'active',
      individualRequests: item.Descrição ? [{
        id: 'req-' + (item.Código || '1'),
        request: item.Descrição,
        status: 'em_oracao',
        createdAt: new Date().toISOString()
      }] : []
    }));
};

export const useChildren = () => {
  // Iniciamos o estado já com os dados do JSON transformados
  const [children, setChildren] = useState<ChildOfPrayer[]>(transformarDadosIniciais());

  const addChild = useCallback(async (child: ChildOfPrayer) => {
    setChildren(prev => [child, ...prev]);
  }, []);

  const updateChild = useCallback((childId: string, updateFn: (child: ChildOfPrayer) => ChildOfPrayer) => {
    setChildren(prev => prev.map(c => c.id === childId ? updateFn(c) : c));
  }, []);

  const addRequest = useCallback((childId: string, request: ChildPrayerRequest) => {
    updateChild(childId, (child) => ({
      ...child,
      individualRequests: [request, ...child.individualRequests]
    }));
  }, [updateChild]);

  const toggleRequestStatus = useCallback((childId: string, requestId: string) => {
    updateChild(childId, (child) => ({
      ...child,
      individualRequests: child.individualRequests.map(r => {
        if (r.id === requestId) {
          const newStatus = r.status === 'em_oracao' ? 'respondido' : 'em_oracao';
          return {
            ...r,
            status: newStatus,
            resolvedAt: newStatus === 'respondido' ? new Date().toISOString() : undefined
          };
        }
        return r;
      })
    }));
  }, [updateChild]);

  const acceptChild = useCallback((childId: string) => {
    updateChild(childId, (child) => ({ ...child, status: 'active' }));
  }, [updateChild]);

  const registerPrayerTime = useCallback((childId: string, minutes: number = 1) => {
    updateChild(childId, (child) => ({ ...child, prayerMinutes: child.prayerMinutes + minutes }));
  }, [updateChild]);

  return {
    children,
    addChild,
    addRequest,
    toggleRequestStatus,
    acceptChild,
    registerPrayerTime
  };
};