import React from 'react';

interface HomeProps {
  profile?: any;
}

const Home: React.FC<HomeProps> = ({ profile }) => {
  // Pega a data de hoje no formato "DD/MM/AAAA"
  const hoje = new Date().toLocaleDateString('pt-BR');
  const dataUltimaOracao = profile?.dataUltimaOracao || "";

  // Se a data salva for diferente de hoje, mostramos 0 (Reset visual de 24h)
  const isMesmoDia = hoje === dataUltimaOracao;
  const pedidosHoje = isMesmoDia ? (profile?.pedidosConcluidosHoje || 0) : 0;
  const tempoHoje = isMesmoDia ? (profile?.minutosHoje || 0) : 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-32 px-4">
      {/* HEADER "VAMOS ORAR?" */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[3rem] p-8 border border-orange-200/50">
        <p className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] mb-4">Vamos orar?</p>
        <h3 className="serif-font text-2xl font-bold text-brand-dark mb-2">"Efésios 6:11"</h3>
        <p className="text-sm text-gray-600 leading-relaxed italic">"Vistam toda a armadura de Deus..."</p>
      </div>

      {/* STATUS DO DIA */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-3">
            <i className="fa-solid fa-check-double text-orange-500"></i>
          </div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Pedidos Hoje</p>
          <p className="text-3xl font-black text-brand-dark">{pedidosHoje}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-3">
            <i className="fa-solid fa-clock text-brand-rose"></i>
          </div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tempo Hoje</p>
          <p className="text-3xl font-black text-brand-dark">{tempoHoje}m</p>
        </div>
      </div>

      {/* LOGO GERAÇÃO COMPROMISSO */}
      <div className="bg-[#5c00b8] rounded-[3.5rem] p-2 overflow-hidden shadow-xl shadow-purple-200">
        <div className="bg-white rounded-[3rem] py-10 flex items-center justify-center">
          <img 
            src="https://geracaocompromisso.com/wp-content/uploads/2022/02/Logo-GC-site-01.png" 
            alt="Geração Compromisso" 
            className="h-12 w-auto object-contain"
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