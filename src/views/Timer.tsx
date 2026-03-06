import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Timer: React.FC<any> = ({ user, prayers = [], timeLeft, setTimeLeft, isTimerActive, setIsTimerActive, onFinish }) => {
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const missaoDoDia = useMemo(() => {
    if (!prayers || prayers.length === 0) return [];
    const seed = new Date().getDate();
    return [...prayers].sort(() => 0.5 - Math.random() * seed).slice(0, 5);
  }, [prayers]);

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev: number) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, setTimeLeft]);

  const currentStep = Math.floor(((15 * 60) - timeLeft) / 180);
  const alvoAtual = missaoDoDia[currentStep < 5 ? currentStep : 4];

  // FUNÇÃO PARA SALVAR NO DIÁRIO
  const salvarNoDiario = async () => {
    if (!note.trim()) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, `usuarios/${user.uid}/diario`), {
        texto: note,
        alvo: alvoAtual?.title || alvoAtual?.titulo || 'Geral',
        data: serverTimestamp(),
        tipo: '15_minutos'
      });
      setNote('');
      alert("Anotação guardada no seu diário!");
    } catch (e) {
      console.error("Erro ao salvar nota", e);
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center py-8 px-6 animate-fadeIn overflow-y-auto">
      <div className="text-6xl font-black text-[#2D1B4D] mb-6 tabular-nums tracking-tighter">
        {formatTime(timeLeft)}
      </div>
      
      {/* CARD PRINCIPAL */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-purple-50 w-full max-w-sm text-center relative overflow-hidden mb-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-brand-rose to-purple-600"></div>
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-2">Alvo {currentStep + 1} de 5</span>
        <h3 className="serif-font text-2xl font-bold text-[#2D1B4D] mb-1 italic">"Oração do Dia"</h3>
        <span className="inline-block text-[9px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase mb-4">
          {alvoAtual?.category || alvoAtual?.categoria || 'Intercessão'}
        </span>
        <p className="text-gray-600 text-base leading-relaxed italic mb-4">
          "{alvoAtual?.description || alvoAtual?.descricao}"
        </p>
        {(alvoAtual?.biblicalReference || alvoAtual?.referencia) && (
          <div className="flex items-center justify-center gap-2 text-brand-rose font-bold text-[10px] bg-pink-50 py-2 px-4 rounded-xl mx-auto w-fit">
            <i className="fa-solid fa-book-bible"></i>
            <span>{alvoAtual?.biblicalReference || alvoAtual?.referencia}</span>
          </div>
        )}
      </div>

      {/* ÁREA DO DIÁRIO / OBSERVAÇÃO */}
      <div className="w-full max-w-sm bg-purple-50/50 rounded-[2rem] p-5 border border-purple-100 shadow-inner">
        <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2 mb-2 block">
          Diário de Clamor (O que Deus falou?)
        </label>
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Escreva aqui uma direção, um nome ou uma palavra que recebeu..."
          className="w-full bg-white border-none rounded-2xl p-4 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-brand-rose/20 outline-none resize-none"
          rows={3}
        />
        <button 
          onClick={salvarNoDiario}
          disabled={!note.trim() || isSaving}
          className="w-full mt-3 bg-white text-[#5c00b8] border border-purple-200 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-purple-50 transition-all disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : 'Salvar no meu Diário'}
        </button>
      </div>

      {/* CONTROLE */}
      <button 
        onClick={() => setIsTimerActive(!isTimerActive)}
        className={`mt-8 px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all ${
          isTimerActive ? 'bg-gray-100 text-gray-400' : 'bg-[#5c00b8] text-white'
        }`}
      >
        {isTimerActive ? 'Pausar' : 'Continuar'}
      </button>
    </div>
  );
};

export default Timer;