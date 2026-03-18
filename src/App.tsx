import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Layout from './componentes/Layout'; 
import { useChildren } from './hooks/useChildren'; // Nome corrigido aqui
import HomeView from './paginas/Home'; 
import FilhosView from './paginas/Filhos';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Usando o useChildren e renomeando 'children' para 'filhos' na hora de pegar
  const { children: filhos } = useChildren(); 
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (authLoading) return <div className="p-10 text-center">Carregando...</div>;

  if (!user) return <div className="p-10 text-center">Por favor, faça login.</div>;

  const renderView = () => {
    if (activeTab === 'filhos') {
      return <FilhosView filhos={filhos || []} onNavigate={setActiveTab} />;
    }
    return <HomeView profile={{name: user.displayName || "Missionária"}} onNavigate={setActiveTab} />;
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userProfile={{nome: user.displayName || "Débora"}}>
      {renderView()}
    </Layout>
  );
};

export default App;