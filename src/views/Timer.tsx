import React, { useEffect, useMemo } from 'react';

const Timer: React.FC<any> = ({ prayers, timeLeft, setTimeLeft, isTimerActive, setIsTimerActive, onFinish }) => {
  
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

  if (!prayers || prayers.length === 0) return <div className="p-10 text-center">Carregando alvos...</div>;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fadeIn">
      <div className="text-7xl font-black text-[#2D1B4D] mb-8 tabular-nums">{formatTime(timeLeft)}</div>
      
      <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-purple-50 w-full max-w-sm text-center relative">
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-4">
          Alvo {currentStep + 1} de 5
        </span>
        <h3 className="serif-font text-2xl font-bold text-[#2D1B4D] mb-4 italic">
          "{alvoAtual?.title || alvoAtual?.titulo}"
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed italic">
          {alvoAtual?.description || alvoAtual?.descricao}
        </p>
        {alvoAtual?.biblicalReference && (
          <div className="mt-4 text-[#5c00b8] font-bold text-[10px] uppercase">
             <i className="fa-solid fa-book-open mr-1"></i> {alvoAtual.biblicalReference}
          </div>
        )}
      </div>

      <button 
        onClick={() => setIsTimerActive(!isTimerActive)}
        className="mt-10 bg-[#5c00b8] text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest shadow-lg"
      >
        {isTimerActive ? 'Pausar' : 'Continuar'}
      </button>
    </div>
  );
};

export default Timer;