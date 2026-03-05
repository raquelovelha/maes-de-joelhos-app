import React from 'react';

interface HomeProps {
  profile: any;
}

const Home: React.FC<HomeProps> = ({ profile }) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-24 px-2">
      {/* CARD DE SUGESTÃO DINÂMICA */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem] p-8 shadow-sm border border-purple-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-4">Sugestão para hoje</p>
        
        <h3 className="serif-font text-2xl font-bold text-brand-dark mb-2">"Efésios 6:11"</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Para que sejam protegidos contra as ciladas do inimigo.
        </p>
        
        <div className="inline-block bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-purple-100">
          <span className="text-[9px] font-black text-purple-500 uppercase">Categoria: Proteção</span>
        </div>
      </div>

      {/* STATUS CARDS ATUALIZADOS */}
      <div className="grid grid-cols-2 gap-4">
        {/* PEDIDOS (Antiga Ofensiva) */}
        <div className="bg-orange-50/50 rounded-[2.5rem] p-6 border border-orange-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
            <i className="fa-solid fa-hands-praying text-orange-500"></i>
          </div>
          <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Pedidos</p>
          <p className="text-2xl font-black text-orange-600">
            {profile.pedidosConcluidos || 0}
          </p>
        </div>

        {/* TEMPO EM ORAÇÃO (Antigo Orado) */}
        <div className="bg-pink-50/50 rounded-[2.5rem] p-6 border border-pink-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
            <i className="fa-solid fa-clock text-brand-rose"></i>
          </div>
          <p className="text-[9px] font-black text-brand-rose uppercase tracking-widest mb-1">Tempo em Oração</p>
          <p className="text-2xl font-black text-brand-rose">
            {profile.minutosIntercedidos || 0}m
          </p>
        </div>
      </div>

      {/* CARD DE PARCEIRO / PROJETO */}
      <div className="bg-[#5c00b8] rounded-[3.5rem] p-2 shadow-xl shadow-purple-100 group active:scale-[0.98] transition-all">
        <div className="p-6">
           <div className="flex items-center justify-between mb-4">
             <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Orando pela...</p>
             <i className="fa-solid fa-chevron-right text-white/40 group-hover:translate-x-1 transition-transform"></i>
           </div>
           <div className="bg-white rounded-[2.5rem] py-8 flex items-center justify-center">
              <img 
                src="https://geracaocompromisso.com/wp-content/uploads/2022/02/Logo-GC-site-01.png" 
                alt="Geração Compromisso" 
                className="h-12 object-contain"
              />
           </div>
        </div>
      </div>

      {/* RODAPÉ INSTITUCIONAL */}
      <div className="text-center space-y-4 py-8">
        <p className="serif-font italic text-brand-dark text-sm tracking-wide">
          "Mães de joelhos, filhos de pé!"
        </p>
        <div className="space-y-1">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Somos um departamento da MPC</p>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">(Mocidade para Cristo) e</p>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">trabalhamos juntamente com todos</p>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">os departamentos desta missão.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;