import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
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
  // Inicialização segura do índice
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(userProfile?.lastPrayerIndex || 0);
  const [prayerNote, setPrayerNote] = useState("");
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

  // PROTEÇÃO: Se a lista ainda estiver vazia, não tenta renderizar o card
  if (!prayers || prayers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-brand-rose">
        <div className="w-10 h-10 border-4 border-brand-rose border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold uppercase text-[10px] tracking-widest animate-pulse">Preparando Alvos...</p>
      </div>
    );
  }

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
        alvo: currentPrayer?.categoria || "Oração",
        relato: prayerNote,
        data: serverTimestamp()
      });
      setShowSuccess(true);
      setTimeout(() => {
        handleNextPrayer();
        setIsSaving(false);
        setShowSuccess(false);
      }, 1500);
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fadeIn pb-20">
      <div className="bg-brand-rose/10 text-brand-rose px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
        Dia {currentPrayer?.dia || currentPrayerIndex + 1}
      </div>

      <div className="w-44 h-44 rounded-full border-[6px] border-brand-rose/10 flex items-center justify-center bg-white shadow-inner">
        <div className="text-center">
          <span className="text-5xl font-black text-[#2D1B4D] block tabular-nums">{formatTime(timeLeft)}</span>
          <span className="text-[9px] font-black text-brand-rose uppercase tracking-[0.2em]">
            {isTimerActive ? "Clamor Ativo" : "Pausado"}
          </span>
        </div>
      </div>

      <div className="w-full bg-white rounded-[2.5rem] p-7 shadow-2xl border border-purple-50">
        {!showSuccess ? (
          <>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-rose block mb-1">
              {currentPrayer?.categoria}
            </span>
            
            <h2 className="serif-font text-xl font-bold text-[#2D1B4D] mb-4 leading-tight">
              {currentPrayer?.texto}
            </h2>

            {/* SEÇÃO DO VERSÍCULO (Tamanho menor como solicitado) */}
            {currentPrayer?.versiculo && (
              <div className="mb-6 bg-brand-lavender/5 rounded-2xl p-4 border border-brand-lavender/20">
                <div className="flex items-center gap-2 mb-1">
                  <i className="fa-solid fa-book-open text-brand-rose text-[10px]"></i>
                  <span className="text-brand-rose font-black text-[9px] uppercase tracking-widest">
                    {currentPrayer.versiculo}
                  </span>
                </div>
                {currentPrayer.texto_biblico && (
                  <p className="text-[#2D1B4D] text-[11px] leading-relaxed italic opacity-70 border-t border-brand-lavender/20 pt-2 mt-1">
                    "{currentPrayer.texto_biblico}"
                  </p>
                )}
              </div>
            )}
            
            <textarea
              value={prayerNote}
              onChange={(e) => setPrayerNote(e.target.value)}
              placeholder="O que o Espírito Santo ministrou ao seu coração?"
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm mb-4 min-h-[120px] resize-none focus:ring-1 focus:ring-brand-rose/20 transition-all placeholder:text-gray-400"
            />
            
            <button
              onClick={handleLogVictory}
              disabled={isSaving || !prayerNote.trim()}
              className={`w-full py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${
                prayerNote.trim() ? 'bg-brand-rose text-white shadow-lg' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {isSaving ? 'Gravando...' : 'Salvar e Próximo'}
            </button>
          </>
        ) : (
          <div className="py-12 text-center text-green-500 animate-pulse">
            <i className="fa-solid fa-circle-check text-4xl mb-3"></i>
            <p className="font-bold uppercase text-xs tracking-widest">Oração Registrada!</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 mt-4">
        <button
          onClick={() => setIsTimerActive(!isTimerActive)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl ${isTimerActive ? 'bg-orange-500' : 'bg-brand-rose'}`}
        >
          <i className={`fa-solid ${isTimerActive ? 'fa-pause' : 'fa-play'} text-xl`}></i>
        </button>
        <button 
          onClick={() => onFinish([], currentPrayerIndex)} 
          className="text-[10px] font-black uppercase tracking-widest text-gray-400"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default TimerView;