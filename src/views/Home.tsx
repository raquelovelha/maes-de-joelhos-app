import React from 'react';

interface HomeProps {
  profile?: any;
  onNavigate?: (tab: string) => void; 
}

const Home: React.FC<HomeProps> = ({ profile, onNavigate }) => {
  
  const hoje = new Date().toLocaleDateString('pt-BR');
  const dataUltimaOracao = profile?.dataUltimaOracao || "";
  const isMesmoDia = hoje === dataUltimaOracao;
  
  const pedidosHoje = isMesmoDia ? (profile?.pedidosConcluidosHoje || 0) : 0;
  const tempoHoje = isMesmoDia ? (profile?.minutosHoje || 0) : 0;

  // Links diretos do PostIMG (Garantia de visualização)
  const logoGC = "https://i.postimg.cc/MKLSGrq8/GC-horizontal-cores-gradiente-fundoclaro.png";
  const logoMPC = "https://i.postimg.cc/ryDdx9qp/logo-Logo-P-B-Completa.png";

  return (
    <div className="space-y-6 animate-fadeIn pb-32 px-4">
      
      {/* CARD INTERATIVO: VAMOS ORAR? */}
      <div 
        onClick={() => onNavigate && onNavigate('prayers')}
        className="bg-[#F3E8FF] rounded-[3rem] p-8 shadow-sm active:scale-[0.98] transition-all cursor-pointer border border-purple-100"
      >
        <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-4">Vamos orar?</p>
        <h3 className="serif-font text-2xl font-bold text-gray-800 mb-3 leading-tight">"Efésios 6:11"</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">
          "Revistam-se de toda a armadura de Deus, para poderem ficar firmes contra as ciladas do Diabo."
        </p>
        <div className="bg-white/60 rounded-full px-4 py-2 inline-flex items-center gap-2">
          <span className="text-[10px] font-bold text-pink-500 uppercase">Toque para ver todos os motivos</span>
        </div>
      </div>

      {/* STATUS DO DIA */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#FFF7ED] rounded-[2.5rem] p-6 flex flex-col items-center text-center border border-orange-100 shadow-sm">
          <i className="fa-solid fa-fire text-orange-500 mb-2"></i>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Pedidos Hoje</p>
          <p className="text-2xl font-black text-orange-600">{pedidosHoje}</p>
        </div>

        <div className="bg-[#FDF2F8] rounded-[2.5rem] p-6 flex flex-col items-center text-center border border-pink-100 shadow-sm">
          <i className="fa-solid fa-clock text-pink-500 mb-2"></i>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tempo Hoje</p>
          <p className="text-2xl font-black text-pink-600">{tempoHoje}m</p>
        </div>
      </div>

      {/* SEÇÃO GERAÇÃO COMPROMISSO */}
      <div className="space-y-3">
        <div className="bg-[#5c00b8] rounded-[2.5rem] p-4 shadow-xl">
          <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] mb-3 ml-4 italic font-black">Filhos de oração...</p>
          <div className="bg-white rounded-[2rem] py-10 flex items-center justify-center px-8 min-h-[120px]">
            <img 
              src={logoGC} 
              alt="Geração Compromisso" 
              className="w-full max-w-[200px] h-auto object-contain block mx-auto"
            />
          </div>
        </div>
      </div>

      {/* RODAPÉ INSTITUCIONAL COM LOGO MPC */}
      <div className="text-center space-y-4 pt-4 px-6 pb-6">
        <p className="text-[11px] font-black text-purple-800 uppercase italic tracking-[0.15em]">
          Mães de joelhos, filhos de pé!
        </p>
        
        <div className="space-y-5 flex flex-col items-center">
          <p className="text-[9px] text-gray-400 font-bold uppercase leading-relaxed max-w-[280px]">
            Somos um departamento da MPC (Mocidade Para Cristo) e trabalhamos juntamente com todos os departamentos desta missão.
          </p>
          
          <div className="pt-2">
            <img 
              src={logoMPC} 
              alt="MPC Brasil" 
              className="h-10 w-auto object-contain block mx-auto"
              style={{ filter: 'none' }} // Garante que a logo apareça em suas cores originais
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;