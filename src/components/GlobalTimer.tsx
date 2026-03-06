import React from 'react';
import { usePrayers } from '../hooks/usePrayers';
import { useTimer } from '../contexts/TimerContext'; // Importante para sincronizar

const GlobalTimer: React.FC = () => {
  const { seconds, isRunning, toggleTimer, resetTimer } = useTimer();
  const { saveTime } = usePrayers();

  const handleStop = async () => {
    const minutosDecorridos = Math.floor(seconds / 60);
    if (minutosDecorridos > 0) {
      await saveTime(minutosDecorridos);
    }
    toggleTimer(); // Para o timer
    resetTimer();  // Zera após salvar
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Só aparece se estiver rodando ou se houver tempo decorrido
  if (!isRunning && seconds === 0) return null;

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-slideUp">
      <div className="bg-gray-900/90 backdrop-blur-md text-white px-6 py-4 rounded-[2rem] shadow-2xl flex items-center justify-between border border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3 h-3 bg-orange-500 rounded-full ${isRunning ? 'animate-ping' : ''}`}></div>
            <div className="absolute inset-0 w-3 h-3 bg-orange-500 rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Intercedendo</span>
            <span className="font-mono text-2xl font-black">{formatTime(seconds)}</span>
          </div>
        </div>
        
        <button 
          onClick={handleStop}
          className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all active:scale-95"
        >
          <i className="fa-solid fa-stop text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default GlobalTimer; // Resolve o erro de build