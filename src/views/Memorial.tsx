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

    // AQUI ESTÁ O SEGREDO: Apontando para a coleção nova 'diario_clamor'
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
    <div className="flex flex-col gap-6 animate-fadeIn pb-24">
      <header className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-rose active:scale-90 transition-all"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="serif-font text-2xl font-bold text-[#2D1B4D]">Meu Diário de Clamor</h2>
      </header>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-brand-rose rounded-full mb-2"></div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Buscando memórias...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-12 text-center border border-dashed border-brand-lavender shadow-inner">
          <i className="fa-solid fa-pen-fancy text-4xl text-brand-lavender/40 mb-4"></i>
          <p className="text-gray-500 text-sm italic">"Suas vitórias e intercessões aparecerão aqui para que você nunca esqueça o que o Senhor falou ao seu coração."</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {logs.map((log) => (
            <div key={log.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-purple-50 relative overflow-hidden group">
              {/* Detalhe lateral colorido */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-rose opacity-20"></div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="bg-brand-rose/10 text-brand-rose text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {log.alvo}
                </span>
                <span className="text-[10px] font-bold text-gray-300">
                  {log.data?.toDate() ? log.data.toDate().toLocaleDateString('pt-BR') : 'Recentemente'}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[#2D1B4D] text-sm leading-relaxed italic opacity-80">
                  "{log.relato}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemorialView;