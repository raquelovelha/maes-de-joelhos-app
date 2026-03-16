import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const MemorialView = ({ user }: any) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "diario_clamor"), 
      where("userId", "==", user.uid),
      orderBy("data", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Normaliza os campos para o código
        alvo: doc.data().alvo || "Oração",
        relato: doc.data().relato || "Sem descrição",
        data: doc.data().data?.toDate() || new Date()
      }));
      setEntries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="p-10 text-center text-gray-400">Carregando memórias...</div>;

  return (
    <div className="flex flex-col gap-6 pb-24 animate-fadeIn">
      <header className="px-2">
        <h2 className="serif-font text-3xl font-bold text-[#2D1B4D]">Memorial</h2>
        <p className="text-[10px] font-black text-[#FF4DAD] uppercase tracking-[0.2em]">Suas experiências com Deus</p>
      </header>

      <div className="flex flex-col gap-4">
        {entries.length > 0 ? entries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-50">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-[#FF4DAD]/10 text-[#FF4DAD] text-[9px] font-black px-3 py-1 rounded-full uppercase">
                {entry.alvo}
              </span>
              <span className="text-[9px] text-gray-300 font-bold">
                {entry.data.toLocaleDateString('pt-BR')}
              </span>
            </div>
            <p className="text-sm text-[#2D1B4D] leading-relaxed italic">"{entry.relato}"</p>
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <i className="fa-solid fa-pen-fancy text-3xl text-gray-100 mb-4 block"></i>
            <p className="text-gray-400 text-xs font-bold uppercase">Nenhum relato ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemorialView;