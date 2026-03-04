// Responsabilidade: Dashboard inicial e Palavra do Dia.
import React, { useMemo } from 'react';
import { UserStats, PrayerRequest } from '../types';
import { InstitutionalFooter, StatCard } from '../components/UI';
import { INSTITUTIONAL } from '../constants';

interface HomeProps {
  stats: UserStats;
  prayers: PrayerRequest[];
  onNavigate: (tab: string) => void;
}

const HomeView: React.FC<HomeProps> = ({ stats, prayers, onNavigate }) => {
  const featuredPrayer = useMemo(() => {
    const unprayed = prayers.filter(p => !p.isPrayed);
    return unprayed.length > 0 ? unprayed[Math.floor(Math.random() * unprayed.length)] : prayers[0];
  }, [prayers]);

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <section onClick={() => onNavigate('prayers')} className="gradient-female rounded-[2.5rem] p-8 shadow-md border border-brand-pink relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform">
        <div className="relative z-10">
          <span className="text-[10px] font-black text-brand-rose uppercase tracking-[0.2em] mb-3 block">Palavra de Hoje</span>
          <h2 className="serif-font text-2xl font-bold text-brand-dark mb-5 leading-snug italic">"{featuredPrayer.verse}"</h2>
          <p className="text-[9px] font-black text-brand-rose uppercase tracking-widest opacity-60">Foco: {featuredPrayer.title}</p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon="fa-fire" label="Ofensiva" value={`${stats.streak} d`} color="text-brand-primary" bg="bg-brand-soft" />
        <StatCard icon="fa-clock" label="Orado" value={`${stats.totalMinutes}m`} color="text-brand-rose" bg="bg-brand-pink" />
      </div>

<section className="bg-brand-gc rounded-[2rem] p-6 text-white shadow-xl cursor-pointer active:scale-95 transition-transform" onClick={() => onNavigate('filhos')}>
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            {/* Título removido para evitar redundância com a logo abaixo */}
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/80">
              Orando pela...
            </p>
          </div>
          <i className="fa-solid fa-chevron-right opacity-40"></i>
        </div>
        
        {/* Container da logo horizontal conforme sua solicitação anterior */}
        <div className="bg-white rounded-xl p-4 flex justify-center items-center overflow-hidden">
          <img 
            src="https://i.postimg.cc/MKLSGrq8/GC-horizontal-cores-gradiente-fundoclaro.png" 
            alt="Logo Geração Compromisso" 
            className="h-10 w-auto object-contain"
          />
        </div>
      </section>

      <InstitutionalFooter />
    </div>
  );
};

export default HomeView;