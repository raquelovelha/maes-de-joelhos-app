import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; 
import { doc, getDoc, onSnapshot } from 'firebase/firestore'; 
import { db } from './firebase'; 

// Providers e Componentes Globais
import { TimerProvider } from './contexts/TimerContext';
import GlobalTimer from './components/GlobalTimer';

// Views e UI
import Layout from './components/Layout';
import HomeView from './views/Home';
import PrayersView from './views/Prayers';
import FilhosView from './views/Filhos';
import CommunityView from './views/Community';
import Timer from './views/Timer'; // Nome ajustado para Timer.tsx
import Profile from './views/Profile'; 
import RegisterView from './views/Register'; 
import { SplashScreen } from './components/UI';

// Hooks e Types
import { useChildren } from './hooks/useChildren';
import { usePrayers } from './hooks/usePrayers';
import { UserStats, UserProfile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); 
  
  const [stats, setStats] = useState<UserStats>({ 
    streak: 0, 
    totalMinutes: 0, 
    totalDays: 0, 
    hasDailyTrophy: false 
  });

  const [profile, setProfile] = useState<UserProfile>({
    name: "Missionária",
    birthDate: "",
    church: "",
    participationTime: "Iniciante",
    groupName: ""
  });

  // Observador de Autenticação e Dados do Firestore em Tempo Real
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Usamos onSnapshot para que, quando o Timer salvar no banco, 
        // o App.tsx e o Profile atualizem sozinhos na hora!
        const docRef = doc(db, "usuarios", currentUser.uid);
        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(prev => ({ ...prev, nome: data.nome, ...data }));
            setStats({
              streak: data.diasConsecutivos || 0,
              totalMinutes: data.minutosIntercedidos || 0,
              totalDays: data.totalDias || 0,
              hasDailyTrophy: data.ultimoDiaOrado === new Date().toISOString().split('T')[0]
            });
          }
          setIsLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const { children, addChild, deleteChild, addRequest, toggleRequestStatus, registerPrayerTime } = useChildren([]);
  const { prayers, toggleFavorite, togglePrayed, updateNote, loading: prayersLoading } = usePrayers();

  if (isLoading || (user && prayersLoading)) return <SplashScreen />;
  if (!user) return <RegisterView />;

  const views: Record<string, React.ReactNode> = {
    home: <HomeView stats={stats} prayers={prayers} onNavigate={setActiveTab} nomesFilhos={children.map(c => c.name)} />,
    prayers: <PrayersView prayers={prayers} toggleFavorite={toggleFavorite} togglePrayed={togglePrayed} updateNote={updateNote} nomesFilhos={children.map(c => c.name)} />,
    filhos: <FilhosView 
      children={children} 
      onAddChild={addChild} 
      onDeleteChild={deleteChild} 
      onAddRequest={addRequest} 
      onToggleRequest={toggleRequestStatus} 
      onRegisterPrayer={registerPrayerTime} 
      onAccept={() => {}} 
    />,
    community: <CommunityView />,
    timer: <Timer stats={stats} setStats={setStats} onFinish={() => setActiveTab('home')} />,
    profile: <Profile profile={profile} stats={stats} setProfile={setProfile} />
  };

  return (
    <TimerProvider> 
      <div className="relative min-h-screen bg-[#FFF5F1]">
        <GlobalTimer /> 
        <Layout 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userProfile={profile} // Passa o perfil para as iniciais no header aparecerem
        >
          {views[activeTab]}
        </Layout>
      </div>
    </TimerProvider>
  );
};

export default App;