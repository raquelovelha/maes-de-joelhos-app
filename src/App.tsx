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

  // ✅ ESCUTA MUDANÇAS DE AUTENTICAÇÃO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  if (loading || authLoading) return <div className="p-10 text-center">Carregando...</div>;

  // ✅ SE NÃO ESTÁ LOGADO, MOSTRA TELA DE LOGIN/REGISTRO
  if (!currentUser) return <AuthView />;

  const renderView = () => {
    try {
      if (activeTab === 'filhos') {
        return (
          <FilhosView 
            filhos={filhos || []} 
            onNavigate={setActiveTab} 
          />
        );
      }
      return <HomeView profile={{name: "Missionária"}} onNavigate={setActiveTab} />;
    } catch (e) {
      return <div className="p-10">Erro ao carregar aba. Clique em Home.</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userProfile={{nome: "Missionária"}}>
      {renderView()}
    </Layout>
  );
};

export default App;