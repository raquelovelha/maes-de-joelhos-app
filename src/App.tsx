import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import Layout from './components/Layout';
import HomeView from './views/Home';
import FilhosView from './views/Filhos';
import { usePrayers } from './hooks/usePrayers';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { filhos, loading } = usePrayers();
  const auth = getAuth();

  if (!auth.currentUser) return <div className="p-10 text-center">Por favor, faça login.</div>;

  const renderView = () => {
    try {
      if (activeTab === 'filhos') {
        return <FilhosView filhos={filhos || []} onNavigate={setActiveTab} />;
      }
      return <HomeView profile={{name: "Missionária"}} onNavigate={setActiveTab} />;
    } catch (e) {
      return <div className="p-10">Erro ao carregar aba. Clique em Home.</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userProfile={{name: "User"}}>
      <main className="max-w-md mx-auto p-4 pb-32">
        {renderView()}
      </main>
    </Layout>
  );
};

export default App;