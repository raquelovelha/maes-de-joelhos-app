import React from 'react';

const Home: React.FC<any> = ({ profile, onNavigate }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia, Sentinela";
    if (hour < 18) return "Boa tarde, Débora";
    return "Boa noite, Mãe Intercessora";
  };

  return (
    <div className="flex flex-col gap-8 pb-32 pt-4 animate-fadeIn">
      {/* 1. Header Saudação */}
      <div>
        <h1 className="serif-font text-3xl font-bold text-[#2D1B4D] leading-tight">
          {getGreeting()}, <br/>
          <span className="text-brand-rose">{profile.name}</span>
        </h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
          "Mães de joelhos, filhos de pé"
        </p>
      </div>

      {/* 2. Card de Chamada para 15 Minutos */}
      <div className="bg-gradient-to-br from-[#5c00b8] to-[#9d50bb] rounded-[3rem] p-8 shadow-2xl shadow-purple-200 relative overflow-hidden group">
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-white text-2xl font-bold mb-2 italic">Seu Altar de Hoje</h2>
          <p className="text-purple-100 text-sm mb-6 leading-relaxed opacity-90 font-light">
            Cinco alvos específicos esperam por sua intercessão agora. Vamos clamar?
          </p>
          <button 
            onClick={() => onNavigate('timer')}
            className="bg-white text-[#5c00b8] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
          >
            Iniciar 15 Minutos
          </button>
        </div>
      </div>

      {/* 3. Versículo de Encorajamento */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-purple-50 shadow-sm text-center relative">
        <i className="fa-solid fa-quote-left text-brand-rose/10 text-5xl absolute top-4 left-4"></i>
        <p className="text-gray-600 text-lg serif-font font-medium leading-relaxed italic relative z-10">
          "Instrui a criança no caminho em que deve andar, e até quando envelhecer não se desviará dele."
        </p>
        <span className="block mt-4 text-[10px] font-black text-brand-rose uppercase tracking-[0.2em]">Provérbios 22:6</span>
      </div>

      {/* 4. Atalhos Rápidos */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('prayers')}
          className="bg-white border border-gray-100 p-6 rounded-[2.5rem] flex flex-col items-center gap-3 shadow-sm active:scale-95 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-rose/5 flex items-center justify-center text-brand-rose text-xl">
            <i className="fa-solid fa-folder-open"></i>
          </div>
          <span className="text-[9px] font-black text-[#2D1B4D] uppercase tracking-widest text-center">Orações & Memorial</span>
        </button>

        <button 
          onClick={() => onNavigate('filhos')}
          className="bg-white border border-gray-100 p-6 rounded-[2.5rem] flex flex-col items-center gap-3 shadow-sm active:scale-95 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-[#5c00b8] text-xl">
            <i className="fa-solid fa-children"></i>
          </div>
          <span className="text-[9px] font-black text-[#2D1B4D] uppercase tracking-widest">Meus Filhos</span>
        </button>
      </div>

      {/* 5. RODAPÉ INSTITUCIONAL (RESTAURADO) */}
      <div className="mt-4 flex flex-col items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="h-[1px] w-12 bg-gray-200"></div>
        <div className="flex items-center justify-center gap-10">
          <img 
            src="/geracao-compromisso-logo.png" 
            alt="Geração Compromisso" 
            className="h-10 object-contain"
          />
          <img 
            src="/mpc-logo.png" 
            alt="MPC Brasil" 
            className="h-8 object-contain"
          />
        </div>
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">
          Uma iniciativa em parceria
        </p>
      </div>
    </div>
  );
};

export default Home;