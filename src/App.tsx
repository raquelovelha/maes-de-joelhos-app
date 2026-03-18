import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 

import Layout from './components/Layout'; 
import { usePrayers } from './hooks/usePrayers'; 

import HomeView from './paginas/Home'; 
import FilhosView from './paginas/Filhos';
import AuthView from './paginas/Register';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const { filhos, prayers, loading } = usePrayers();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  if (loading || authLoading) return <div className="p-10 text-center text-purple-600 font-bold italic">Carregando Geração Compromisso...</div>;

  if (!currentUser) return <AuthView />;

  const renderView = () => {
    try {
      if (activeTab === 'filhos') {
        return <FilhosView filhos={filhos || []} onNavigate={setActiveTab} />;
      }

      // ABA ORAÇÕES CATEGORIZADAS (O RESGATE!)
      if (activeTab === 'prayers') {
        return (
          <div className="space-y-6 p-4 pb-24">
            <h2 className="serif-font text-2xl font-black text-brand-dark">Roteiro de Oração</h2>
            {filhos && filhos.length > 0 ? (
              filhos.map((filho: any) => (
                <div key={filho.id} className="bg-white rounded-3xl shadow-sm border border-brand-lavender/20 overflow-hidden">
                  <div className="bg-brand-purple/5 p-4 border-b border-brand-lavender/10">
                    <h3 className="text-lg font-black text-brand-purple">🙏 Clamor por {filho.nome}</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* Categoria: Vida Espiritual */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-brand-rose/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-cross text-brand-rose text-xs"></i>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-brand-dark/40">Vida Espiritual</h4>
                        <p className="text-sm text-gray-700 leading-relaxed italic">"{filho.oracao || "Senhor, conduza o coração deste filho aos Teus pés."}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center bg-white rounded-3xl border-2 border-dashed border-brand-lavender/40">
                <p className="text-gray-500 mb-4">Nenhum filho cadastrado.</p>
                <button onClick={() => setActiveTab('filhos')} className="bg-brand-purple text-white px-8 py-3 rounded-full font-bold">Cadastrar Agora</button>
              </div>
            )}
          </div>
        );
      }

      if (activeTab === 'timer') {
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
            <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
               <i className="fa-solid fa-stopwatch text-4xl"></i>
            </div>
            <h2 className="serif-font text-2xl font-black text-brand-dark">15 Minutos de Clamor</h2>
            <button className="mt-8 bg-orange-500 text-white px-10 py-4 rounded-full font-black shadow-lg uppercase tracking-widest">Iniciar Relógio</button>
          </div>
        );
      }

      if (activeTab === 'community') {
        return (
          <div className="p-4 space-y-4 pb-20">
            <h2 className="serif-font text-2xl font-black text-brand-dark">Mural da Comunidade</h2>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-brand-lavender/5 rounded-2xl border border-white">
                <p className="text-sm text-gray-700 italic">"Irmãs, peço oração pela saúde da minha família."</p>
                <span className="text-[10px] text-brand-lavender font-bold uppercase mt-2 block">— Irmã Maria</span>
              </div>
            ))}
          </div>
        );
      }

      return <HomeView profile={{name: currentUser?.displayName || "Missionária"}} onNavigate={setActiveTab} />;
    } catch (e) {
      return <div className="p-10 text-brand-rose font-bold text-center">Ops! Algo falhou. <br/> <button onClick={() => setActiveTab('home')} className="mt-4 underline">Voltar para Início</button></div>;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userProfile={{nome: currentUser?.displayName || "Missionária"}}>
      <div className="animate-in fade-in duration-500">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;