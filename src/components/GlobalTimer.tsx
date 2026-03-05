import React, { useState, useEffect } from 'react';
import { usePrayers } from '../hooks/usePrayers';

const GlobalTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { saveTime } = usePrayers();

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStop = async () => {
    const minutosDecorridos = Math.floor(seconds / 60);
    if (minutosDecorridos > 0) {
      await saveTime(minutosDecorridos);
    }
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-brand-dark text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase tracking-widest text-white/50">Intercedendo</span>
          <span className="font-mono text-lg font-bold">{formatTime(seconds)}</span>
        </div>
        
        <button 
          onClick={() => isRunning ? handleStop() : setIsRunning(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-[#FF4500] hover:bg-orange-600'}`}
        >
          <i className={`fa-solid ${isRunning ? 'fa-stop' : 'fa-play'}`}></i>
        </button>
      </div>
    </div>
  );
};

// ESSA LINHA ABAIXO É A QUE ESTÁ FALTANDO E CAUSA O ERRO:
export default GlobalTimer;