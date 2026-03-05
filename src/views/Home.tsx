import React, { useMemo } from 'react';
import { UserStats, PrayerRequest } from '../types';
import { InstitutionalFooter, StatCard } from '../components/UI';
import { getAuth } from 'firebase/auth'; // Para buscar o contexto do usuário (opcional aqui se passar via props)

interface HomeProps {
  stats: UserStats;
  prayers: PrayerRequest[];
  onNavigate: (tab: string) => void;
  nomesFilhos?: string[]; // Adicionamos os nomes dos filhos como opcional
}

const HomeView: React.FC<HomeProps> = ({ stats, prayers, onNavigate, nomesFilhos = [] }) => {
  
  // Escolhe uma oração em destaque
  const featuredPrayer = useMemo(() => {
    if (!prayers || prayers.length === 0) return null;
    const unprayed = prayers.filter(p => !p.isPrayed);
    return unprayed.length > 0 ? unprayed[Math.floor(Math.random() * unprayed.length)] : prayers[0];
  }, [prayers]);

  // Função para personalizar o texto com o nome dos filhos
  const textoPersonalizado = useMemo(() => {
    if (!featuredPrayer) return "";
    const nomes = nomesFilhos.length > 0 ? nomesFilhos.join(' e ') : "meus filhos";
    
    // Substitui palavras genéricas por nomes reais se necessário
    // Por enquanto, vamos apenas garantir que o texto apareça
    return featuredPrayer.texto; 
  }, [featuredPrayer, nomesFilhos]);

  if (!featuredPrayer) return null;

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* CARD DE ORAÇÃO DO DIA */}
      <section 
        onClick={() => onNavigate('prayers')} 
        className="gradient-female rounded-[2.5rem] p-8 shadow-md border border-brand-pink relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="relative z-10">
          <span className="text-[10px] font-black text-brand-rose uppercase tracking-[0.2em] mb-3 block">
            Sugestão para {nomesFilhos.length > 0 ? nomesFilhos[0] : 'Hoje'}
          </span>
          
          {/* Ajustado para usar .versiculo do Firebase */}
          <h2 className="serif-font text-xl font-bold text-brand-dark mb-4 leading-snug italic">
            "{featuredPrayer.versiculo}"
          </h2>
          
          {/* Ajustado para usar .texto do Firebase */}
          <p className="text-sm text-brand-dark opacity-80 mb-5 leading-relaxed">
            {textoPersonalizado}
          </p>

          <p className="text-[9px] font-black text-brand-rose uppercase tracking-widest opacity-60">
            Categoria: {featuredPrayer.categoria}
          </p>
        </div>
      </section>

      {/* STATUS */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon="fa-fire" label="Ofensiva" value={`${stats.streak} d`} color="text-brand-primary" bg="bg-brand-soft" />
        <StatCard icon="fa-clock" label="Orado" value={`${stats.totalMinutes}m`} color="text-brand-rose" bg="bg-brand-pink" />
      </div>

      {/* CARD GERAÇÃO COMPROMISSO */}
      <section 
        className="bg-brand-gc rounded-[2rem] p-6 text-white shadow-xl cursor-pointer active:scale-95 transition-transform" 
        onClick={() => onNavigate('filhos')}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/80">
              Orando pela...
            </p>
          </div>
          <i className="fa-solid fa-chevron-right opacity-40"></i>
        </div>
        
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