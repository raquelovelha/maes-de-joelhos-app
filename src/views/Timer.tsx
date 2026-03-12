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
  // Inicia com o índice salvo no perfil
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

  const currentPrayer = prayers[currentPrayerIndex % prayers.length];

  const handleNextPrayer = async () => {
    const nextIndex = currentPrayerIndex + 1;
    
    // Salva o progresso no banco mesmo se ela apenas pular
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
      // 1. Salva no diário
      await addDoc(collection(db, "diario_clamor"), {
        userId: user.uid,
        alvo: currentPrayer.title,
        relato: prayerNote,
        data: serverTimestamp()
      });

      setSessionLogs(prev => [...prev, `${currentPrayer.title}: ${prayerNote}`]);

      // 2. ATUALIZAÇÃO IMEDIATA DO ÍNDICE: Se orou o 2, salva que o próximo é o 3
      const nextIndex = currentPrayerIndex + 1;
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, { lastPrayerIndex: nextIndex });

      setShowSuccess(true);
      
      // 3. Transição visual
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
      {/* Indicador do Dia/Pedido */}
      <div className="bg-brand-rose/10 text-brand-rose px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
        Pedido de Oração #{currentPrayerIndex + 1}
      </div>

      {/* Timer */}
      <div className="w-44 h-44 rounded-full border-[6px] border-brand-rose/10 flex items-center justify-center bg-white shadow-inner relative">
        <div className="text-center">
          <span className="text-5xl font-black text-[#2D1B4D] block tabular-nums">{formatTime(timeLeft)}</span>
          <span className="text-[9px] font-black text-brand-rose uppercase tracking-[0.2em]">
            {isTimerActive ? "Clamor Ativo" : "Pausado"}
          </span>
        </div>
      </div>

      {/* Card de Pedido */}
      <div className="w-full bg-white rounded-[2.5rem] p-7 shadow-2xl border border-purple-50">
        {!showSuccess ? (
          <>
            <h2 className="serif-font text-2xl font-bold text-[#2D1B4D] mb-2">{currentPrayer?.title}</h2>
            <p className="text-gray-500 text-sm mb-6 italic">"{currentPrayer?.description}"</p>
            
            <textarea
              value={prayerNote}
              onChange={(e) => setPrayerNote(e.target.value)}
              placeholder="O que o Espírito Santo ministrou sobre este pedido?"
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm mb-4 min-h-[120px] resize-none focus:ring-1 focus:ring-brand-rose/20"
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
            <p className="font-bold uppercase text-xs tracking-widest">Registrado com sucesso!</p>
          </div>
        )}
      </div>

      {/* Controles Inferiores */}
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