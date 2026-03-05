import React, { useState } from 'react';
import { ChildOfPrayer } from '../types';
import { BaseModal, ActionButton, InstitutionalFooter } from '../components/UI';
import { calculateAge, formatPhone } from '../utils/helpers';

interface FilhosProps {
  children: ChildOfPrayer[];
  onAddChild: (child: Omit<ChildOfPrayer, 'id'>) => void;
  onDeleteChild: (id: string) => void;
  onAddRequest: (childId: string, text: string) => void;
  onToggleRequest: (childId: string, requestId: string) => void;
  onRegisterPrayer: (childId: string, minutes: number) => void;
  onAccept: (id: string) => void;
}

const FilhosView: React.FC<FilhosProps> = ({ 
  children, onAddChild, onDeleteChild, onAddRequest, onToggleRequest 
}) => {
  const [modals, setModals] = useState({ add: false, details: false });
  const [selectedChild, setSelectedChild] = useState<ChildOfPrayer | null>(null);
  const [newRequestText, setNewRequestText] = useState('');
  const [formData, setFormData] = useState({ name: '', type: 'biologico' as any, birthDate: '', whatsapp: '' });

  const handleOpenDetails = (child: ChildOfPrayer) => {
    setSelectedChild(child);
    setModals(prev => ({ ...prev, details: true }));
  };

  return (
    <div className="space-y-6 pb-40 animate-fadeIn p-4"> 
      <header className="flex items-center justify-between">
        <h2 className="serif-font text-2xl font-bold text-brand-dark">Filhos de Oração</h2>
        <button onClick={() => setModals({...modals, add: true})} className="bg-brand-gc text-white w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center">
          <i className="fa-solid fa-plus text-xl"></i>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {children.map(child => (
          <div key={child.id} onClick={() => handleOpenDetails(child)} className="bg-white rounded-3xl p-4 border border-brand-border shadow-sm flex gap-4 cursor-pointer">
            <img src={`https://picsum.photos/seed/${child.id}/200`} className="w-16 h-16 rounded-2xl object-cover border" alt="" />
            <div className="flex-1 text-left">
              <h3 className="font-bold text-brand-dark">{child.name}</h3>
              <p className="text-[11px] text-gray-500">{calculateAge(child.birthDate)} anos • {child.type}</p>
            </div>
          </div>
        ))}
      </div>

      <BaseModal isOpen={modals.details} onClose={() => setModals({...modals, details: false})} title={selectedChild?.name || ''}>
        <div className="space-y-6">
          <div className="flex gap-2">
            <input type="text" placeholder="Novo pedido..." className="flex-1 p-3 bg-gray-50 rounded-xl border text-sm" value={newRequestText} onChange={e => setNewRequestText(e.target.value)} />
            <button onClick={() => { onAddRequest(selectedChild!.id, newRequestText); setNewRequestText(''); }} className="bg-brand-primary text-white px-4 rounded-xl">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>

          <div className="space-y-3">
            {selectedChild?.individualRequests?.map((req: any) => (
              <div key={req.id} onClick={() => onToggleRequest(selectedChild!.id, req.id)} className={`p-3 rounded-2xl border flex items-center gap-3 ${req.isCompleted ? 'bg-green-50 opacity-60' : 'bg-white'}`}>
                <i className={`fa-solid ${req.isCompleted ? 'fa-circle-check text-green-500' : 'fa-circle text-gray-200'}`}></i>
                <span className={`text-sm ${req.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>{req.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100 mt-4">
            <button 
              onClick={() => { onDeleteChild(selectedChild!.id); setModals({...modals, details: false}); }}
              className="w-full py-3 text-red-500 font-bold text-[10px] uppercase bg-red-50 rounded-xl flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-trash-can"></i> Excluir Cadastro
            </button>
          </div>
        </div>
      </BaseModal>

      <BaseModal isOpen={modals.add} onClose={() => setModals({...modals, add: false})} title="Novo Filho">
        <div className="space-y-4">
          <input type="text" placeholder="Nome" className="w-full p-4 bg-gray-50 rounded-2xl border" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="date" className="w-full p-4 bg-gray-50 rounded-2xl border" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
          <ActionButton label="Salvar" onClick={() => { onAddChild(formData); setModals({...modals, add: false}); }} fullwidth />
        </div>
      </BaseModal>
      <InstitutionalFooter />
    </div>
  );
};

export default FilhosView;