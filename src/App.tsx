import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; 
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore'; 
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
import Timer from './views/Timer'; 
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
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const docRef = doc(db, "usuarios", currentUser.uid);
        
        // Verifica se o documento existe, se não, cria um inicial
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            nome: currentUser.displayName || "Missionária",
            minutosIntercedidos: 0,
            diasConsecutivos: 0,
            totalDias: 0,
            criadoEm: new Date().toISOString()
          });
        }

        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(prev => ({ 
              ...prev, 
              name: data.nome || prev.name,
              ...data 
            }));
            
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

  // Hooks Customizados
  const { children, addChild, deleteChild, addRequest, toggleRequestStatus, registerPrayerTime } = useChildren([]);
  const { prayers, toggleFavorite, togglePrayed, updateNote, loading: prayersLoading } = usePrayers();

  // Tela de carregamento ou Registro
  if (isLoading || (user && prayersLoading)) return <SplashScreen />;
  if (!user) return <RegisterView />;

  // MAPEAMENTO DAS PÁGINAS (VIEWS)
  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView profile={profile} onNavigate={setActiveTab} />;
      case 'prayers':
        return (
          <PrayersView 
            prayers={prayers} 
            toggleFavorite={toggleFavorite} 
            togglePrayed={togglePrayed} 
            updateNote={updateNote} 
            nomesFilhos={children.map(c => c.name)} 
          />
        );
      case 'filhos':
        return (
          <FilhosView 
            children={children} 
            onAddChild={addChild} 
            onDeleteChild={deleteChild} 
            onAddRequest={addRequest} 
            onToggleRequest={toggleRequestStatus} 
            onRegisterPrayer={registerPrayerTime} 
            onAccept={() => {}} 
          />
        );
      case 'community':
        return <CommunityView />;
      case 'timer':
        return <Timer stats={stats} setStats={setStats} onFinish={() => setActiveTab('home')} />;
      case 'profile':
        return <Profile profile={profile} stats={stats} setProfile={setProfile} />;
      default:
        return <HomeView profile={profile} onNavigate={setActiveTab} />;
    }
  };

  return (
    <TimerProvider> 
      <div className="relative min-h-screen bg-[#FFF5F1]">
        {/* O GlobalTimer agora consegue acessar o contexto do TimerProvider */}
        <GlobalTimer /> 
        
        <Layout 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userProfile={profile} 
        >
          {renderView()}
        </Layout>
      </div>
    </TimerProvider>
  );
};

export default App;