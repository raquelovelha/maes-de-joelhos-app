import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomeView from './views/Home';
import PrayersView from './views/Prayers';
import FilhosView from './views/Filhos';
import CommunityView from './views/Community';
import TimerView from './views/Timer';
import ProfileView from './views/Profile';
import { SplashScreen } from './components/UI';
import { useChildren } from './hooks/useChildren';
import { usePrayers } from './hooks/usePrayers';
import { INITIAL_PRAYER_REQUESTS } from './constants';
import { UserStats, UserProfile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  
  // Pegamos todas as funções reais do nosso Hook atualizado
  const { 
    children, 
    acceptChild, 
    addChild, 
    addRequest, 
    toggleRequestStatus, 
    registerPrayerTime 
  } = useChildren([]);

  const { prayers, toggleFavorite, togglePrayed, updateNote } = usePrayers(INITIAL_PRAYER_REQUESTS);

  const [stats, setStats] = useState<UserStats>({ streak: 3, totalMinutes: 245, totalDays: 12, hasDailyTrophy: false });
  const [profile, setProfile] = useState<UserProfile>({
    name: "Ana Cláudia",
    birthDate: "1985-05-20",
    church: "Igreja Batista Aliança",
    participationTime: "2 anos",
    groupName: "Déboras de Curitiba"
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const hasPendingChildren = children.some(c => c.status === 'pending_review');

  if (isLoading) return <SplashScreen />;

  const views: Record<string, React.ReactNode> = {
    home: <HomeView stats={stats} prayers={prayers} onNavigate={setActiveTab} />,
    prayers: <PrayersView prayers={prayers} toggleFavorite={toggleFavorite} togglePrayed={togglePrayed} updateNote={updateNote} />,
    filhos: <FilhosView 
      children={children} 
      onAccept={acceptChild} 
      onAddChild={addChild} 
      onAddRequest={addRequest} // Agora passa a função real!
      onToggleRequest={toggleRequestStatus} // Agora passa a função real!
      onRegisterPrayer={registerPrayerTime} 
    />,
    community: <CommunityView />,
    timer: <TimerView stats={stats} setStats={setStats} onFinish={() => setActiveTab('home')} />,
    profile: <ProfileView profile={profile} stats={stats} setProfile={setProfile} />
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} hasPending={hasPendingChildren}>
      {views[activeTab]}
    </Layout>
  );
};

export default App;