import React from 'react';
import { usePrayers } from '../hooks/usePrayers';
import { useTimer } from '../contexts/TimerContext';

const GlobalTimer: React.FC = () => {
  const { seconds, isRunning, stopTimer, resetTimer } = useTimer(); // Usando stopTimer diretamente
  const { saveTime } = usePrayers();

  const handleStop = async () => {
    const minutosDecorridos = Math.floor(seconds / 60);
    
    // 1. Para o cronómetro imediatamente
    if (stopTimer) {
      stopTimer(); 
    }

    // 2. Salva no Firebase se tiver pelo menos 1 minuto (ou segundos se preferir testar)
    if (minutosDecorridos > 0) {
      await saveTime(minutosDecorridos);
    }
    
    // 3. Reseta o contador visual
    resetTimer();
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Só aparece se estiver rodando ou se houver tempo decorrido para salvar
  if (!isRunning && seconds === 0) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-[360px] animate-slideUp">
      <div className="bg-[#2D1B4D] text-white px-6 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(45,27,77,0.3)] flex items-center justify-between border border-white/10 overflow-hidden relative">
        
        {/* Detalhe de luz decorativo */}
        <div className="absolute -left-4 -top-4 w-12 h-12 bg-orange-500/20 blur-2xl rounded-full"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative flex items-center justify-center">
             {/* Círculo pulsante de atividade */}
            <div className={`w-3 h-3 bg-orange-500 rounded-full ${isRunning ? 'animate-ping' : ''}`}></div>
            <div className="absolute w-3 h-3 bg-orange-500 rounded-full"></div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400 leading-none mb-1">Intercedendo</span>
            <span className="font-mono text-3xl font-black tracking-tighter tabular-nums">
              {formatTime(seconds)}
            </span>
          </div>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleStop();
          }}
          className="bg-white/10 hover:bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-white/5 group"
          title="Parar e Salvar Oração"
        >
          {/* Ícone de Stop (Quadrado) clássico */}
          <div className="w-4 h-4 bg-white rounded-sm group-hover:scale-110 transition-transform"></div>
        </button>
      </div>
    </div>
  );
};

export default GlobalTimer;