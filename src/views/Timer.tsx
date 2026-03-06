import React, { useEffect, useMemo } from 'react';

const Timer: React.FC<any> = ({ prayers = [], timeLeft, setTimeLeft, isTimerActive, setIsTimerActive, onFinish }) => {
  
  const missaoDoDia = useMemo(() => {
    if (!prayers || prayers.length === 0) return [];
    const seed = new Date().getDate();
    return [...prayers].sort(() => 0.5 - Math.random() * seed).slice(0, 5);
  }, [prayers]);

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev: number) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, setTimeLeft]);

  const currentStep = Math.floor(((15 * 60) - timeLeft) / 180);
  const alvoAtual = missaoDoDia[currentStep < 5 ? currentStep : 4];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!prayers || prayers.length === 0) return <div className="p-10 text-center">Carregando alvos de oração...</div>;

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 animate-fadeIn">
      <div className="text-7xl font-black text-[#2D1B4D] mb-8 tabular-nums tracking-tighter">
        {formatTime(timeLeft)}
      </div>
      
      <div className="bg-white rounded-[3.5rem] p-10 shadow-[0_20px_60px_rgba(92,0,184,0.1)] border border-purple-50 w-full max-w-sm text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
        
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-4">
          Alvo {currentStep + 1} de 5
        </span>

        <h3 className="serif-font text-2xl font-bold text-[#2D1B4D] mb-2 italic">
          "Oração do Dia"
        </h3>
        
        <span className="text-[9px] font-bold text-purple-600 uppercase block mb-4">
          {alvoAtual?.category || alvoAtual?.categoria || 'Intercessão'}
        </span>

        <p className="text-gray-500 text-base leading-relaxed font-light italic mb-6">
          "{alvoAtual?.description || alvoAtual?.descricao}"
        </p>

        {(alvoAtual?.biblicalReference || alvoAtual?.referencia) && (
          <div className="flex items-center justify-center gap-2 text-[#5c00b8] font-bold text-[10px] bg-purple-50 py-2 px-4 rounded-xl mx-auto w-fit">
            <i className="fa-solid fa-book-bible"></i>
            <span>{alvoAtual?.biblicalReference || alvoAtual?.referencia}</span>
          </div>
        )}
      </div>

      <button 
        onClick={() => setIsTimerActive(!isTimerActive)}
        className="mt-10 bg-[#5c00b8] text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
      >
        {isTimerActive ? 'Pausar' : 'Continuar'}
      </button>
    </div>
  );
};

export default Timer;