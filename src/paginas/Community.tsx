
import React, { useState } from 'react';

const CommunityView: React.FC = () => {
  const [view, setView] = useState<'feed' | 'groups'>('feed');

  const mockPosts = [
    { id: '1', author: 'Maria S.', content: 'Peço oração pelo meu filho que começa a faculdade amanhã. Que o Senhor o proteja.', time: '12min', prays: 24, comments: 5 },
    { id: '2', author: 'Luciana M.', content: 'Glória a Deus! Meu filho conseguiu o emprego que tanto oramos!', time: '1h', prays: 56, comments: 12 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex bg-brand-soft p-1 rounded-full border border-brand-border">
        <button 
          onClick={() => setView('feed')}
          className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'feed' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400'}`}
        >
          Intercessão Coletiva
        </button>
        <button 
          onClick={() => setView('groups')}
          className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'groups' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400'}`}
        >
          Grupos de Oração
        </button>
      </div>

      {view === 'feed' ? (
        <div className="space-y-4 pb-20">
          <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-sm">
            <textarea 
              placeholder="Compartilhe um pedido ou agradecimento pelos filhos..."
              className="w-full bg-transparent text-sm resize-none h-20 focus:outline-none placeholder:text-gray-300 font-medium"
            />
            <div className="flex justify-end pt-2">
              <button className="gradient-brand text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform">Publicar</button>
            </div>
          </div>

          {mockPosts.map(post => (
            <div key={post.id} className="bg-white rounded-3xl p-5 border border-brand-border/40 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl gradient-brand flex items-center justify-center text-white font-black text-sm shadow-md">{post.author[0]}</div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-brand-dark">{post.author}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{post.time}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{post.content}</p>
              <div className="flex items-center justify-between pt-3 border-t border-brand-soft">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1.5 text-brand-primary group">
                    <i className="fa-solid fa-hands-praying transition-transform group-active:scale-125"></i>
                    <span className="text-[10px] font-black">{post.prays}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-400">
                    <i className="fa-regular fa-comment"></i>
                    <span className="text-[10px] font-black">{post.comments}</span>
                  </button>
                </div>
                <button className="text-gray-300 hover:text-brand-primary transition-colors">
                  <i className="fa-solid fa-share-nodes"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6 pb-20">
          <section className="space-y-3">
            <h3 className="text-[10px] font-black uppercase text-brand-primary tracking-widest px-1">Meus Grupos</h3>
            <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer">
              <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-location-dot text-2xl"></i>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-brand-dark">Déboras de Curitiba</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Grupo Local • 24 Mães</p>
              </div>
              <i className="fa-solid fa-chevron-right text-brand-primary opacity-30"></i>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-[10px] font-black uppercase text-brand-primary tracking-widest px-1">Encontrar Grupos</h3>
            <div className="grid grid-cols-1 gap-3">
              <GroupCategoryIcon icon="fa-globe" label="Grupos Online" color="bg-brand-gc text-white" />
              <GroupCategoryIcon icon="fa-baby" label="Mães de Bebês" color="bg-orange-400 text-white" />
              <GroupCategoryIcon icon="fa-person-half-dress" label="Mães de Adolescentes" color="bg-brand-secondary text-white" />
              <GroupCategoryIcon icon="fa-heart" label="Mães Solo" color="bg-red-500 text-white" />
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const GroupCategoryIcon = ({ icon, label, color }: any) => (
  <div className="bg-white rounded-2xl p-4 border border-brand-border flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:shadow-md">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${color}`}>
        <i className={`fa-solid ${icon} text-lg`}></i>
      </div>
      <span className="text-sm font-bold text-brand-dark">{label}</span>
    </div>
    <div className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center text-brand-primary">
        <i className="fa-solid fa-plus text-xs"></i>
    </div>
  </div>
);

export default CommunityView;
