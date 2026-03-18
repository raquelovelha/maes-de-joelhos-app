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
  const { filhos, loading } = usePrayers();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  if (loading || authLoading) return <div className="p-10 text-center text-purple-600 font-bold">Carregando...</div>;

  if (!currentUser) return <AuthView />;

  const renderView = () => {
    try {
      if (activeTab === 'filhos') {
        return <FilhosView filhos={filhos || []} onNavigate={setActiveTab} />;
      }
      if (activeTab === 'prayers') {
        return (
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-brand-lavender/30">
            <h2 className="serif-font text-xl font-black text-brand-dark mb-4">Sugestões de Oração</h2>
            <p className="text-gray-500 italic text-sm">Aqui aparecerão as sugestões diárias baseadas no seu propósito.</p>
          </div>
        );
      }
      if (activeTab === 'timer') {
        return (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
               <i className="fa-solid fa-stopwatch text-3xl"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-800">15 Minutos de Clamor</h2>
            <p className="text-gray-500 mt-2">Prepare seu coração, o cronômetro está chegando.</p>
          </div>
        );
      }
      if (activeTab === 'community') {
        return (
          <div className="p-6 text-center">
            <i className="fa-solid fa-users text-brand-rose text-4xl mb-4"></i>
            <h2 className="text-xl font-bold">Mural da Comunidade</h2>
            <p className="text-gray-500 italic">Em breve você poderá ver os pedidos de outras mães.</p>
          </div>
        );
      }
      return <HomeView profile={{name: currentUser?.displayName || "Missionária"}} onNavigate={setActiveTab} />;
    } catch (e) {
      return <div className="p-10 text-brand-rose">Ops! Algo deu errado ao carregar a aba.</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userProfile={{nome: currentUser?.displayName || "Missionária"}}>
      {renderView()}
    </Layout>
  );
};

export default App;