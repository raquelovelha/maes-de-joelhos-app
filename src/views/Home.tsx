import React from 'react';

interface HomeProps {
  profile?: any;
}

const Home: React.FC<HomeProps> = ({ profile }) => {
  // Garante que os valores lidos da coleção 'usuarios' sejam exibidos
  const pedidos = profile?.pedidosConcluidos || 0;
  const tempo = profile?.minutosIntercedidos || 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-24 px-2">
      {/* CARD DE SUGESTÃO */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem] p-8 shadow-sm border border-purple-100/50 relative overflow-hidden">
        <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-4">Sugestão para hoje</p>
        <h3 className="serif-font text-2xl font-bold text-brand-dark mb-2">"Efésios 6:11"</h3>
        <p className="text-sm text-gray-600 leading-relaxed">Para que sejam protegidos contra as ciladas do inimigo.</p>
      </div>

      {/* STATUS CARDS */}
      <div className="grid grid-cols-2 gap-4">
        {/* PEDIDOS - Atualizado do contador real */}
        <div className="bg-orange-50/50 rounded-[2.5rem] p-6 border border-orange-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
            <i className="fa-solid fa-hands-praying text-orange-500"></i>
          </div>
          <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Pedidos</p>
          <p className="text-2xl font-black text-orange-600">{pedidos}</p>
        </div>

        {/* TEMPO EM ORAÇÃO - Atualizado do cronômetro */}
        <div className="bg-pink-50/50 rounded-[2.5rem] p-6 border border-pink-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
            <i className="fa-solid fa-clock text-brand-rose"></i>
          </div>
          <p className="text-[9px] font-black text-brand-rose uppercase tracking-widest mb-1">Tempo em Oração</p>
          <p className="text-2xl font-black text-brand-rose">{tempo}m</p>
        </div>
      </div>

      {/* CARD DA LOGO - Ajustado para visibilidade total */}
      <div className="bg-[#5c00b8] rounded-[3.5rem] p-6 shadow-xl shadow-purple-100 flex flex-col items-center justify-center min-h-[160px]">
        <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-4">Orando pela...</p>
        <div className="bg-white rounded-[2.5rem] w-full py-8 flex items-center justify-center px-4">
          <img 
            src="https://geracaocompromisso.com/wp-content/uploads/2022/02/Logo-GC-site-01.png" 
            alt="Geração Compromisso" 
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter italic">"Mães de joelhos, filhos de pé!"</p>
      </div>
    </div>
  );
};

export default Home;