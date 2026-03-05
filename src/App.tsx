import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore'; 
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
import TimerView from './views/Timer';
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
  
  const [stats, setStats] = useState<UserStats>({ streak: 0, totalMinutes: 0, totalDays: 0, hasDailyTrophy: false });
  const [profile, setProfile] = useState<UserProfile>({
    name: "Missionária",
    birthDate: "",
    church: "",
    participationTime: "Iniciante",
    groupName: ""
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "usuarios", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(prev => ({ ...prev, name: data.nome, ...data }));
            setStats(prev => ({ ...prev, totalMinutes: data.minutosIntercedidos || 0, streak: data.diasConsecutivos || 0 }));
          }
        } catch (e) {
          console.error("Erro ao buscar perfil:", e);
        }
      }
      setIsLoading(false); 
    });
    return () => unsubscribe();
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
    timer: <TimerView stats={stats} setStats={setStats} onFinish={() => setActiveTab('home')} />,
    profile: <Profile profile={profile} stats={stats} setProfile={setProfile} />
  };

  return (
    <TimerProvider> {/* Envolve todo o app para o tempo não resetar */}
      <div className="relative min-h-screen bg-[#FFF5F1]">
        <GlobalTimer /> {/* Cronômetro flutuante visível em todas as telas */}
        
        <Layout activeTab={activeTab} onTabChange={setActiveTab} hasPending={false}>
          {views[activeTab]}
        </Layout>
      </div>
    </TimerProvider>
  );
};

export default App;