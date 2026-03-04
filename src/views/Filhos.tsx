// Responsabilidade: Gestão da lista de filhos e clamores individuais.
import React, { useState } from 'react';
import { ChildOfPrayer, ChildPrayerRequest } from '../types';
import { BaseModal, ActionButton, InstitutionalFooter } from '../components/UI';
import { calculateAge, getStaleStatus, formatPhone, validateWhatsapp } from '../utils/helpers';

interface FilhosProps {
  children: ChildOfPrayer[];
  onAccept: (id: string) => void;
  onAddChild: (child: Omit<ChildOfPrayer, 'id'>) => void; // Ajustado para Omit id
  onAddRequest: (childId: string, request: ChildPrayerRequest) => void;
  onToggleRequest: (childId: string, requestId: string) => void;
  onRegisterPrayer: (childId: string) => void;
}

const FilhosView: React.FC<FilhosProps> = ({ 
  children, 
  onAccept, 
  onAddChild, 
  onAddRequest, 
  onToggleRequest, 
  onRegisterPrayer 
}) => {
  const [modals, setModals] = useState({ add: false });
  const [selectedChild, setSelectedChild] = useState<ChildOfPrayer | null>(null);
  const [viewMode, setViewMode] = useState<'details' | 'requests'>('details');
  const [formData, setFormData] = useState({ name: '', type: 'biologico' as any, birthDate: '', photo: undefined as any, whatsapp: '' });
  const [whatsappError, setWhatsappError] = useState('');
  
  const [reqData, setReqData] = useState({ text: '', verse: '', notes: '' });
  const [isAddingRequest, setIsAddingRequest] = useState(false);

  const toggleModal = (key: keyof typeof modals, val: boolean) => {
      setModals(prev => ({ ...prev, [key]: val }));
      if (!val) {
        setWhatsappError('');
        setFormData({ name: '', type: 'biologico', birthDate: '', photo: undefined, whatsapp: '' });
      }
  };

  const handleSaveChild = () => {
    if (!formData.name || !formData.birthDate) return alert("Nome e nascimento obrigatórios.");
    
    if (formData.whatsapp && !validateWhatsapp(formData.whatsapp)) {
        setWhatsappError('Número inválido. Use o formato: (XX) XXXXX-XXXX');
        return;
    }

    // Criamos o objeto sem o ID, pois o Firebase (addDoc) vai gerar o ID único
    const newChildData: Omit<ChildOfPrayer, 'id'> = {
      ...formData,
      location: 'Não informada',
      notes: '',
      startDate: new Date().toISOString(),
      prayerMinutes: 0,
      individualRequests: [],
      status: 'pending_review'
    };
    
    onAddChild(newChildData);
    toggleModal('add', false);
  };

  const getSeloStyles = (type: string) => {
    if (type === 'geracao_compromisso') return 'bg-brand-gc text-white border-brand-gc';
    const mapping: any = { biologico: 'bg-brand-soft text-brand-primary', espiritual: 'bg-brand-lavender text-brand-gc', adotivo: 'bg-brand-pink text-brand-rose' };
    return `${mapping[type] || 'bg-gray-100'} border-transparent`;
  };

  const openChildDetails = (child: ChildOfPrayer) => {
    setSelectedChild(child);
    setViewMode('details');
    setIsAddingRequest(false);
  };

  return (
    <div className="space-y-6 pb-40 animate-fadeIn"> 
      <header className="flex items-center justify-between">
        <div>
          <h2 className="serif-font text-2xl font-bold text-brand-dark">Filhos de Oração</h2>
        </div>
        <button onClick={() => toggleModal('add', true)} className="bg-brand-gc text-white w-12 h-12 rounded-2xl shadow-lg active:scale-90 flex items-center justify-center transition-transform">
          <i className="fa-solid fa-plus text-xl"></i>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {/* PROTEÇÃO: Verifica se children existe antes de fazer o map */}
        {children && children.length > 0 ? (
          children.map(child => {
            const isPending = child.status === 'pending_review';
            return (
              <div 
                key={child.id} 
                onClick={() => openChildDetails(child