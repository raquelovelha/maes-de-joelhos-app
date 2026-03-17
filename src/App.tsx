import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; 
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore'; 
import { db } from './firebase'; 

import Layout from './components/Layout';
import HomeView from './views/Home';
import PrayersView from './views/Prayers';
import FilhosView from './views/Filhos';
import NovoFilhoView from './views/NovoFilho'; 
import CommunityView from './views/Community';
import TimerView from './views/Timer'; 
import Profile from './views/Profile'; 
import MemorialView from './views/Memorial'; 
import RegisterView from './views/Register'; 
import { SplashScreen } from './components/UI';

import { usePrayers } from './hooks/usePrayers';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); 
  const [timerSeconds, setTimerSeconds] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [profile, setProfile] = useState<any>({ name: "Missionária" });
  const [stats, setStats] = useState<any>({ streak: 0, totalMinutes: 0 });

  const { prayers, memorial, filhos, loading: prayersLoading } = usePrayers();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "usuarios", currentUser.uid);
        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(data);
            setStats({
              streak: data.diasConsecutivos || 0,
              totalMinutes: data.minutosIntercedidos || 0,
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

  if (isLoading || (user && prayersLoading)) return <SplashScreen />;
  if (!user) return <RegisterView />;

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <HomeView profile={profile} onNavigate={setActiveTab} />;
      case 'prayers': return <PrayersView prayers={prayers} onNavigate={setActiveTab} />;
      case 'filhos': return <FilhosView filhos={filhos} onNavigate={setActiveTab} />;
      case 'novo-filho': return <NovoFilhoView onNavigate={setActiveTab} />;
      case 'memorial': return <MemorialView memorial={memorial} onNavigate={setActiveTab} />;
      case 'timer':
        return (
          <TimerView 
            user={user} prayers={prayers} timeLeft={timerSeconds} setTimeLeft={setTimerSeconds}
            isTimerActive={isTimerRunning} setIsTimerActive={setIsTimerRunning}
            onFinish={() => setActiveTab('home')} 
          />
        );
      case 'community': return <CommunityView />;
      case 'profile': return <Profile profile={profile} stats={stats} onNavigate={setActiveTab} />;
      default: return <HomeView profile={profile} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFE]">
      <Layout activeTab={activeTab} onTabChange={setActiveTab} userProfile={profile}>
        <main className="max-w-md mx-auto px-4 pb-32 pt-4">
          {renderView()}
        </main>
      </Layout>
    </div>
  );
};

export default App;