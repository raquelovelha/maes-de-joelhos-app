import React, { useState } from 'react';
import { ChildOfPrayer, ChildPrayerRequest } from '../types';
import { BaseModal, ActionButton, InstitutionalFooter } from '../components/UI';
import { calculateAge, formatPhone, validateWhatsapp } from '../utils/helpers';

interface FilhosProps {
  children: ChildOfPrayer[];
  onAccept: (id: string) => void;
  onAddChild: (child: Omit<ChildOfPrayer, 'id'>) => void;
  onAddRequest: (childId: string, request: ChildPrayerRequest) => void;
  onToggleRequest: (childId: string, requestId: string) => void;
  onRegisterPrayer: (childId: string) => void;
}

const FilhosView: React.FC<FilhosProps> = ({ 
  children, 
  onAddChild 
}) => {
  const [modals, setModals] = useState({ add: false });
  const [formData, setFormData] = useState({ name: '', type: 'biologico' as any, birthDate: '', whatsapp: '' });
  const [whatsappError, setWhatsappError] = useState('');

  const toggleModal = (key: keyof typeof modals, val: boolean) => {
    setModals(prev => ({ ...prev, [key]: val }));
    if (!val) {
      setWhatsappError('');
      setFormData({ name: '', type: 'biologico', birthDate: '', whatsapp: '' });
    }
  };

  const handleSaveChild = () => {
    if (!formData.name || !formData.birthDate) {
      alert("Nome e nascimento são obrigatórios.");
      return;
    }
    
    if (formData.whatsapp && !validateWhatsapp(formData.whatsapp)) {
      setWhatsappError('Número inválido. Use: (XX) XXXXX-XXXX');
      return;
    }

    onAddChild({
      ...formData,
      location: 'Não informada',
      notes: '',
      startDate: new Date().toISOString(),
      prayerMinutes: 0,
      individualRequests: [],
      status: 'active'
    });
    
    toggleModal('add', false);
  };

  const getSeloStyles = (type: string) => {
    if (type === 'geracao_compromisso') return 'bg-brand-gc text-white border-brand-gc';
    const mapping: any = { 
      biologico: 'bg-brand-soft text-brand-primary', 
      espiritual: 'bg-brand-lavender text-brand-gc', 
      adotivo: 'bg-brand-pink text-brand-rose' 
    };
    return `${mapping[type] || 'bg-gray-100'} border-transparent`;
  };

  return (
    <div className="space-y-6 pb-40 animate-fadeIn"> 
      <header className="flex items-center justify-between">
        <div>
          <h2 className="serif-font text-2xl font-bold text-brand-dark">Filhos de Oração</h2>
        </div>
        <button 
          onClick={() => toggleModal('add', true)} 
          className="bg-brand-gc text-white w-12 h-12 rounded-2xl shadow-lg active:scale-90 flex items-center justify-center transition-transform"
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {children && children.length > 0 ? (
          children.map(child => (
            <div 
              key={child.id} 
              className="bg-white rounded-3xl p-4 border border-brand-border shadow-sm flex gap-4 transition-all"
            >
              <img 
                src={child.photo || `https://picsum.photos/seed/${child.id}/200`} 
                className="w-16 h-16 rounded-2xl object-cover border" 
                alt={child.name} 
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-brand-dark">{child.name}</h3>
                  <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${getSeloStyles(child.type)}`}>
                    {child.type}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  {calculateAge(child.birthDate)} anos • {child.prayerMinutes || 0}m orados
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-gray-300">
            <i className="fa-solid fa-person-praying text-brand-primary/30 text-4xl mb-4"></i>
            <p className="text-gray-400 text-sm text-center italic">
              Nenhum filho cadastrado ou carregando...
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center pt-10">
        <InstitutionalFooter />
      </div>

      <BaseModal 
        isOpen={modals.add} 
        onClose={() => toggleModal('add', false)} 
        title="Novo Filho" 
        subtitle="Cadastrar para Intercessão"
      >
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Nome" 
            className="w-full p-4 bg-gray-50 rounded-2xl border" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          <div className="grid grid-cols-2 gap-3">
            <select 
              className="p-4 bg-gray-50 rounded-2xl border text-sm" 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value as any})}
            >
              <option value="biologico">Biológico</option>
              <option value="espiritual">Espiritual</option>
              <option value="adotivo">Adotivo</option>
              <option value="geracao_compromisso">Geração Compromisso</option>
            </select>
            <input 
              type="date" 
              className="p-4 bg-gray-50 rounded-2xl border text-sm" 
              value={formData.birthDate} 
              onChange={e => setFormData({...formData, birthDate: e.target.value})} 
            />
          </div>
          <input 
            type="tel" 
            placeholder="WhatsApp (XX) XXXXX-XXXX" 
            className={`w-full p-4 bg-gray-50 rounded-2xl border text-sm ${whatsappError ? 'border-red-500' : ''}`} 
            value={formData.whatsapp} 
            onChange={e => { setFormData({...formData, whatsapp: formatPhone(e.target.value)}); setWhatsappError(''); }} 
          />
          {whatsappError && <p className="text-[10px] text-red-500 font-bold ml-2">{whatsappError}</p>}
          
          <div className="pt-2 space-y-3">
            <ActionButton label="Salvar Cadastro" onClick={handleSaveChild} fullwidth />
            <button 
              onClick={() => toggleModal('add', false)} 
              className="w-full py-4 text-gray-500 font-bold uppercase text-[10px] bg-gray-100 rounded-2xl"
            >
              Cancelar
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default FilhosView;