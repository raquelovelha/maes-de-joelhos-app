import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { Prayer } from '../types';

interface TimerProps {
  user: any;
  userProfile: any; // Adicionado para saber onde parou
  prayers: Prayer[];
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isTimerActive: boolean;
  setIsTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish: (sessionLogs: string[]) => void; // Agora envia os logs para o resumo
  onViewDiary: () => void;
}

const TimerView: React.FC<TimerProps> = ({ 
  user, userProfile, prayers, timeLeft, setTimeLeft, isTimerActive, setIsTimerActive, onFinish, onViewDiary 
}) => {
  // Começa a partir do último índice salvo no perfil ou do zero
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(userProfile?.lastPrayerIndex || 0);
  const [prayerNote, setPrayerNote] = useState("");
  const [sessionLogs, setSessionLogs] = useState<string[]>([]); // Guarda os textos da sessão atual
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

  const currentPrayer = prayers[currentPrayerIndex % prayers.length];

  const handleNextPrayer = async () => {
    const nextIndex = currentPrayerIndex + 1;
    setCurrentPrayerIndex(nextIndex);
    setPrayerNote("");
    setShowSuccess(false);

    // Salva o progresso no Firebase para a próxima vez que ela abrir o app
    if (user) {
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, { lastPrayerIndex: nextIndex });
    }
  };

  const handleLogVictory = async () => {
    if (!prayerNote.trim() || !user) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, "diario_clamor"), {
        userId: user.uid,
        alvo: currentPrayer.title,
        relato: prayerNote,
        data: serverTimestamp()
      });
      
      // Guarda o relato para a IA resumir no final
      setSessionLogs(prev => [...prev, `${currentPrayer.title}: ${prayerNote}`]);
      
      setShowSuccess(true);
      setTimeout(() => {
        handleNextPrayer();
        setIsSaving(false);
      }, 1500);
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fadeIn pb-20">
      {/* Círculo do Timer */}
      <div className="w-44 h-44 rounded-full border-[6px] border-brand-rose/10 flex items-center justify-center bg-white shadow-inner">
        <div className="text-center">
          <span className="text-5xl font-black text-[#2D1B4D] block tabular-nums">{formatTime(timeLeft)}</span>
          <span className="text-[9px] font-black text-brand-rose uppercase tracking-[0.2em]">Minutos de Clamor</span>
        </div>
      </div>

      {/* Card do Alvo */}
      <div className="w-full bg-white rounded-[2.5rem] p-7 shadow-2xl border border-purple-50">
        {!showSuccess ? (
          <>
            <h2 className="serif-font text-2xl font-bold text-[#2D1B4D] mb-2">{currentPrayer?.title}</h2>
            <p className="text-gray-500 text-sm mb-6 italic">"{currentPrayer?.description}"</p>
            <textarea
              value={prayerNote}
              onChange={(e) => setPrayerNote(e.target.value)}
              placeholder="O que o Espírito Santo ministrou agora?"
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm mb-4 min-h-[120px] resize-none"
            />
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogVictory}
                disabled={isSaving || !prayerNote.trim()}
                className={`w-full py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${
                  prayerNote.trim() ? 'bg-brand-rose text-white shadow-lg' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isSaving ? 'Gravando...' : 'Registrar e Próximo'}
              </button>
              <button onClick={handleNextPrayer} className="w-full py-2 text-[10px] font-black uppercase text-gray-400">Pular tema</button>
            </div>
          </>
        ) : (
          <div className="py-12 text-center animate-bounce text-green-500">
             <i className="fa-solid fa-check text-3xl mb-2"></i>
             <p className="font-bold">Salvo no Diário!</p>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsTimerActive(!isTimerActive)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl ${isTimerActive ? 'bg-orange-500' : 'bg-brand-rose'}`}
          >
            <i className={`fa-solid ${isTimerActive ? 'fa-pause' : 'fa-play'} text-xl`}></i>
          </button>
          <button onClick={() => onFinish(sessionLogs)} className="text-[10px] font-black uppercase tracking-widest text-gray-400">Encerrar Clamor</button>
        </div>

        <button onClick={onViewDiary} className="flex items-center gap-2 text-brand-rose/60">
          <i className="fa-solid fa-book-open text-sm"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Abrir meu diário de oração</span>
        </button>
      </div>
    </div>
  );
};

export default TimerView;