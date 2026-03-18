import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

const TimerView = ({ user, userProfile, prayers, timeLeft, setTimeLeft, isTimerActive, setIsTimerActive, onFinish, onViewDiary }: any) => {
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(userProfile?.lastPrayerIndex || 0);
  const [prayerNote, setPrayerNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0) interval = setInterval(() => setTimeLeft((prev: number) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Se não houver orações carregadas, mostra o aviso que você viu na imagem
  if (!prayers || prayers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#FF4DAD] text-center px-6">
        <i className="fa-solid fa-cloud-exclamation text-4xl mb-4 opacity-20"></i>
        <h2 className="serif-font text-xl font-bold mb-2">Verifique a conexão ou se há orações cadastradas.</h2>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-[#2D1B4D]">Sincronizando com o Memorial...</p>
      </div>
    );
  }

  const currentPrayer = prayers[currentPrayerIndex % prayers.length];

  const handleNext = async () => {
    const nextIdx = currentPrayerIndex + 1;
    if (user) await updateDoc(doc(db, "usuarios", user.uid), { lastPrayerIndex: nextIdx });
    setCurrentPrayerIndex(nextIdx);
    setPrayerNote("");
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fadeIn pb-20">
      <div className="bg-[#FF4DAD]/10 text-[#FF4DAD] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
        Intercessão • {currentPrayer?.category || "Clamor"}
      </div>

      <div className="w-44 h-44 rounded-full border-[6px] border-[#FF4DAD]/10 flex items-center justify-center bg-white shadow-inner relative">
        <div className="text-center">
          <span className="text-5xl font-black text-[#2D1B4D] block tabular-nums">{formatTime(timeLeft)}</span>
          <span className="text-[9px] font-black text-[#FF4DAD] uppercase tracking-[0.2em]">{isTimerActive ? "Ativo" : "Pausado"}</span>
        </div>
      </div>

      <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-2xl border border-purple-50">
        <h2 className="serif-font text-2xl font-bold text-[#2D1B4D] mb-6 leading-tight">
          {currentPrayer?.description || "Iniciando oração..."}
        </h2>

        {currentPrayer?.verse && (
          <div className="mb-6 bg-purple-50 rounded-2xl p-4 border-l-4 border-[#FF4DAD]">
            <div className="flex items-center gap-2 mb-2">
               <i className="fa-solid fa-book-open text-[#FF4DAD] text-[10px]"></i>
               <span className="text-[#FF4DAD] font-black text-[10px] uppercase tracking-widest">
                 {currentPrayer.verse}
               </span>
            </div>
          </div>
        )}
        
        <textarea
          value={prayerNote}
          onChange={(e) => setPrayerNote(e.target.value)}
          placeholder="Escreva aqui e mantenha o seu diário de oração"
          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm mb-6 min-h-[120px] focus:ring-1 focus:ring-[#FF4DAD]/20 outline-none"
        />
        
        <button
          onClick={async () => {
            if (!prayerNote.trim() || isSaving) return;
            setIsSaving(true);
            try {
              await addDoc(collection(db, "diario_clamor"), { 
                userId: user.uid, 
                alvo: currentPrayer?.category || "Oração", 
                relato: prayerNote, 
                data: serverTimestamp() 
              });
              await handleNext();
            } catch (e) { console.error(e); }
            setIsSaving(false);
          }}
          className={`w-full py-4 rounded-full font-black uppercase text-[11px] tracking-widest transition-all ${prayerNote.trim() ? 'bg-[#FF4DAD] text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
        >
          {isSaving ? 'Gravando...' : 'Salvar no Diário e Próximo'}
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <button onClick={() => setIsTimerActive(!isTimerActive)} className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl ${isTimerActive ? 'bg-orange-500' : 'bg-[#FF4DAD]'}`}>
            <i className={`fa-solid ${isTimerActive ? 'fa-pause' : 'fa-play'} text-xl`}></i>
          </button>
          <button onClick={() => onFinish([], currentPrayerIndex)} className="text-[10px] font-black uppercase text-gray-400">Encerrar Clamor</button>
        </div>
        
        <button onClick={onViewDiary} className="text-[10px] font-black uppercase text-[#FF4DAD] flex items-center gap-2 opacity-60">
           <i className="fa-solid fa-book-medical"></i>
           Abrir meu diário de oração
        </button>
      </div>
    </div>
  );
};

export default TimerView;