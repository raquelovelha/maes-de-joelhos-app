import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

const TimerView: React.FC<any> = ({ 
  user, profile, prayers, timeLeft, setTimeLeft, isTimerActive, setIsTimerActive, onFinish, onViewDiary 
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

  // Lógica do Cronômetro
  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev: number) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, setTimeLeft, setIsTimerActive]);

  // Pega o pedido atual (usa 'tema' ou 'title' conforme o banco)
  const currentPrayer = prayers[currentPrayerIndex % prayers.length];

  const handleLogVictory = async () => {
    if (!prayerNote.trim() || !user) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, "diario_clamor"), {
        userId: user.uid,
        alvo: currentPrayer?.title || currentPrayer?.tema || "Pedido",
        relato: prayerNote,
        data: serverTimestamp()
      });
      setShowSuccess(true);
      setTimeout(() => {
        setCurrentPrayerIndex(prev => prev + 1);
        setPrayerNote("");
        setShowSuccess(false);
        setIsSaving(false);
      }, 1500);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fadeIn pb-20">
      {/* Timer Central */}
      <div className="w-40 h-40 rounded-full border-[6px] border-brand-rose/10 flex items-center justify-center bg-white shadow-inner">
        <div className="text-center">
          <span className="text-4xl font-black text-[#2D1B4D] block">{formatTime(timeLeft)}</span>
          <span className="text-[9px] font-black text-brand-rose uppercase tracking-widest">
            {isTimerActive ? "Clamor Ativo" : "Pausado"}
          </span>
        </div>
      </div>

      {/* CARD QUE VOCÊ SUGERIU (Substituído aqui!) */}
      <div className="w-full bg-white rounded-[2.5rem] p-7 shadow-2xl border border-purple-50">
        {!showSuccess ? (
          <>
            <h2 className="serif-font text-2xl font-bold text-[#2D1B4D] mb-2">
               {currentPrayer?.title || currentPrayer?.tema}
            </h2>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
              "{currentPrayer?.texto}"
            </p>

            {currentPrayer?.versiculo && (
              <div className="bg-brand-lavender/10 p-5 rounded-2xl mb-6 border-l-4 border-brand-rose">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-book-open text-brand-rose text-[10px]"></i>
                  <span className="text-brand-rose font-black text-[10px] uppercase tracking-widest">
                    {currentPrayer.versiculo}
                  </span>
                </div>
                <p className="text-[#2D1B4D] text-xs leading-relaxed font-medium italic">
                  "{currentPrayer.texto_biblico || "O Senhor é o meu pastor..."}"
                </p>
              </div>
            )}
            
            <textarea
              value={prayerNote}
              onChange={(e) => setPrayerNote(e.target.value)}
              placeholder="Escreva aqui sua percepção ou clamor..."
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm mb-4 min-h-[100px] resize-none focus:ring-1 focus:ring-brand-rose/20"
            />
            
            <button
              onClick={handleLogVictory}
              disabled={isSaving || !prayerNote.trim()}
              className={`w-full py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${
                prayerNote.trim() ? 'bg-brand-rose text-white shadow-lg' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {isSaving ? 'Gravando...' : 'Salvar no Diário'}
            </button>
          </>
        ) : (
          <div className="py-12 text-center text-green-500 animate-pulse">
            <i className="fa-solid fa-circle-check text-4xl mb-3"></i>
            <p className="font-bold uppercase text-xs tracking-widest">Oração Registrada!</p>
          </div>
        )}
      </div>

      {/* Controles de Play/Pause */}
      <div className="flex items-center gap-6 mt-4">
        <button
          onClick={() => setIsTimerActive(!isTimerActive)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl ${isTimerActive ? 'bg-orange-500' : 'bg-brand-rose'}`}
        >
          <i className={`fa-solid ${isTimerActive ? 'fa-pause' : 'fa-play'} text-xl`}></i>
        </button>
        <button onClick={onFinish} className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Encerrar
        </button>
      </div>
    </div>
  );
};

export default TimerView;