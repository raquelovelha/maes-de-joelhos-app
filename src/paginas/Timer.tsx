import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { Prayer } from '../types';

interface TimerProps {
  user: any;
  userProfile: any;
  prayers: Prayer[];
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isTimerActive: boolean;
  setIsTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish: (sessionLogs: string[], currentIdx: number) => void;
  onViewDiary: () => void;
}

const TimerView: React.FC<TimerProps> = ({ 
  user, userProfile, prayers, timeLeft, setTimeLeft, isTimerActive, setIsTimerActive, onFinish, onViewDiary 
}) => {
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(userProfile?.lastPrayerIndex || 0);
  const [prayerNote, setPrayerNote] = useState("");
  const [sessionLogs, setSessionLogs] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Pega o pedido atual da lista
  const currentPrayer = prayers[currentPrayerIndex % prayers.length];

  const handleNextPrayer = async () => {
    const nextIndex = currentPrayerIndex + 1;
    if (user) {
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, { lastPrayerIndex: nextIndex });
    }
    setCurrentPrayerIndex(nextIndex);
    setPrayerNote("");
    setShowSuccess(false);
  };

  const handleLogVictory = async () => {
    if (!prayerNote.trim() || !user) return;
    setIsSaving(true);
    
    try {
      await addDoc(collection(db, "diario_clamor"), {
        userId: user.uid,
        alvo: currentPrayer?.tema || `Pedido #${currentPrayerIndex + 1}`,
        relato: prayerNote,
        data: serverTimestamp()
      });

      setSessionLogs(prev => [...prev, `${currentPrayer?.tema || 'Oração'}: ${prayerNote}`]);

      const nextIndex = currentPrayerIndex + 1;
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, { lastPrayerIndex: nextIndex });

      setShowSuccess(true);
      
      setTimeout(() => {
        setCurrentPrayerIndex(nextIndex);
        setPrayerNote("");
        setShowSuccess(false);
        setIsSaving(false);
      }, 1500);

    } catch (error) {
      console.error("Erro ao salvar:", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fadeIn pb-20">
      {/* Indicador do Dia */}
      <div className="bg-brand-rose/10 text-brand-rose px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
        Intercessão Diária • Dia {currentPrayer?.dia || currentPrayerIndex + 1}
      </div>

      {/* Timer Central */}
      <div className="w-44 h-44 rounded-full border-[6px] border-brand-rose/10 flex items-center justify-center bg-white shadow-inner relative">
        <div className="text-center">
          <span className="text-5xl font-black text-[#2D1B4D] block tabular-nums">{formatTime(timeLeft)}</span>
          <span className="text-[9px] font-black text-brand-rose uppercase tracking-[0.2em]">
            {isTimerActive ? "Clamor Ativo" : "Pausado"}
          </span>
        </div>
      </div>

      {/* Card de Pedido de Oração */}
      <div className="w-full bg-white rounded-[2.5rem] p-7 shadow-2xl border border-purple-50">
        {!showSuccess ? (
          <>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-rose block mb-1">
              {currentPrayer?.tema || "Pedido de Oração"}
            </span>
            
            <h2 className="serif-font text-2xl font-bold text-[#2D1B4D] mb-4 leading-tight">
              {currentPrayer?.texto}
            </h2>

            {/* BOX BÍBLICO (NVI) */}
            {currentPrayer?.texto_biblico && (
              <div className="bg-brand-lavender/10 p-5 rounded-2xl mb-6 border-l-4 border-brand-rose">
                <p className="text-[#2D1B4D] text-xs leading-relaxed font-medium italic mb-2">
                  "{currentPrayer.texto_biblico}"
                </p>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-book-open text-brand-rose text-[9px]"></i>
                  <span className="text-brand-rose font-black text-[10px] uppercase tracking-widest">
                    {currentPrayer.versiculo} (NVI)
                  </span>
                </div>
              </div>
            )}
            
            <textarea
              value={prayerNote}
              onChange={(e) => setPrayerNote(e.target.value)}
              placeholder="Escreva aqui e matenha o seu diário de oração"
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm mb-4 min-h-[120px] resize-none focus:ring-1 focus:ring-brand-rose/20 transition-all placeholder:text-gray-400"
            />
            
            <button
              onClick={handleLogVictory}
              disabled={isSaving || !prayerNote.trim()}
              className={`w-full py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${
                prayerNote.trim() ? 'bg-brand-rose text-white shadow-lg shadow-rose-200' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {isSaving ? 'Gravando...' : 'Salvar no Diário e Próximo'}
            </button>
            
            <button 
              onClick={handleNextPrayer} 
              className="w-full py-2 mt-2 text-[10px] font-black uppercase text-gray-400 tracking-widest"
            >
              Pular este pedido
            </button>
          </>
        ) : (
          <div className="py-12 text-center text-green-500 animate-pulse">
            <i className="fa-solid fa-circle-check text-4xl mb-3"></i>
            <p className="font-bold uppercase text-xs tracking-widest">Oração Registrada!</p>
          </div>
        )}
      </div>

      {/* Controles do Player */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsTimerActive(!isTimerActive)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90 ${isTimerActive ? 'bg-orange-500' : 'bg-brand-rose'}`}
          >
            <i className={`fa-solid ${isTimerActive ? 'fa-pause' : 'fa-play'} text-xl`}></i>
          </button>
          
          <button 
            onClick={() => onFinish(sessionLogs, currentPrayerIndex)} 
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark transition-colors"
          >
            Encerrar Clamor
          </button>
        </div>

        <button 
          onClick={onViewDiary} 
          className="flex items-center gap-2 text-brand-rose/60 hover:text-brand-rose transition-colors"
        >
          <i className="fa-solid fa-book-open text-sm"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Abrir meu diário de oração</span>
        </button>
      </div>
    </div>
  );
};

export default TimerView;