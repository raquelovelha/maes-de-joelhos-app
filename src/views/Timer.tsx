import React, { useState, useEffect, useMemo } from 'react';

const Timer: React.FC<any> = ({ prayers = [], onFinish }) => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); 
  const [currentStep, setCurrentStep] = useState(0);

  // Seleciona 5 alvos aleatórios do dia
  const missaoDoDia = useMemo(() => {
    const seed = new Date().getDate();
    return [...prayers].sort(() => 0.5 - Math.random() * seed).slice(0, 5);
  }, [prayers.length]);

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  useEffect(() => {
    const step = Math.floor(((15 * 60) - timeLeft) / 180);
    if (step < 5 && step !== currentStep) setCurrentStep(step);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-fadeIn">
      {!isTimerActive && timeLeft === 15 * 60 ? (
        <div className="text-center space-y-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
            <i className="fa-solid fa-stopwatch text-orange-600 text-3xl"></i>
          </div>
          <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Missão Diária</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto italic">
            "5 motivos, 15 minutos. Um clamor que move o coração de Deus."
          </p>
          <button 
            onClick={() => setIsTimerActive(true)}
            className="bg-[#5c00b8] text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-purple-100"
          >
            Começar Agora
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-10 text-center">
          <div className="text-6xl font-black text-[#2D1B4D] tracking-tighter">{formatTime(timeLeft)}</div>
          
          <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-purple-50">
             <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-4">
                Alvo {currentStep + 1} de 5
             </span>
             <h3 className="serif-font text-2xl font-bold text-[#2D1B4D] mb-4 italic leading-tight">
                "{missaoDoDia[currentStep]?.title}"
             </h3>
             <p className="text-gray-500 text-sm italic font-light">
                {missaoDoDia[currentStep]?.description}
             </p>
          </div>

          <button onClick={() => setIsTimerActive(!isTimerActive)} className="text-[#5c00b8] font-black text-[11px] uppercase tracking-widest">
            {isTimerActive ? 'Pausar Intercessão' : 'Retomar Intercessão'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Timer;