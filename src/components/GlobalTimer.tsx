import React, { useState } from 'react';
import { usePrayers } from '../hooks/usePrayers';
import { useTimer } from '../contexts/TimerContext';

const GlobalTimer: React.FC = () => {
  const { seconds, isRunning, stopTimer, resetTimer } = useTimer();
  const { saveTime } = usePrayers();
  const [isSaving, setIsSaving] = useState(false); // 1. Estado para evitar cliques duplos

  const handleStop = async () => {
    if (isSaving) return; // Se já estiver salvando, ignora o clique
    
    // Calculamos os minutos (pelo menos 1 se houver algum tempo decorrido)
    // Dica: Use Math.max(1, ...) se quiser que qualquer tempo salve como 1 min
    const minutosDecorridos = Math.floor(seconds / 60);
    
    setIsSaving(true);
    
    try {
      // 1. Para o cronômetro
      if (stopTimer) stopTimer();

      // 2. Salva no Firebase (apenas se tiver tempo real)
      // Se quiser testar fácil, mude para: if (seconds > 0)
      if (minutosDecorridos > 0) {
        await saveTime(minutosDecorridos);
      }
      
      // 3. Reseta e limpa o estado
      resetTimer();
    } catch (error) {
      console.error("Erro ao salvar tempo:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Função de formato otimizada
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRunning && seconds === 0) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-[360px] animate-slideUp">
      <div className="bg-[#2D1B4D] text-white px-6 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(45,27,77,0.4)] flex items-center justify-between border border-white/10 overflow-hidden relative">
        
        <div className="absolute -left-4 -top-4 w-12 h-12 bg-orange-500/20 blur-2xl rounded-full"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative flex items-center justify-center">
            <div className={`w-3 h-3 bg-orange-500 rounded-full ${isRunning ? 'animate-ping' : ''}`}></div>
            <div className="absolute w-3 h-3 bg-orange-500 rounded-full"></div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400 leading-none mb-1">
              {isRunning ? "Intercedendo" : "Oração Pausada"}
            </span>
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
          disabled={isSaving}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border border-white/5 group ${
            isSaving ? 'bg-gray-500 opacity-50' : 'bg-white/10 hover:bg-white/20 active:scale-90 shadow-lg shadow-black/20'
          }`}
          title="Parar e Salvar Oração"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div className="w-4 h-4 bg-white rounded-sm group-hover:scale-110 transition-transform"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default GlobalTimer;