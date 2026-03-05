import React, { useState } from 'react';
import { Child } from '../types';
import { ActionButton, ProgressBar } from '../components/UI';

interface FilhosProps {
  children: Child[];
  onAddChild: (child: Omit<Child, 'id' | 'requests'>) => void;
  onDeleteChild: (id: string) => void;
  onAddRequest: (childId: string, title: string) => void;
  onToggleRequest: (childId: string, requestId: string) => void;
  onRegisterPrayer: (childId: string, minutes: number) => void;
  onAccept: () => void;
}

const FilhosView: React.FC<FilhosProps> = ({ 
  children, 
  onAddChild, 
  onDeleteChild 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChild, setNewChild] = useState({
    name: '',
    birthDate: '',
    type: 'Biológico' as 'Biológico' | 'Adotivo' | 'Espiritual'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChild.name && newChild.birthDate) {
      onAddChild(newChild);
      setNewChild({ name: '', birthDate: '', type: 'Biológico' });
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex items-center justify-between">
        <h2 className="serif-font text-2xl font-bold text-brand-dark">Meus Filhos</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand-primary text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="grid gap-4">
        {children.length > 0 ? (
          children.map((child) => (
            <div key={child.id} className="bg-white rounded-[2rem] p-6 border border-brand-border shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-black text-brand-rose uppercase tracking-widest bg-brand-pink/30 px-3 py-1 rounded-full mb-2 inline-block">
                    {child.type}
                  </span>
                  <h3 className="serif-font text-xl font-bold text-brand-dark">{child.name}</h3>
                </div>
                <button 
                  onClick={() => onDeleteChild(child.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-2"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
              
              <div className="space-y-3">
                <ProgressBar label="Jornada de Oração" value={12} max={101} color="bg-brand-primary" />
                <p className="text-[10px] text-gray-400 font-medium italic">Nascimento: {new Date(child.birthDate).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-brand-soft rounded-[2rem] border-2 border-dashed border-brand-border">
            <i className="fa-solid fa-children text-4xl text-brand-primary/20 mb-3"></i>
            <p className="text-sm text-gray-500 font-medium">Nenhum filho cadastrado ainda.</p>
          </div>
        )}
      </div>

      {/* MODAL DE CADASTRO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[3rem] p-8 animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h3 className="serif-font text-2xl font-bold text-brand-dark">Novo Filho(a)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-rose uppercase tracking-widest ml-4">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/20"
                  value={newChild.name}
                  onChange={(e) => setNewChild({...newChild, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-rose uppercase tracking-widest ml-4">Data de Nascimento</label>
                <input 
                  type="date" 
                  required
                  className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary/20"
                  value={newChild.birthDate}
                  onChange={(e) => setNewChild({...newChild, birthDate: e.target.value})}
                />
              </div>

              {/* CAMPO DE TIPO DE FILIAÇÃO RESTAURADO */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-rose uppercase tracking-widest ml-4">Tipo de Filiação</label>
                <div className="relative">
                  <select 
                    className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-3 text-sm font-bold outline-none appearance-none focus:ring-2 focus:ring-brand-primary/20"
                    value={newChild.type}
                    onChange={(e) => setNewChild({...newChild, type: e.target.value as any})}
                  >
                    <option value="Biológico">Biológico</option>
                    <option value="Adotivo">Adotivo</option>
                    <option value="Espiritual">Espiritual</option>
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-brand-rose pointer-events-none"></i>
                </div>
              </div>

              <div className="pt-4">
                <ActionButton label="Cadastrar Filho" onClick={() => {}} fullWidth variant="primary" />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilhosView;