import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

interface MemorialProps {
  user: any;
  onBack: () => void;
}

const MemorialView: React.FC<MemorialProps> = ({ user, onBack }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Busca na coleção correta que definimos no Timer
    const q = query(
      collection(db, "diario_clamor"),
      where("userId", "==", user.uid),
      orderBy("data", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(docs);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar diário:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-20">
      <header className="flex items-center justify-between">
        <button onClick={onBack} className="text-brand-rose flex items-center gap-2">
          <i className="fa-solid fa-chevron-left"></i>
          <span className="text-xs font-black uppercase">Voltar</span>
        </button>
        <h2 className="serif-font text-xl font-bold text-brand-dark">Meu Diário</h2>
        <div className="w-8"></div>
      </header>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Carregando memórias...</div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-10 text-center border border-dashed border-brand-lavender">
          <i className="fa-solid fa-pen-nib text-3xl text-brand-lavender mb-4"></i>
          <p className="text-gray-500 text-sm">Você ainda não registrou nenhuma anotação hoje. Suas vitórias aparecerão aqui!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-white rounded-3xl p-6 shadow-sm border border-brand-lavender/30">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-brand-rose/10 text-brand-rose text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {log.alvo}
                </span>
                <span className="text-[10px] text-gray-400">
                  {log.data?.toDate().toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="text-[#2D1B4D] text-sm leading-relaxed italic">
                "{log.relato}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemorialView;