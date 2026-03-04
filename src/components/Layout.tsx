
import React from 'react';
import { INSTITUTIONAL } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasPending?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, hasPending }) => {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header - Alterado para fundo Lavanda Suave / Rosa para um toque mais feminino e espiritual */}
      <header className="bg-brand-lavender/80 px-6 py-3 sticky top-0 z-40 border-b border-brand-rose/20 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-auto flex items-center justify-center">
              <img 
                src={INSTITUTIONAL.logoUrl} 
                alt="Desperta Débora Logo" 
                className="h-full w-auto object-contain transition-all hover:scale-105"
              />
            </div>
            <div className="flex flex-col ml-1">
              <span className="serif-font font-black text-sm text-brand-dark leading-none tracking-tight uppercase">
                {INSTITUTIONAL.ministryName}
              </span>
              <span className="text-[7px] font-black text-brand-rose uppercase tracking-[0.2em] mt-0.5 opacity-90">
                {INSTITUTIONAL.phrase}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onTabChange('profile')} 
            className="w-10 h-10 rounded-2xl border-2 border-brand-rose/30 p-0.5 overflow-hidden active:scale-95 transition-transform bg-white shadow-sm"
          >
            <img src="https://picsum.photos/seed/debora/100" alt="Profile" className="w-full h-full object-cover rounded-xl" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bottom-nav-blur border-t border-brand-lavender py-3 px-6 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <NavItem icon="fa-house" label="Home" active={activeTab === 'home'} onClick={() => onTabChange('home')} />
          <NavItem icon="fa-book-bible" label="Orações" active={activeTab === 'prayers'} onClick={() => onTabChange('prayers')} />
          <div className="relative -mt-12">
            <button 
                onClick={() => onTabChange('timer')}
                className="w-16 h-16 gradient-brand rounded-full shadow-2xl flex items-center justify-center text-white border-4 border-white transform transition active:scale-90 hover:scale-105 group"
            >
              <i className="fa-solid fa-clock text-2xl group-hover:rotate-12 transition-transform"></i>
            </button>
          </div>
          <NavItem 
            icon="fa-person-praying" 
            label="Filhos" 
            active={activeTab === 'filhos'} 
            onClick={() => onTabChange('filhos')} 
            badge={hasPending}
          />
          <NavItem icon="fa-users" label="Comunidade" active={activeTab === 'community'} onClick={() => onTabChange('community')} />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, badge }: { icon: string, label: string, active: boolean, onClick: () => void, badge?: boolean }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${active ? 'text-brand-rose scale-105 font-black' : 'text-gray-400 opacity-60'}`}>
    {badge && !active && (
      <div className="absolute top-0 right-1 w-2.5 h-2.5 bg-brand-gc border-2 border-white rounded-full animate-pulse z-10"></div>
    )}
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-brand-pink' : ''}`}>
        <i className={`fa-solid ${icon} text-lg`}></i>
    </div>
    <span className="text-[9px] uppercase tracking-tighter">{label}</span>
  </button>
);

export default Layout;
