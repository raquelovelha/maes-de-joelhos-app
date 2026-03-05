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

  // Função para definir a cor baseada no tipo de filiação
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'Adotivo': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Espiritual': return 'text-purple-600 bg-purple-50 border-purple-100';
      default: return 'text-brand-rose bg-brand-pink/30 border-brand-rose/20';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChild.name && newChild.birthDate) {
      onAddChild(newChild);
      setNewChild({ name: '', birthDate: '', type: 'Biológico' });
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20 px-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="serif-font text-2xl font-bold text-brand-dark">Meus Filhos</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Geração de Déboras</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#FF4500] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </button>
      </div>

      <div className="grid gap-4">
        {children.length > 0 ? (
          children.map((child) => (
            <div key={child.id} className="bg-white rounded-[2.5rem] p-6 border border-brand-border shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border self-start ${getTypeStyles(child.type)}`}>
                    <i className={`fa-solid ${child.type === 'Biológico' ? 'fa-dna' : child.type === 'Adotivo' ? 'fa-heart' : 'fa-dove'} mr-1`}></i>
                    {child.type}
                  </div>
                  <h3 className="serif-font text-2xl font-bold text-brand-dark mt-1">{child.name}</h3>
                </div>
                <button 
                  onClick={() => onDeleteChild(child.id)}
                  className="text-gray-200 hover:text-red-400 transition-colors p-2"
                >
                  <i className="fa-solid fa-circle-xmark text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <ProgressBar label="Jornada 101 Dias" value={child.prayerCount || 0} max={101} color="bg-[#FF4500]" />
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                   <div className="flex items-center gap-2">
                      <i className="fa-solid fa-cake-candles text-brand-rose text-xs"></i>
                      <p className="text-[11px] text-gray-500 font-bold">
                        {new Date(child.birthDate).toLocaleDateString('pt-BR')}
                      </p>
                   </div>
                   <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                      <i className="fa-solid fa-clock text-[#FF4500] text-[10px]"></i>
                      <span className="text-[10px] font-bold text-[#FF4500]">15min diários</span>
                   </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-brand-soft rounded-[3rem] border-2 border-dashed border-brand-border">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <i className="fa-solid fa-children text-3xl text-brand-primary opacity-40"></i>
            </div>
            <p className="text-sm text-gray-500 font-bold">Toque no + para cadastrar seus filhos</p>
            <p className="text-[10px] text-gray-400 px-10 mt-1 italic">"Eis que os filhos são herança do Senhor..."</p>
          </div>
        )}
      </div>

      {/* MODAL DE CADASTRO MELHORADO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[3.5rem] p-10 animate-slideUp shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="serif-font text-2xl font-bold text-brand-dark">Novo Filho(a)</h3>
                <p className="text-xs text-brand-rose font-bold">Cadastre para iniciar a jornada</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="bg-gray-100 w-8 h-8 rounded-full text-gray-400 flex items-center justify-center">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-rose uppercase tracking-widest ml-4">Nome do Filho(a)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Lara Guerreiro"
                  required
                  className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-4 text-sm outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium"
                  value={newChild.name}
                  onChange={(e) => setNewChild({...newChild, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand-rose uppercase tracking-widest ml-4">Nascimento</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-4 text-xs outline-none focus:ring-4 focus:ring-brand-primary/10 font-bold"
                    value={newChild.birthDate}
                    onChange={(e) => setNewChild({...newChild, birthDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand-rose uppercase tracking-widest ml-4">Filiação</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-brand-soft border border-brand-border rounded-full px-6 py-4 text-xs font-bold outline-none appearance-none focus:ring-4 focus:ring-brand-primary/10"
                      value={newChild.type}
                      onChange={(e) => setNewChild({...newChild, type: e.target.value as any})}
                    >
                      <option value="Biológico">Biológico</option>
                      <option value="Adotivo">Adotivo</option>
                      <option value="Espiritual">Espiritual</option>
                    </select>
                    <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-brand-rose pointer-events-none text-[10px]"></i>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full bg-[#FF4500] text-white font-black py-4 rounded-full shadow-xl shadow-orange-100 active:scale-95 transition-all text-sm tracking-widest uppercase"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilhosView;