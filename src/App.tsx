import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; 
import { doc, onSnapshot } from 'firebase/firestore'; 
import { db } from './firebase'; 

import Layout from './components/Layout';
import HomeView from './views/Home';
import PrayersView from './views/Prayers';
import FilhosView from './views/Filhos';
import CommunityView from './views/Community';
import TimerView from './views/Timer'; 
import Profile from './views/Profile'; 
import MemorialView from './views/Memorial'; 
import RegisterView from './views/Register'; 
import { SplashScreen } from './components/UI';

import { useChildren } from './hooks/useChildren';
import { usePrayers } from './hooks/usePrayers';
import { UserStats, UserProfile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); 
  
  // ESTADO GLOBAL DO TIMER PARA PERSISTÊNCIA
  const [timerSeconds, setTimerSeconds] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: "Missionária",
    birthDate: "",
    church: "",
    participationTime: "Iniciante",
    groupName: ""
  });

  const [stats, setStats] = useState<UserStats>({ 
    streak: 0, totalMinutes: 0, totalDays: 0, hasDailyTrophy: false 
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "usuarios", currentUser.uid);
        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(prev => ({ ...prev, ...data }));
            setStats({
              streak: data.diasConsecutivos || 0,
              totalMinutes: data.minutosIntercedidos || 0,
              totalDays: data.totalDays || 0,
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
  const { prayers, toggleFavorite, loading: prayersLoading } = usePrayers();

  if (isLoading || (user && prayersLoading)) return <SplashScreen />;
  if (!user) return <RegisterView />;

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView profile={profile} onNavigate={setActiveTab} />;
      case 'prayers':
        return <PrayersView prayers={prayers} toggleFavorite={toggleFavorite} onNavigate={setActiveTab} />;
      case 'timer':
        return (
          <TimerView 
            user={user}
            prayers={prayers} 
            timeLeft={timerSeconds}
            setTimeLeft={setTimerSeconds}
            isTimerActive={isTimerRunning}
            setIsTimerActive={setIsTimerRunning}
            onFinish={() => {
              setActiveTab('home');
              setIsTimerRunning(false);
              setTimerSeconds(15 * 60);
            }} 
          />
        );
      case 'filhos':
        return (
          <FilhosView 
            children={children} onAddChild={addChild} onDeleteChild={deleteChild} 
            onAddRequest={addRequest} onToggleRequest={toggleRequestStatus} 
            onRegisterPrayer={registerPrayerTime} onAccept={() => {}} 
          />
        );
      case 'community': return <CommunityView />;
      case 'profile': return <Profile profile={profile} stats={stats} setProfile={setProfile} onNavigate={setActiveTab} />;
      case 'memorial': return <MemorialView user={user} onBack={() => setActiveTab('prayers')} />;
      default: return <HomeView profile={profile} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAFE]">
      <Layout activeTab={activeTab} onTabChange={setActiveTab} userProfile={profile}>
        <div className="max-w-md mx-auto px-4">
          {renderView()}
        </div>
      </Layout>
    </div>
  );
};

export default App;