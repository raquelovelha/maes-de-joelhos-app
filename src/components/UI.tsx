
// Responsabilidade: Componentes visuais atômicos e reutilizáveis.
// Inputs: Props de layout e estilo | Outputs: UI consistente.

import React from 'react';
import { INSTITUTIONAL, IMAGENS } from '../constants';

export const BaseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ isOpen, onClose, title, subtitle, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[3rem] p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar border-t-8 border-brand-primary">
        <div className="text-center space-y-2">
          <h3 className="serif-font text-2xl font-black text-brand-dark">{title}</h3>
          {subtitle && <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{subtitle}</p>}
        </div>
        <div className="py-2">{children}</div>
        <div className="flex gap-3 pt-2">
          {footer || <button onClick={onClose} className="w-full py-4 bg-gray-100 text-gray-500 rounded-full text-xs font-black uppercase tracking-widest">Fechar</button>}
        </div>
      </div>
    </div>
  );
};

export const StatCard: React.FC<{ icon: string; label: string; value: string | number; color: string; bg: string; onClick?: () => void }> = ({ icon, label, value, color, bg, onClick }) => (
  <div onClick={onClick} className={`${bg} p-5 rounded-[2.5rem] flex flex-col items-center justify-center text-center border border-white/50 shadow-sm transition-transform active:scale-95 cursor-pointer`}>
    <i className={`fa-solid ${icon} ${color} text-xl mb-2`}></i>
    <p className="text-[8px] uppercase font-black text-gray-400 tracking-widest mb-1">{label}</p>
    <p className={`font-black text-sm ${color}`}>{value}</p>
  </div>
);

export const ActionButton: React.FC<{ label: string; onClick: () => void; variant?: 'primary' | 'outline' | 'gc'; icon?: string; fullWidth?: boolean; className?: string }> = ({ label, onClick, variant = 'primary', icon, fullWidth, className }) => {
  const styles = {
    primary: "gradient-brand text-white shadow-brand-primary/20",
    outline: "bg-white border-2 border-brand-border text-gray-500",
    gc: "bg-brand-gc text-white shadow-brand-gc/20"
  };
  return (
    <button onClick={onClick} className={`py-4 px-6 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-md ${styles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {icon && <i className={`fa-solid ${icon}`}></i>}
      {label}
    </button>
  );
};

export const InstitutionalFooter: React.FC = () => (
  <div className="flex flex-col items-center justify-center pt-4 pb-20 animate-fadeIn text-center">
    {/* Esta é a frase que sumiu: */}
    <p className="text-[10px] font-black uppercase text-brand-gc tracking-[0.3em] italic">{INSTITUTIONAL.phrase}</p>
    
    <p className="text-[8px] text-gray-400 mt-4 uppercase tracking-widest max-w-[200px] leading-relaxed">{INSTITUTIONAL.footerText}</p>
  </div>
);

export const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 bg-brand-lavender flex flex-col items-center justify-center z-[100] animate-fadeIn">
    <img src={INSTITUTIONAL.logoUrl} alt="Logo" className="w-48 mb-8 animate-pulse" />
    <p className="text-brand-rose text-[10px] font-black uppercase tracking-[0.4em]">Preparando o Altar...</p>
  </div>
);

export const ProgressBar: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => (
  <div className="space-y-1.5 w-full">
    <div className="flex justify-between text-[9px] font-black uppercase text-gray-500">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-brand-border/20">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${Math.min((value/max)*100, 100)}%` }}></div>
    </div>
  </div>
);
