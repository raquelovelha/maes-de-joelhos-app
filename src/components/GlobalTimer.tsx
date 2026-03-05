import React from 'react';
import { useTimer } from '../contexts/TimerContext';

const GlobalTimer: React.FC = () => {
  const { formattedTime, isActive, startTimer, pauseTimer, seconds } = useTimer();

  // Só mostra o timer se ele já tiver sido iniciado alguma vez ou se estiver ativo
  if (seconds === 0 && !isActive) return null; 

  return (
    <div className="fixed top-6 right-4 z-[100] animate-bounceIn">
      <div className="bg-white border-2 border-orange-100 rounded-full shadow-2xl p-2 flex items-center gap-3 pr-6">
        <button 
          onClick={isActive ? pauseTimer : startTimer}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all shadow-md ${isActive ? 'bg-red-400' : 'bg-[#FF4500]'}`}
        >
          <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play ml-0.5'}`}></i>
        </button>
        
        <div>
          <p className="text-[9px] font-black text-brand-rose uppercase tracking-tighter leading-none">Em Oração</p>
          <p className="text-xl font-black text-brand-dark tabular-nums">{formattedTime}</p>
        </div>

        <div className="w-1.5 h-8 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="bg-[#FF4500] w-full transition-all duration-1000" 
            style={{ height: `${(seconds / 900) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTimer;