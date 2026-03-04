
import { useState, useCallback } from 'react';
import { PrayerRequest } from '../types';

// Responsabilidade: Gerenciar estado e operações de Orações.
export const usePrayers = (initialData: PrayerRequest[]) => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>(initialData);

  const togglePrayed = useCallback((id: number) => {
    setPrayers(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, isPrayed: !p.isPrayed } : p);
      
      // Lógica de Ciclo de 105 Orações
      if (updated.length >= 105 && updated.every(p => p.isPrayed)) {
        alert("Glória a Deus! Você completou o ciclo de 105 orações. Um novo ciclo se inicia!");
        return updated.map(p => ({ ...p, isPrayed: false }));
      }
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setPrayers(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  }, []);

  const updateNote = useCallback((id: number, note: string) => {
    setPrayers(prev => prev.map(p => p.id === id ? { ...p, personalNotes: note } : p));
  }, []);

  return {
    prayers,
    togglePrayed,
    toggleFavorite,
    updateNote
  };
};
