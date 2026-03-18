import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Importamos o vigia

import Layout from './componentes/Layout'; 
import { usePrayers } from './hooks/usePrayers'; 
import HomeView from './paginas/Home'; 
import FilhosView from './paginas/Filhos';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<any>(null); // Guardar o usuário aqui
  const [authLoading, setAuthLoading] = useState(true); // Esperar o Firebase

  const { filhos, loading: prayersLoading } = usePrayers();
  const auth = getAuth();

  // Esse bloco espera o Firebase responder se tem alguém logado ou não
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // Se o Firebase ainda estiver pensando, mostra um carregando
  if (authLoading || prayersLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FFF9F5]">
        <div className="text-[#5D00B8] font-bold">Carregando...</div>
      </div>
    );
  }

  // Se depois de carregar não tiver usuário, mostra o aviso
  if (!user) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl mb-4">Bem-vinda ao Despertar de Débora</h2>
        <p className="text-gray-600">Por favor, faça login para continuar.</p>
        {/* Aqui depois colocamos o seu botão de login */}
      </div>
    );
  }

  const renderView = () => {
    try {
      if (activeTab === 'filhos') {
        return <FilhosView filhos={filhos || []} onNavigate={setActiveTab} />;
      }
      return <HomeView profile={{name: user.displayName || "Missionária"}} onNavigate={setActiveTab} />;
    } catch (e) {
      return <div className="p-10 text-red-500">Erro ao carregar aba. Clique em Home.</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userProfile={{nome: user.displayName || "Débora"}}>
      {renderView()}
    </Layout>
  );
};

export default App;