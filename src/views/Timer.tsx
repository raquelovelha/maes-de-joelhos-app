import React, { useEffect, useMemo } from 'react';

const Timer: React.FC<any> = ({ prayers = [], timeLeft, setTimeLeft, isTimerActive, setIsTimerActive, onFinish }) => {
  
  // Seleção de 5 alvos aleatórios do dia
  const missaoDoDia = useMemo(() => {
    if (!prayers || prayers.length === 0) return [];
    const seed = new Date().getDate();
    return [...prayers].sort(() => 0.5 - Math.random() * seed).slice(0, 5);
  }, [prayers]);

  // Lógica do Cronômetro
  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev: number) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, setTimeLeft]);

  // Define qual dos 5 alvos mostrar baseado no tempo (3 min cada)
  const currentStep = Math.floor(((15 * 60) - timeLeft) / 180);
  const alvoAtual = missaoDoDia[currentStep < 5 ? currentStep : 4];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!prayers || prayers.length === 0) return (
    <div className="p-10 text-center animate-pulse">
      <p className="text-gray-400 italic">Carregando alvos de oração...</p>
    </div>
  );

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 animate-fadeIn">
      {/* Contador Gigante */}
      <div className="text-7xl font-black text-[#2D1B4D] mb-8 tabular-nums tracking-tighter">
        {formatTime(timeLeft)}
      </div>
      
      {/* Card de Oração Detalhado */}
      <div className="bg-white rounded-[3.5rem] p-10 shadow-[0_20px_60px_rgba(92,0,184,0.15)] border border-purple-50 w-full max-w-sm text-center relative overflow-hidden">
        {/* Detalhe estético no topo do card */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-brand-rose to-purple-600"></div>
        
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] block mb-4">
          Alvo {currentStep + 1} de 5
        </span>

        <h3 className="serif-font text-3xl font-bold text-[#2D1B4D] mb-2 italic">
          "Oração do Dia"
        </h3>
        
        {/* Categoria em destaque colorido */}
        <span className="inline-block text-[10px] font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider mb-6">
          {alvoAtual?.category || alvoAtual?.categoria || 'Intercessão'}
        </span>

        {/* DESCRIÇÃO COMPLETA */}
        <p className="text-gray-600 text-lg leading-relaxed font-medium italic mb-8">
          "{alvoAtual?.description || alvoAtual?.descricao || 'Clamando por este alvo...'}"
        </p>

        {/* REFERÊNCIA BÍBLICA COMPLETA */}
        {(alvoAtual?.biblicalReference || alvoAtual?.referencia || alvoAtual?.versiculo) && (
          <div className="flex items-center justify-center gap-2 text-brand-rose font-bold text-xs bg-pink-50/50 py-3 px-5 rounded-2xl mx-auto w-fit border border-pink-100/50">
            <i className="fa-solid fa-book-bible"></i>
            <span>{alvoAtual?.biblicalReference || alvoAtual?.referencia || alvoAtual?.versiculo}</span>
          </div>
        )}
      </div>

      {/* Botão de Controle */}
      <button 
        onClick={() => setIsTimerActive(!isTimerActive)}
        className={`mt-10 px-12 py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
          isTimerActive ? 'bg-gray-100 text-gray-500' : 'bg-[#5c00b8] text-white shadow-purple-200'
        }`}
      >
        {isTimerActive ? 'Pausar' : 'Continuar'}
      </button>
    </div>
  );
};

export default Timer;