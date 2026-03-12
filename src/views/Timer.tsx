import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Importando a conexão que configuramos
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Prayer } from '../types';

interface TimerProps {
  user: any;
  prayers: Prayer[];
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isTimerActive: boolean;
  setIsTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish: () => void;
}

const TimerView: React.FC<TimerProps> = ({ 
  user, prayers, timeLeft, setTimeLeft, isTimerActive, setIsTimerActive, onFinish 
}) => {
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(0);
  const [prayerNote, setPrayerNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Formatação do tempo (00:00)
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

  const handleNextPrayer = () => {
    setPrayerNote("");
    setShowSuccess(false);
    setCurrentPrayerIndex(prev => prev + 1);
  };

  const handleLogVictory = async () => {
    if (!prayerNote.trim() || !user) return;
    
    setIsSaving(true);
    try {
      // SALVANDO NO FIREBASE
      await addDoc(collection(db, "diario_clamor"), {
        userId: user.uid,
        userName: user.displayName,
        alvo: currentPrayer.title,
        relato: prayerNote,
        data: serverTimestamp()
      });

      setShowSuccess(true);
      
      // Espera 1.5s para a mãe ver o check de sucesso e pula pro próximo
      setTimeout(() => {
        handleNextPrayer();
        setIsSaving(false);
      }, 1500);

    } catch (error) {
      console.error("Erro ao salvar no diário:", error);
      alert("Ops! Tivemos um problema ao salvar. Tente novamente.");
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fadeIn pb-20">
      {/* Cronômetro */}
      <div className="w-44 h-44 rounded-full border-[6px] border-brand-rose/10 flex items-center justify-center bg-white shadow-inner">
        <div className="text-center">
          <span className="text-5xl font-black text-[#2D1B4D] block tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[9px] font-black text-brand-rose uppercase tracking-[0.2em]">
            Minutos de Clamor
          </span>
        </div>
      </div>

      {/* Card Dinâmico */}
      <div className="w-full bg-white rounded-[2.5rem] p-7 shadow-2xl shadow-purple-100/50 border border-purple-50">
        {!showSuccess ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                Alvo Atual
              </span>
            </div>
            
            <h2 className="serif-font text-2xl font-bold text-[#2D1B4D] mb-2 leading-tight">
              {currentPrayer?.title}
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed italic">
              "{currentPrayer?.description}"
            </p>

            <textarea
              value={prayerNote}
              onChange={(e) => setPrayerNote(e.target.value)}
              placeholder="O que o Espírito Santo ministrou em seu coração?"
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand-rose mb-4 min-h-[120px] resize-none"
            />

            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogVictory}
                disabled={isSaving || !prayerNote.trim()}
                className={`w-full py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg transition-all ${
                  prayerNote.trim() 
                    ? 'bg-brand-rose text-white active:scale-95 shadow-rose-200' 
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isSaving ? 'Gravando...' : 'Registrar e Próximo Alvo'}
              </button>
              
              <button
                onClick={handleNextPrayer}
                className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                Pular este tema
              </button>
            </div>
          </>
        ) : (
          <div className="py-12 text-center animate-bounce">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="font-bold text-[#2D1B4D] serif-font text-xl">Memorial Atualizado!</p>
          </div>
        )}
      </div>

      {/* Controles do Timer */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setIsTimerActive(!isTimerActive)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
            isTimerActive ? 'bg-orange-500' : 'bg-brand-rose'
          }`}
        >
          {isTimerActive ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        
        <button
          onClick={onFinish}
          className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b-2 border-transparent hover:border-gray-200"
        >
          Encerrar Clamor
        </button>
      </div>
    </div>
  );
};

export default TimerView;