import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; 
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Adicionado para buscar dados do perfil
import Layout from './components/Layout';
import HomeView from './views/Home';
import PrayersView from './views/Prayers';
import FilhosView from './views/Filhos';
import CommunityView from './views/Community';
import TimerView from './views/Timer';
import Profile from './views/Profile'; // Ajustado o nome do import
import RegisterView from './views/Register'; 
import { SplashScreen } from './components/UI';
import { useChildren } from './hooks/useChildren';
import { usePrayers } from './hooks/usePrayers';
import { UserStats, UserProfile } from './types';
import { db } from './firebase'; // Certifique-se de importar seu db

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); 
  
  const [stats, setStats] = useState<UserStats>({ streak: 3, totalMinutes: 245, totalDays: 12, hasDailyTrophy: false });
  const [profile, setProfile] = useState<UserProfile>({
    name: "Mãe Intercessora",
    birthDate: "",
    church: "Igreja Local",
    participationTime: "Iniciante",
    groupName: "Desperta Débora"
  });

  // Observador de Autenticação + Busca de dados do Firestore
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Busca o nome real da mãe salvo no Firestore durante o registro
        try {
          const docRef = doc(db, "usuarios", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(prev => ({ ...prev, name: data.nome }));
          }
        } catch (e) {
          console.error("Erro ao buscar perfil:", e);
        }
      }
      
      setIsLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  const { 
    children, 
    addChild, 
    deleteChild, 
    addRequest, 
    toggleRequestStatus, 
    registerPrayerTime 
  } = useChildren([]);

  const { prayers, toggleFavorite, togglePrayed, updateNote, loading: prayersLoading } = usePrayers();

  if (isLoading || (user && prayersLoading)) return <SplashScreen />;

  if (!user) {
    return <RegisterView />;
  }

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
    profile: <Profile profile={profile} stats={stats} setProfile={setProfile} /> // Ajustado para 'Profile'
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} hasPending={false}>
      {views[activeTab]}
    </Layout>
  );
};

export default App;