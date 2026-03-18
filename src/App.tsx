import React, { useState } from 'react';
import { getAuth } from 'firebase/auth'; 

import Layout from './components/Layout'; 
import { usePrayers } from './hooks/usePrayers'; 

import HomeView from './paginas/Home'; 
import FilhosView from './paginas/Filhos';
import AuthView from './paginas/Register'; // ✅ ADICIONE ISSO

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { filhos, loading } = usePrayers();
  const auth = getAuth();

  if (loading) return <div className="p-10 text-center">Carregando...</div>;

  // ✅ SE NÃO ESTÁ LOGADO, MOSTRA TELA DE LOGIN/REGISTRO
  if (!auth.currentUser) return <AuthView />;

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