import React from 'react';

interface HomeProps {
  profile?: any;
  onNavigate?: (tab: string) => void; // Função para trocar de aba
}

const Home: React.FC<HomeProps> = ({ profile, onNavigate }) => {
  
  // Lógica de data para resetar os contadores da Home
  const hoje = new Date().toLocaleDateString('pt-BR');
  const dataUltimaOracao = profile?.dataUltimaOracao || "";
  const isMesmoDia = hoje === dataUltimaOracao;
  
  const pedidosHoje = isMesmoDia ? (profile?.pedidosConcluidosHoje || 0) : 0;
  const tempoHoje = isMesmoDia ? (profile?.minutosHoje || 0) : 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-32 px-4">
      
      {/* CARD INTERATIVO: VAMOS ORAR? */}
      <div 
        onClick={() => onNavigate && onNavigate('oracoes')} // Troca para a aba de orações
        className="bg-gradient-to-br from-orange-50 to-orange-100/80 rounded-[3rem] p-8 border border-orange-200/50 shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-4">
          <p className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em]">Vamos orar?</p>
          <i className="fa-solid fa-chevron-right text-orange-300 group-hover:translate-x-1 transition-transform"></i>
        </div>
        
        <h3 className="serif-font text-2xl font-bold text-brand-dark mb-3">Efésios 6:11</h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          "Revistam-se de toda a armadura de Deus, para poderem ficar firmes contra as ciladas do Diabo."
        </p>
        <div className="bg-white/50 rounded-2xl p-3 inline-flex items-center gap-2">
          <i className="fa-solid fa-hands-praying text-orange-500 text-xs"></i>
          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">Toque para ver todos os motivos</span>
        </div>
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

      {/* SEÇÃO GERAÇÃO COMPROMISSO */}
      <div className="space-y-3">
        <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-[0.3em] text-center">Filhos de oração</p>
        <div className="bg-[#5c00b8] rounded-[3.5rem] p-3 shadow-xl shadow-purple-200">
          <div className="bg-white rounded-[3rem] py-12 flex items-center justify-center px-8">
            <img 
              src="https://geracaocompromisso.com/wp-content/uploads/2022/02/Logo-GC-site-01.png" 
              alt="Geração Compromisso" 
              className="w-full max-w-[180px] h-auto object-contain block mx-auto"
              style={{ minHeight: '50px' }}
              onLoad={() => console.log("Logo carregada")}
              onError={(e) => {
                console.log("Erro na logo, tentando link alternativo");
                (e.target as HTMLImageElement).src = "https://geracaocompromisso.com/wp-content/uploads/2022/02/Logo-GC-site-01.png";
              }}
            />
          </div>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter italic">"Mães de joelhos, filhos de pé!"</p>
      </div>
    </div>
  );
};

export default Home;