import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; 
import { doc, onSnapshot } from 'firebase/firestore'; 
import { db } from './services/firebase'; // Ajustado para o seu caminho de serviço

import Layout from './components/Layout';
// Importando de 'paginas' conforme sua estrutura atual
import HomeView from './paginas/Home';
import PrayersView from './paginas/Prayers';
import FilhosView from './paginas/Filhos';
import TimerView from './paginas/Timer'; 
import AuthView from './paginas/Register'; 

import { usePrayers } from './hooks/usePrayers';
import { UserStats, UserProfile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); 
  
  // ESTADO GLOBAL DO TIMER (O cronômetro não para se você mudar de aba!)
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

  // Hook de dados (Orações e Filhos)
  const { filhos, prayers, loading: prayersLoading } = usePrayers();

  if (isLoading || (user && prayersLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-lavender/5">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-purple font-bold italic tracking-wide">Preparando seu Altar...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthView />;

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView profile={profile} onNavigate={setActiveTab} />;
      
      case 'prayers':
        return (
          <PrayersView 
            prayers={prayers || []} 
            filhos={filhos || []} 
            onNavigate={setActiveTab} 
          />
        );

      case 'timer':
        return (
          <TimerView 
            user={user}
            userProfile={profile}
            prayers={prayers || []} 
            timeLeft={timerSeconds}
            setTimeLeft={setTimerSeconds}
            isTimerActive={isTimerRunning}
            setIsTimerActive={setIsTimerRunning}
            onFinish={() => {
              setActiveTab('home');
              setIsTimerRunning(false);
              setTimerSeconds(15 * 60);
            }} 
            onViewDiary={() => setActiveTab('prayers')}
          />
        );

      case 'filhos':
        return <FilhosView filhos={filhos || []} onNavigate={setActiveTab} />;

      case 'community': 
        return (
          <div className="p-8 text-center bg-white rounded-[2.5rem] mt-10 border border-brand-lavender/20">
             <i className="fa-solid fa-users text-brand-rose text-3xl mb-3"></i>
             <p className="text-gray-500 text-sm italic">O Mural da Comunidade estará disponível em breve para unirmos nossos clamores.</p>
          </div>
        );

      default: 
        return <HomeView profile={profile} onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userProfile={profile}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;