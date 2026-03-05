import React from 'react';

interface HomeProps {
  profile?: any; // O '?' evita erro se o profile demorar a carregar
}

const Home: React.FC<HomeProps> = ({ profile }) => {
  // Garantia de que o app não quebre se o profile for nulo
  const pedidosConcluidos = profile?.pedidosConcluidos || 0;
  const minutosTotais = profile?.minutosIntercedidos || 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-24 px-2">
      {/* CARD DE SUGESTÃO */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem] p-8 shadow-sm border border-purple-100/50 relative overflow-hidden">
        <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-4">Sugestão para hoje</p>
        <h3 className="serif-font text-2xl font-bold text-brand-dark mb-2">"Efésios 6:11"</h3>
        <p className="text-sm text-gray-600 leading-relaxed">Para que sejam protegidos contra as ciladas do inimigo.</p>
      </div>

      {/* STATUS CARDS - AGORA COM NOMES NOVOS */}
      <div className="grid grid-cols-2 gap-4">
        {/* PEDIDOS */}
        <div className="bg-orange-50/50 rounded-[2.5rem] p-6 border border-orange-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
            <i className="fa-solid fa-hands-praying text-orange-500"></i>
          </div>
          <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Pedidos</p>
          <p className="text-2xl font-black text-orange-600">{pedidosConcluidos}</p>
        </div>

        {/* TEMPO EM ORAÇÃO */}
        <div className="bg-pink-50/50 rounded-[2.5rem] p-6 border border-pink-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
            <i className="fa-solid fa-clock text-brand-rose"></i>
          </div>
          <p className="text-[9px] font-black text-brand-rose uppercase tracking-widest mb-1">Tempo em Oração</p>
          <p className="text-2xl font-black text-brand-rose">{minutosTotais}m</p>
        </div>
      </div>

      {/* PARCEIRO */}
      <div className="bg-[#5c00b8] rounded-[3.5rem] p-8 flex items-center justify-center">
        <img 
          src="https://geracaocompromisso.com/wp-content/uploads/2022/02/Logo-GC-site-01.png" 
          alt="Geração Compromisso" 
          className="h-10 object-contain brightness-0 invert" 
        />
      </div>

      {/* FOOTER */}
      <div className="text-center py-4">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Mães de joelhos, filhos de pé!</p>
      </div>
    </div>
  );
};

export default Home;