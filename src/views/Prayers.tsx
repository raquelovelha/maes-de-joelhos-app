import React, { useState, useEffect, useMemo } from 'react';

const Prayers: React.FC<any> = ({ prayers = [], updateProfileStats }) => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); 
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Seleção dos 5 alvos do dia
  const missaoDoDia = useMemo(() => {
    const seed = new Date().getDate();
    return [...prayers].sort(() => 0.5 - Math.random() * seed).slice(0, 5);
  }, [prayers.length]);

  // Timer
  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && !isFinished) {
      setIsFinished(true);
      setIsTimerActive(false);
      // Aqui você pode chamar a função para salvar os 15min no perfil
      if(updateProfileStats) updateProfileStats(15, 5); 
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, isFinished]);

  // Troca de alvo a cada 3 min (180s)
  useEffect(() => {
    const step = Math.floor(((15 * 60) - timeLeft) / 180);
    if (step < 5 && step !== currentStep) setCurrentStep(step);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 bg-[#5c00b8] z-[200] flex flex-col items-center justify-center p-8 text-white animate-fadeIn">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <i className="fa-solid fa-hands-praying text-4xl"></i>
        </div>
        <h2 className="serif-font text-4xl font-bold mb-2">Amém!</h2>
        <p className="text-center text-white/70 mb-10 italic max-w-xs">
          "Pois onde dois ou três estiverem reunidos em meu nome, ali estou eu no meio deles."
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-white text-purple-600 w-full py-5 rounded-full font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
        >
          Gerar Card de Vitória
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 px-4 pt-8 animate-fadeIn text-center">
      
      {!isTimerActive && timeLeft === 15 * 60 ? (
        <div className="py-12 space-y-8">
          <div className="space-y-2">
            <h2 className="serif-font text-4xl font-bold text-[#2D1B4D]">Hora da Batalha</h2>
            <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em]">Mãe de joelhos, filho de pé</p>
          </div>
          
          <div className="bg-gray-50 rounded-[3rem] p-8 border border-gray-100">
             <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Hoje vamos interceder por 5 áreas específicas da vida dos nossos filhos. Serão 15 minutos de entrega total.
             </p>
             <div className="flex justify-center gap-2 mb-2">
                {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-purple-200"></div>)}
             </div>
          </div>

          <button 
            onClick={() => setIsTimerActive(true)}
            className="bg-[#5c00b8] text-white w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-purple-200 active:scale-95 transition-all"
          >
            Iniciar Intercessão
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* CRONÔMETRO CIRCULAR */}
          <div className="relative inline-block mt-4">
             <svg className="w-56 h-56 transform -rotate-90">
                <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="6" fill="transparent" 
                        strokeDasharray={628} strokeDashoffset={628 - (628 * timeLeft) / (15 * 60)}
                        className="text-purple-600 transition-all duration-1000 stroke-round" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-[#2D1B4D] tracking-tighter">{formatTime(timeLeft)}</span>
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">Tempo de Clamor</span>
             </div>
          </div>

          {/* ALVO ATUAL (SEM BOTÕES) */}
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-purple-100 border border-purple-50 animate-slideUp">
             <span className="bg-orange-100 text-orange-600 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block">
                Alvo {currentStep + 1} de 5
             </span>
             
             <h3 className="serif-font text-2xl font-bold text-[#2D1B4D] mb-4 italic leading-tight">
                "{missaoDoDia[currentStep]?.title}"
             </h3>
             <p className="text-gray-500 text-base leading-relaxed italic font-light">
                {missaoDoDia[currentStep]?.description}
             </p>

             {/* BARRA DE PROGRESSO DO ALVO ATUAL (3 MIN) */}
             <div className="mt-8 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 transition-all duration-1000" 
                     style={{ width: `${((180 - (timeLeft % 180)) / 180) * 100}%` }}></div>
             </div>
          </div>

          <button 
            onClick={() => setIsTimerActive(!isTimerActive)}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-purple-600 transition-colors"
          >
            {isTimerActive ? <><i className="fa-solid fa-pause mr-2"></i>Pausar Oração</> : <><i className="fa-solid fa-play mr-2"></i>Retomar Oração</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default Prayers;