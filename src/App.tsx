import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 

import Layout from './components/Layout'; 
import { usePrayers } from './hooks/usePrayers'; 

// Importando as visões das abas
import HomeView from './paginas/Home'; 
import FilhosView from './paginas/Filhos';
import AuthView from './paginas/Register';
import PrayersView from './paginas/Prayers'; 
import TimerView from './paginas/TimerView'; // 1. IMPORTANTE: Importar o Timer aqui!

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // 2. ESTADOS DO TIMER (Precisam ficar aqui no topo!)
  const [timeLeft, setTimeLeft] = useState(15 * 60); 
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Pegando os dados reais (Orações do Banco, Filhos e Memorial)
  const { filhos, prayers, loading } = usePrayers();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  // Tela de Carregamento
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-lavender/5">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-purple font-bold italic">Carregando Geração Compromisso...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return <AuthView />;

  const renderView = () => {
    try {
      if (activeTab === 'home') {
        return <HomeView profile={{name: currentUser?.displayName || "Missionária"}} onNavigate={setActiveTab} />;
      }

      if (activeTab === 'filhos') {
        return <FilhosView filhos={filhos || []} onNavigate={setActiveTab} />;
      }

      if (activeTab === 'prayers') {
        return (
          <PrayersView 
            prayers={prayers || []} 
            filhos={filhos || []} 
            onNavigate={setActiveTab} 
          />
        );
      }

      // 3. ABA TIMER (Agora chamando o componente corretamente)
      if (activeTab === 'timer') {
        return (
          <TimerView 
            user={currentUser}
            userProfile={{ lastPrayerIndex: 0 }} 
            prayers={prayers || []}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            isTimerActive={isTimerActive}
            setIsTimerActive={setIsTimerActive}
            onFinish={(logs) => {
              setIsTimerActive(false);
              setActiveTab('home'); 
            }}
            onViewDiary={() => setActiveTab('prayers')} 
          />
        );
      }

      if (activeTab === 'community') {
        return (
          <div className="p-4 space-y-4 pb-20">
            <h2 className="serif-font text-2xl font-black text-brand-dark mb-4">Mural da Comunidade</h2>
            <div className="p-10 text-center bg-white rounded-[2.5rem] border border-brand-lavender/20">
               <i className="fa-solid fa-users text-brand-rose text-3xl mb-3"></i>
               <p className="text-gray-500 text-sm">Em breve, você poderá compartilhar e receber clamores de outras mães.</p>
            </div>
          </div>
        );
      }

      return <HomeView profile={{name: currentUser?.displayName || "Missionária"}} onNavigate={setActiveTab} />;
    } catch (e) {
      console.error("Erro na renderização:", e);
      return <div className="p-10 text-brand-rose font-bold text-center">Ops! Algo falhou ao carregar esta aba.</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userProfile={{nome: currentUser?.displayName || "Missionária"}}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;