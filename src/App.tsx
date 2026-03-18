import HomeView from './paginas/Home'; 
import PrayersView from './paginas/Prayers';
import FilhosView from './paginas/Filhos';
import CommunityView from './paginas/Community';
import TimerView from './paginas/Timer'; 
import Profile from './paginas/Profile'; 
import MemorialView from './paginas/Memorial'; 
import RegisterView from './paginas/Register';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { filhos, loading } = usePrayers();
  const auth = getAuth();

  if (!auth.currentUser) return <div className="p-10 text-center">Por favor, faça login.</div>;

const renderView = () => {
  try {
    if (activeTab === 'filhos') {
      return (
        <FilhosView 
          filhos={filhos || []} 
          onNavigate={setActiveTab} 
        />
      );
    }
    return <HomeView profile={{name: "Missionária"}} onNavigate={setActiveTab} />;
  } catch (e) {
    return <div className="p-10">Erro ao carregar aba. Clique em Home.</div>;
  }
};

 return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userProfile={{nome: "Missionária"}}>
        {renderView()}
    </Layout>
  );
};

export default App;