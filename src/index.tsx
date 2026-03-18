import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth'; // Importação do Auth

// IMPORTANTE: Verifique se esses arquivos existem nestas pastas:
import Layout from './componentes/Layout'; // Ou onde o seu Layout estiver
import { usePrayers } from './hooks/usePrayers'; // Importação do Hook

import HomeView from './paginas/Home'; 
import FilhosView from './paginas/Filhos';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { filhos, loading } = usePrayers();
  const auth = getAuth();

  // Se estiver carregando, mostra um aviso (evita tela branca)
  if (loading) return <div className="p-10 text-center">Carregando...</div>;

  if (!auth.currentUser) return <div className="p-10 text-center">Por favor, faça login.</div>;

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