import React, { useState, useEffect } from 'react';

interface FilhosProps {
  filhos?: any[];
  onNavigate: (tab: string) => void;
}

const Filhos: React.FC<FilhosProps> = ({ filhos = [], onNavigate }) => {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      
      {/* Header Estilizado */}
      <header className="bg-[#2D1B4D] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
              <i className="fa-solid fa-hands-praying text-[#FF4DAD]"></i>
            </div>
            <h2 className="text-white font-bold text-xl tracking-tight">Geração Compromisso</h2>
          </div>
          <p className="text-white/50 text-[10px] uppercase font-black tracking-[0.2em]">Intercessão Diária</p>
        </div>
        <i className="fa-solid fa-child-reaching absolute -right-4 -bottom-4 text-8xl opacity-5 text-white"></i>
      </header>

      {/* Título e Ação */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-brand-dark">Meus Filhos</h3>
        <button 
          onClick={() => onNavigate('home')}
          className="text-[10px] font-black text-[#FF4DAD] bg-rose-50 px-4 py-2 rounded-full border border-rose-100 active:scale-95 transition-all"
        >
          VOLTAR PARA HOME
        </button>
      </div>

      {/* Lista de Filhos */}
      <div className="flex flex-col gap-3">
        {filhos.length > 0 ? (
          filhos.map((filho, index) => (
            <div key={index} className="bg-white p-5 rounded-[2rem] shadow-sm border border-brand-lavender/50 flex items-center gap-4 hover:border-brand-rose/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-lavender/30 to-white text-brand-rose flex items-center justify-center font-bold text-lg shadow-inner">
                {String(filho?.nome || "F")[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#2D1B4D] text-sm">{filho?.nome || "Sem nome"}</span>
                <span className="text-[9px] text-gray-400 uppercase font-black tracking-tighter mt-0.5">
                  {filho?.tipo || "Filho"}
                </span>
              </div>
              <div className="ml-auto opacity-20">
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-brand-lavender flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
               <i className="fa-solid fa-child text-gray-200 text-2xl"></i>
            </div>
            <p className="text-[11px] text-gray-400 font-medium px-10 leading-relaxed italic">
              Nenhum filho cadastrado para intercessão.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filhos;