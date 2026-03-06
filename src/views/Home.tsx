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

  // Logos Oficiais
  const logoGC = "https://i.postimg.cc/MKLSGrq8/GC-horizontal-cores-gradiente-fundoclaro.png";
  const logoMPC = "https://i.postimg.cc/ryDdx9qp/logo-Logo-P-B-Completa.png";

  // Função para compartilhar o versículo no WhatsApp
  const shareVerse = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita navegar para a aba de oração ao clicar no ícone de compartilhar
    const verse = profile?.verseOfTheDay || "Revistam-se de toda a armadura de Deus. - Efésios 6:11";
    const text = encodeURIComponent(`🙏 Minha palavra de hoje no App Mães de Joelhos: \n\n"${verse}"`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-32 px-4 pt-6">
      
      {/* HEADER: SAUDAÇÃO PERSONALIZADA */}
      <div className="px-2 flex justify-between items-center mb-2">
        <div>
          <h1 className="serif-font text-3xl font-bold text-[#2D1B4D]">
            Olá, {profile?.name?.split(' ')[0] || "Missionária"}!
          </h1>
          <p className="text-[#FF4D8C] text-[10px] font-black uppercase tracking-widest">Bom dia com o Senhor</p>
        </div>
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
           <i className="fa-solid fa-crown text-amber-400"></i>
        </div>
      </div>

      {/* CARD PREMIUM: VERSÍCULO DINÂMICO DO DIA */}
      <div 
        onClick={() => onNavigate && onNavigate('prayers')}
        className="relative overflow-hidden bg-gradient-to-br from-[#FF5722] to-[#FF8A65] rounded-[2.5rem] p-8 shadow-xl shadow-orange-100 active:scale-[0.98] transition-all cursor-pointer"
      >
        {/* Marca d'água de aspas */}
        <i className="fa-solid fa-quote-right absolute -right-4 -bottom-4 text-white/10 text-8xl"></i>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              Palavra do Dia
            </span>
          </div>
          
          <p className="serif-font text-xl text-white leading-relaxed italic mb-5">
            "{profile?.verseOfTheDay || "Revistam-se de toda a armadura de Deus, para poderem ficar firmes contra as ciladas do Diabo. - Efésios 6:11"}"
          </p>
          
          <div className="flex items-center justify-between border-t border-white/20 pt-4">
             <span className="text-[9px] font-black text-white/80 uppercase tracking-tighter flex items-center gap-2">
                <i className="fa-solid fa-hand-holding-heart"></i>
                Toque para interceder agora
             </span>
             <button 
               onClick={shareVerse}
               className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors flex items-center justify-center"
             >
                <i className="fa-solid fa-share-nodes text-white text-xs"></i>
             </button>
          </div>
        </div>
      </div>

      {/* STATUS RÁPIDO: DASHBOARD DO DIA */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[2.5rem] p-6 flex flex-col items-center text-center border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-[#FFF7ED] rounded-2xl flex items-center justify-center mb-3">
             <i className="fa-solid fa-fire text-orange-500"></i>
          </div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Pedidos Hoje</p>
          <p className="text-2xl font-black text-[#2D1B4D]">{pedidosHoje}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 flex flex-col items-center text-center border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-[#FDF2F8] rounded-2xl flex items-center justify-center mb-3">
             <i className="fa-solid fa-clock text-pink-500"></i>
          </div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tempo Hoje</p>
          <p className="text-2xl font-black text-[#2D1B4D]">{tempoHoje}m</p>
        </div>
      </div>

      {/* SEÇÃO INSTITUCIONAL: GERAÇÃO COMPROMISSO */}
      <div className="bg-[#5c00b8] rounded-[2.5rem] p-4 shadow-xl shadow-purple-100">
        <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] mb-3 ml-4 italic font-black">Filhos de oração...</p>
        <div className="bg-white rounded-[2rem] py-8 flex items-center justify-center px-8 min-h-[100px]">
          <img 
            src={logoGC} 
            alt="Geração Compromisso" 
            className="w-full max-w-[180px] h-auto object-contain block mx-auto"
          />
        </div>
      </div>

      {/* FOOTER: MPC BRASIL */}
      <div className="text-center space-y-5 pt-4 pb-6 px-6">
        <div className="flex items-center justify-center gap-2">
           <div className="h-[1px] w-8 bg-gray-200"></div>
           <p className="text-[11px] font-black text-purple-800 uppercase italic tracking-[0.15em]">
             Mães de joelhos, filhos de pé!
           </p>
           <div className="h-[1px] w-8 bg-gray-200"></div>
        </div>
        
        <div className="space-y-4">
          <p className="text-[9px] text-gray-400 font-bold uppercase leading-relaxed max-w-[280px] mx-auto">
            Somos um departamento da MPC (Mocidade Para Cristo) e trabalhamos juntamente com todos os departamentos desta missão.
          </p>
          
          <img 
            src={logoMPC} 
            alt="MPC Brasil" 
            className="h-8 w-auto object-contain block mx-auto grayscale opacity-60"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;