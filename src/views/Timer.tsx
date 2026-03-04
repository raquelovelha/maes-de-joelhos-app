
import React, { useState, useEffect, useCallback } from 'react';
import { UserStats } from '../types';

interface TimerProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  onFinish: () => void;
}

const TimerView: React.FC<TimerProps> = ({ stats, setStats, onFinish }) => {
  const [seconds, setSeconds] = useState(15 * 60); // 15 minutes
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleComplete = useCallback(() => {
    setIsActive(false);
    setStats(prev => ({
      ...prev,
      totalMinutes: prev.totalMinutes + 15,
      hasDailyTrophy: true
    }));
    alert("Parabéns! Você concluiu seus 15 minutos de oração diária. Troféu liberado!");
    onFinish();
  }, [setStats, onFinish]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((15 * 60 - seconds) / (15 * 60)) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] space-y-10 animate-fadeIn px-4">
      <div className="text-center space-y-3">
        <h2 className="serif-font text-3xl font-bold text-brand-dark">Momento com Deus</h2>
        <p className="text-sm text-gray-500 font-medium italic">"15 minutos de oração que transformam o destino dos nossos filhos."</p>
      </div>

      {/* Timer Circle */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90">
          <circle 
            cx="144" cy="144" r="130" 
            className="stroke-brand-soft fill-none" 
            strokeWidth="12" 
          />
          <circle 
            cx="144" cy="144" r="130" 
            className="stroke-brand-primary fill-none transition-all duration-1000" 
            strokeWidth="12" 
            strokeDasharray={816} 
            strokeDashoffset={816 - (816 * progress) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="text-center z-10">
          <p className="text-6xl font-black text-brand-dark font-mono tracking-tighter">{formatTime(seconds)}</p>
          <p className="text-[10px] uppercase font-black text-brand-primary mt-2 tracking-widest">A Clamar</p>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`flex-[2] py-5 rounded-full text-white font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isActive ? 'bg-brand-dark' : 'gradient-brand shadow-brand-primary/30'}`}
        >
          <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'}`}></i>
          {isActive ? 'Pausar' : 'Iniciar'}
        </button>
        {seconds < 15 * 60 && (
          <button 
            onClick={() => {
              if (window.confirm("Deseja encerrar agora? O tempo não será registrado.")) {
                onFinish();
              }
            }}
            className="flex-1 py-5 rounded-full bg-white border-2 border-brand-border text-gray-500 font-black uppercase tracking-widest text-[10px] active:scale-95"
          >
            Sair
          </button>
        )}
      </div>

      <div className="calligraphy-font text-2xl text-brand-primary text-center">
        "Mães de joelhos, filhos de pé!"
      </div>
    </div>
  );
};

export default TimerView;
