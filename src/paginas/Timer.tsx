import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase'; // Endereço correto que confirmamos!
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

const TimerView = ({ user, userProfile, prayers, timeLeft, setTimeLeft, isTimerActive, setIsTimerActive, onFinish }: any) => {
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(userProfile?.lastPrayerIndex || 0);
  const [prayerNote, setPrayerNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev: number) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  if (!prayers || prayers.length === 0) {
    return <div className="py-20 text-center text-[#FF4DAD] font-bold">Carregando intercessão...</div>;
  }

  const currentPrayer = prayers[currentPrayerIndex % prayers.length];

  const handleNext = async () => {
    const nextIdx = currentPrayerIndex + 1;
    if (user) {
      try {
        await updateDoc(doc(db, "usuarios", user.uid), { lastPrayerIndex: nextIdx });
      } catch (e) { console.error("Erro ao salvar progresso:", e); }
    }
    setCurrentPrayerIndex(nextIdx);
    setPrayerNote("");
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fadeIn pb-24 text-center">
      {/* Badge do Dia */}
      <div className="bg-[#FF4DAD]/10 text-[#FF4DAD] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-2">
        Intercessão Diária • Alvo {currentPrayerIndex + 1} de {prayers.length}
      </div>

      {/* Timer Circular */}
      <div className="w-44 h-44 rounded-full border-[6px] border-[#FF4DAD]/5 flex items-center justify-center bg-white shadow-sm relative">
        <div className="text-center">
          <span className="text-5xl font-black text-[#2D1B4D] block tracking-tighter tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] font-black text-[#FF4DAD] uppercase tracking-[0.2em] mt-1 block">
            {isTimerActive ? "Em Clamor" : "Pausado"}
          </span>
        </div>
      </div>

      {/* CARD PRINCIPAL - Com suas alterações de input e botão */}
      <div className="w-full bg-white rounded-[3rem] p-10 shadow-xl shadow-purple-100/40 border border-purple-50 text-left">
        
        <h2 className="serif-font text-[28px] font-bold text-[#2D1B4D] mb-3 leading-tight">
          Pedido de Oração
        </h2>

        <p className="text-gray-600 text-[15px] leading-relaxed mb-8 italic">
          "{currentPrayer?.texto || currentPrayer?.description}"
        </p>

        <textarea
          value={prayerNote}
          onChange={(e) => setPrayerNote(e.target.value)}
          placeholder="Escreva aqui e mantenha o seu diário de oração"
          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm mb-6 min-h-[120px] focus:ring-1 focus:ring-[#FF4DAD]/20"
        />

        <button
          onClick={async () => {
            if (!prayerNote.trim()) return;
            setIsSaving(true);
            try {
              await addDoc(collection(db, "diario_clamor"), { 
                userId: user.uid, 
                alvo: currentPrayer?.categoria || "Pedido Geral", 
                relato: prayerNote, 
                data: serverTimestamp() 
              });
              handleNext();
            } catch (e) { console.error(e); }
            setIsSaving(false);
          }}
          className={`w-full py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${
            prayerNote.trim() 
            ? 'bg-[#FF4DAD] text-white shadow-lg shadow-rose-200' 
            : 'bg-gray-100 text-gray-400'
          }`}
        >
          {isSaving ? 'Gravando...' : 'Salvar no Diário e Próximo'}
        </button>

        <button 
          onClick={handleNext}
          className="w-full text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4 hover:text-[#FF4DAD] transition-colors"
        >
          Pular este pedido
        </button>
      </div>

      {/* Controles Inferiores */}
      <div className="flex flex-col items-center gap-5 mt-2">
        <div className="flex items-center gap-5">
            <button
              onClick={() => setIsTimerActive(!isTimerActive)}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-90 ${
                isTimerActive ? 'bg-orange-500 shadow-orange-100' : 'bg-[#F862A0] shadow-pink-100'
              }`}
            >
              <i className={`fa-solid ${isTimerActive ? 'fa-pause' : 'fa-play'} text-xl`}></i>
            </button>
            <button 
              onClick={() => onFinish([], currentPrayerIndex)}
              className="text-[11px] font-bold text-gray-500 uppercase tracking-widest"
            >
              Encerrar Clamor
            </button>
        </div>
      </div>
    </div>
  );
};

export default TimerView;