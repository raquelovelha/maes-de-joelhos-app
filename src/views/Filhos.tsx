import React, { useState } from 'react';
import { ChildOfPrayer, ChildPrayerRequest } from '../types';
import { BaseModal, ActionButton, InstitutionalFooter } from '../components/UI';
import { calculateAge, formatPhone, validateWhatsapp } from '../utils/helpers';

interface FilhosProps {
  children: ChildOfPrayer[];
  onAccept: (id: string) => void;
  onAddChild: (child: Omit<ChildOfPrayer, 'id'>) => void;
  onAddRequest: (childId: string, text: string) => void;
  onToggleRequest: (childId: string, requestId: string) => void;
  onRegisterPrayer: (childId: string, minutes: number) => void;
}

const FilhosView: React.FC<FilhosProps> = ({ 
  children, 
  onAddChild,
  onAddRequest,
  onToggleRequest
}) => {
  const [modals, setModals] = useState({ add: false, details: false });
  const [selectedChild, setSelectedChild] = useState<ChildOfPrayer | null>(null);
  const [newRequestText, setNewRequestText] = useState('');
  const [formData, setFormData] = useState({ name: '', type: 'biologico' as any, birthDate: '', whatsapp: '' });

  const toggleModal = (key: keyof typeof modals, val: boolean) => {
    setModals(prev => ({ ...prev, [key]: val }));
    if (!val && key === 'add') setFormData({ name: '', type: 'biologico', birthDate: '', whatsapp: '' });
  };

  const handleOpenDetails = (child: ChildOfPrayer) => {
    setSelectedChild(child);
    toggleModal('details', true);
  };

  const handleSaveChild = () => {
    if (!formData.name || !formData.birthDate) return alert("Preencha nome e data.");
    onAddChild(formData);
    toggleModal('add', false);
  };

  const handleAddRequest = () => {
    if (!newRequestText || !selectedChild) return;
    onAddRequest(selectedChild.id, newRequestText);
    setNewRequestText('');
  };

  return (
    <div className="space-y-6 pb-40 animate-fadeIn"> 
      <header className="flex items-center justify-between">
        <h2 className="serif-font text-2xl font-bold text-brand-dark">Filhos de Oração</h2>
        <button onClick={() => toggleModal('add', true)} className="bg-brand-gc text-white w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center">
          <i className="fa-solid fa-plus text-xl"></i>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {children.map(child => (
          <div 
            key={child.id} 
            onClick={() => handleOpenDetails(child)}
            className="bg-white rounded-3xl p-4 border border-brand-border shadow-sm flex gap-4 cursor-pointer active:scale-[0.98] transition-all"
          >
            <img src={child.photo || `https://picsum.photos/seed/${child.id}/200`} className="w-16 h-16 rounded-2xl object-cover border" alt={child.name} />
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-bold text-brand-dark">{child.name}</h3>
                <span className="text-[8px] font-black uppercase px-2 py-1 rounded-full bg-brand-soft text-brand-primary">{child.type}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                {calculateAge(child.birthDate)} anos • {child.prayerMinutes || 0}m orados
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE DETALHES E PEDIDOS */}
      <BaseModal isOpen={modals.details} onClose={() => toggleModal('details', false)} title={selectedChild?.name || ''} subtitle="Motivos de Clamor">
        <div className="space-y-6">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Novo pedido..." 
              className="flex-1 p-3 bg-gray-50 rounded-xl border text-sm"
              value={newRequestText}
              onChange={e => setNewRequestText(e.target.value)}
            />
            <button onClick={handleAddRequest} className="bg-brand-primary text-white px-4 rounded-xl">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {selectedChild?.individualRequests?.map((req: any) => (
              <div 
                key={req.id} 
                onClick={() => onToggleRequest(selectedChild.id, req.id)}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${req.isCompleted ? 'bg-green-50 border-green-100 opacity-60' : 'bg-white border-gray-100'}`}
              >
                <i className={`fa-solid ${req.isCompleted ? 'fa-circle-check text-green-500' : 'fa-circle text-gray-200'}`}></i>
                <span className={`text-sm ${req.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>{req.text}</span>
              </div>
            ))}
          </div>
        </div>
      </BaseModal>

      {/* MODAL DE ADICIONAR (MESMO DE ANTES) */}
      <BaseModal isOpen={modals.add} onClose={() => toggleModal('add', false)} title="Novo Filho">
        <div className="space-y-4">
          <input type="text" placeholder="Nome" className="w-full p-4 bg-gray-50 rounded-2xl border" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="date" className="w-full p-4 bg-gray-50 rounded-2xl border" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
          <select className="w-full p-4 bg-gray-50 rounded-2xl border" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
            <option value="biologico">Biológico</option>
            <option value="geracao_compromisso">Geração Compromisso</option>
          </select>
          <ActionButton label="Salvar" onClick={handleSaveChild} fullwidth />
        </div>
      </BaseModal>

      <InstitutionalFooter />
    </div>
  );
};

export default FilhosView;