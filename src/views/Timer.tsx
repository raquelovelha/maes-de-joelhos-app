import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import { usePrayers } from '../hooks/usePrayers'; // Usar o hook que já tem a lógica de salvar

interface TimerProps {
  stats: any;
  setStats: (stats: any) => void;
  onFinish: () => void;
}

const Timer: React.FC<TimerProps> = ({ stats, setStats, onFinish }) => {
  // Pegando as funções padronizadas do Context
  const { seconds, isRunning, startTimer, pauseTimer, stopTimer, resetTimer, formattedTime } = useTimer();
  const { saveTime } = usePrayers();

  const handleFinish = async () => {
    const minutesEarned = Math.floor(seconds / 60);
    
    // 1. Para o cronômetro imediatamente no estado global
    if (stopTimer) stopTimer();

    if (minutesEarned > 0) {
      try {
        // 2. Usa a mesma função de salvar que o GlobalTimer usa
        await saveTime(minutesEarned);

        // 3. Atualiza o estado visual local
        setStats({
          ...stats,
          totalMinutes: (stats.totalMinutes || 0) + minutesEarned
        });

        alert(`Glória a Deus! ${minutesEarned} minutos registrados. 🙏`);
      } catch (error) {
        console.error("Erro ao salvar:", error);
      }
    } else {
      alert("O tempo mínimo para registro é de 1 minuto.");
    }

    // 4. Limpa e volta para a Home
    resetTimer();
    onFinish(); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-10 animate-fadeIn px-6">
      <div className="text-center space-y-3">
        <h2 className="serif-font text-4xl font-bold text-[#2D1B4D]">Tempo com Deus</h2>
        <p className="text-[#FF4D8C] font-black uppercase tracking-[0.2em] text-[10px]">A oração de uma mãe move o céu</p>
      </div>

      {/* Círculo Progressivo Estilizado */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="130"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-orange-50"
          />
          <circle
            cx="144"
            cy="144"
            r="130"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={816}
            strokeDashoffset={816 - (816 * (seconds % 3600)) / 3600}
            strokeLinecap="round"
            className="text-[#FF5722] transition-all duration-1000 shadow-lg"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-black text-[#2D1B4D] tabular-nums tracking-tighter">
            {formattedTime}
          </span>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full bg-orange-500 ${isRunning ? 'animate-ping' : ''}`}></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {isRunning ? 'Intercedendo' : 'Pausado'}
            </span>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <div className="flex gap-3">
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className={`flex-1 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isRunning 
              ? 'bg-white text-[#FF5722] border-2 border-[#FF5722]' 
              : 'bg-[#FF5722] text-white shadow-orange-200'
            }`}
          >
            <i className={`fa-solid ${isRunning ? 'fa-pause' : 'fa-play'}`}></i>
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
          
          <button
            onClick={handleFinish}
            className="flex-1 bg-[#2D1B4D] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-200 active:scale-95"
          >
            Concluir
          </button>
        </div>

        <button 
          onClick={resetTimer}
          className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em] py-2 hover:text-[#FF5722] transition-colors"
        >
          Reiniciar Cronômetro
        </button>
      </div>
    </div>
  );
};

export default Timer;