import React from 'react';

const Home: React.FC<any> = ({ profile, onNavigate }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia, Sentinela";
    if (hour < 18) return "Boa tarde, Débora";
    return "Boa noite, Mãe Intercessora";
  };

  return (
    <div className="flex flex-col gap-8 pb-24 animate-fadeIn">
      {/* 1. HEADER AFETIVO */}
      <div className="mt-4">
        <h1 className="serif-font text-3xl font-bold text-[#2D1B4D] leading-tight">
          {getGreeting()}, <br/>
          <span className="text-brand-rose">{profile.name}</span>
        </h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
          "Mães de joelhos, filhos de pé"
        </p>
      </div>

      {/* 2. CARD DE CHAMADA PRINCIPAL (TIMER) */}
      <div className="bg-gradient-to-br from-[#5c00b8] to-[#9d50bb] rounded-[3rem] p-8 shadow-2xl shadow-purple-200 relative overflow-hidden group">
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
        
        <div className="relative z-10">
          <h2 className="text-white text-2xl font-bold mb-2">15 Minutos de Clamor</h2>
          <p className="text-purple-100 text-sm mb-6 leading-relaxed opacity-90">
            Cinco alvos específicos esperam por sua intercessão agora. Vamos juntas?
          </p>
          <button 
            onClick={() => onNavigate('timer')}
            className="bg-white text-[#5c00b8] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg active:scale-95 transition-all"
          >
            Iniciar Altar Hoje
          </button>
        </div>
      </div>

      {/* 3. VERSÍCULO DO DIA */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-purple-50 shadow-sm text-center italic">
        <i className="fa-solid fa-quote-left text-brand-rose/20 text-4xl mb-2 block"></i>
        <p className="text-gray-600 text-lg serif-font font-medium leading-relaxed">
          "Instrui a criança no caminho em que deve andar, e até quando envelhecer não se desviará dele."
        </p>
        <span className="block mt-4 text-[10px] font-black text-brand-rose uppercase tracking-[0.2em]">Provérbios 22:6</span>
      </div>

      {/* 4. ATALHOS RÁPIDOS (Grelha) */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('prayers')}
          className="bg-brand-rose/5 border border-brand-rose/10 p-5 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-rose shadow-sm">
            <i className="fa-solid fa-book-open-reader"></i>
          </div>
          <span className="text-[10px] font-black text-[#2D1B4D] uppercase">Pastas de Oração</span>
        </button>

        <button 
          onClick={() => onNavigate('filhos')}
          className="bg-purple-50 border border-purple-100 p-5 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#5c00b8] shadow-sm">
            <i className="fa-solid fa-children"></i>
          </div>
          <span className="text-[10px] font-black text-[#2D1B4D] uppercase">Meus Filhos</span>
        </button>
      </div>
    </div>
  );
};

export default Home;