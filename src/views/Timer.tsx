import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import { auth, db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

interface TimerProps {
  stats: any;
  setStats: (stats: any) => void;
  onFinish: () => void;
}

const Timer: React.FC<TimerProps> = ({ stats, setStats, onFinish }) => {
  const { seconds, isActive, startTimer, pauseTimer, resetTimer, formattedTime } = useTimer();

  const handleFinish = async () => {
    const minutesEarned = Math.floor(seconds / 60);
    
    if (minutesEarned > 0 && auth.currentUser) {
      try {
        const userRef = doc(db, "usuarios", auth.currentUser.uid);
        
        // Grava permanentemente no Firebase
        await updateDoc(userRef, {
          minutosIntercedidos: increment(minutesEarned),
          ultimoDiaOrado: new Date().toISOString().split('T')[0] 
        });

        // Atualiza o estado visual imediatamente
        setStats({
          ...stats,
          totalMinutes: stats.totalMinutes + minutesEarned
        });

        alert(`Glória a Deus! ${minutesEarned} minutos registrados no seu perfil. 🙏`);
      } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("O tempo foi contado, mas houve um erro ao salvar no servidor.");
      }
    } else if (minutesEarned === 0) {
      alert("O tempo mínimo para registro é de 1 minuto de oração.");
    }

    resetTimer();
    onFinish(); // Volta para a Home
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="serif-font text-3xl font-bold text-brand-dark">Tempo com Deus</h2>
        <p className="text-brand-rose font-black uppercase tracking-widest text-[10px]">A oração de uma mãe move o céu</p>
      </div>

      {/* Círculo Progressivo */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-orange-50"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={754}
            strokeDashoffset={754 - (754 * (seconds % 3600)) / 3600}
            className="text-[#FF4500] transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-brand-dark tabular-nums">{formattedTime}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase mt-2">Em intercessão</span>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-4 w-full max-w-xs">
        <button
          onClick={isActive ? pauseTimer : startTimer}
          className={`flex-1 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg transition-all active:scale-95 ${
            isActive ? 'bg-orange-100 text-[#FF4500]' : 'bg-[#FF4500] text-white'
          }`}
        >
          {isActive ? 'Pausar' : 'Iniciar'}
        </button>
        
        <button
          onClick={handleFinish}
          className="flex-1 bg-brand-dark text-white py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg active:scale-95"
        >
          Concluir
        </button>
      </div>

      <button 
        onClick={resetTimer}
        className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#FF4500] transition-colors"
      >
        Zerar Cronômetro
      </button>
    </div>
  );
};

export default Timer;