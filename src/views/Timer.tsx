import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Timer: React.FC<any> = ({ user, prayers = [], timeLeft, setTimeLeft, isTimerActive, setIsTimerActive, onFinish }) => {
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Seleção dos 5 alvos do dia
  const missaoDoDia = useMemo(() => {
    if (!prayers || prayers.length === 0) return [];
    const seed = new Date().getDate();
    return [...prayers].sort(() => 0.5 - Math.random() * seed).slice(0, 5);
  }, [prayers]);

  // Lógica do Timer
  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev: number) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, setTimeLeft]);

  const currentStep = Math.floor(((15 * 60) - timeLeft) / 180);
  const alvoAtual = missaoDoDia[currentStep < 5 ? currentStep : 4];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Função para salvar anotação no Firebase
  const salvarNoDiario = async () => {
    if (!note.trim() || !user) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, `usuarios/${user.uid}/diario`), {
        texto: note,
        alvo: alvoAtual?.title || alvoAtual?.titulo || 'Oração do Dia',
        categoria: alvoAtual?.category || alvoAtual?.categoria || 'Geral',
        data: serverTimestamp(),
      });
      setNote('');
      alert("✍️ Anotação salva com sucesso!");
    } catch (e) {
      console.error("Erro ao salvar nota:", e);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!prayers || prayers.length === 0) return <div className="p-20 text-center opacity-50 italic">Carregando alvos...</div>;

  return (
    <div className="min-h-[85vh] flex flex-col items-center py-6 px-4 animate-fadeIn">
      {/* Timer */}
      <div className="text-6xl font-black text-[#2D1B4D] mb-6 tabular-nums tracking-tighter">
        {formatTime(timeLeft)}
      </div>
      
      {/* Card de Oração */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_15px_50px_rgba(92,0,184,0.1)] border border-purple-50 w-full max-w-sm text-center relative overflow-hidden mb-6">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-brand-rose to-purple-600"></div>
        
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-2">
          Alvo {currentStep + 1} de 5
        </span>

        <h3 className="serif-font text-2xl font-bold text-[#2D1B4D] mb-1 italic">
          "Oração do Dia"
        </h3>
        
        <span className="inline-block text-[9px] font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase mb-4 tracking-wider">
          {alvoAtual?.category || alvoAtual?.categoria || 'Intercessão'}
        </span>

        <p className="text-gray-600 text-base leading-relaxed italic mb-6">
          "{alvoAtual?.description || alvoAtual?.descricao}"
        </p>

        {(alvoAtual?.biblicalReference || alvoAtual?.referencia) && (
          <div className="flex items-center justify-center gap-2 text-brand-rose font-bold text-[10px] bg-pink-50 py-2.5 px-4 rounded-xl mx-auto w-fit border border-pink-100/50">
            <i className="fa-solid fa-book-bible"></i>
            <span>{alvoAtual?.biblicalReference || alvoAtual?.referencia}</span>
          </div>
        )}
      </div>

      {/* Área do Diário */}
      <div className="w-full max-w-sm bg-white rounded-[2rem] p-5 shadow-sm border border-purple-100">
        <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] ml-2 mb-2 block">
          Diário de Clamor
        </label>
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="O que o Espírito Santo falou ao seu coração agora?"
          className="w-full bg-purple-50/30 border-none rounded-2xl p-4 text-sm text-gray-700 placeholder:text-gray-300 outline-none resize-none focus:ring-1 focus:ring-purple-200 transition-all"
          rows={3}
        />
        <button 
          onClick={salvarNoDiario}
          disabled={!note.trim() || isSaving}
          className="w-full mt-3 bg-brand-rose/10 text-brand-rose py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-rose hover:text-white transition-all disabled:opacity-30"
        >
          {isSaving ? 'Salvando...' : 'Registrar Observação'}
        </button>
      </div>

      {/* Controle de Pausa/Play */}
      <button 
        onClick={() => setIsTimerActive(!isTimerActive)}
        className={`mt-8 px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
          isTimerActive ? 'bg-gray-100 text-gray-400' : 'bg-[#5c00b8] text-white shadow-purple-200'
        }`}
      >
        {isTimerActive ? 'Pausar' : 'Continuar Clamor'}
      </button>
    </div>
  );
};

export default Timer;