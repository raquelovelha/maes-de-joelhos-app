import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Memorial: React.FC<{ user: any; onBack: () => void }> = ({ user, onBack }) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `usuarios/${user.uid}/diario`),
      orderBy('data', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="flex flex-col gap-6 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-rose">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="serif-font text-2xl font-bold text-[#2D1B4D]">Memorial de Vitórias</h2>
      </div>

      {loading ? (
        <div className="py-20 text-center opacity-50 italic">Carregando suas memórias...</div>
      ) : entries.length > 0 ? (
        <div className="grid gap-4">
          {entries.map((item) => (
            <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-purple-50 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-brand-rose uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">
                  {item.categoria || 'Geral'}
                </span>
                <span className="text-[10px] text-gray-400 font-bold">
                  {item.data?.toDate().toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <h4 className="font-bold text-[#2D1B4D] text-sm">Alvo: {item.alvo}</h4>
              
              <p className="text-gray-500 text-sm italic leading-relaxed bg-gray-50 p-4 rounded-2xl">
                "{item.texto}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
          <i className="fa-solid fa-feather-pointed text-4xl mb-4 text-purple-300"></i>
          <p className="text-sm font-medium">Seu diário ainda está vazio.<br/>As anotações feitas durante o clamor de 15 min aparecerão aqui!</p>
        </div>
      )}
    </div>
  );
};

export default Memorial;