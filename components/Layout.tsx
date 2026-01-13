import React from 'react';
import { Users, Gift, Trophy, MonitorPlay, Command, Sparkles, User, Settings } from 'lucide-react';
import { PageView, SiteConfig } from '../types';

interface LayoutProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  children: React.ReactNode;
  poolSize?: number;
  siteConfig: SiteConfig;
}

export const Layout: React.FC<LayoutProps> = ({ currentPage, onNavigate, children, poolSize = 0, siteConfig }) => {
  const navItems = [
    { id: 'lottery', label: '大厅', icon: MonitorPlay },
    { id: 'participants', label: '人员', icon: Users },
    { id: 'prizes', label: '奖池', icon: Gift },
    { id: 'history', label: '荣耀', icon: Trophy },
    { id: 'settings', label: '设置', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-screen hero-gradient overflow-hidden selection:bg-brand-primary/30 relative">
      {/* Cinematic Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-12 py-4 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="p-2 bg-brand-primary/10 rounded-xl border border-brand-primary/20 backdrop-blur-md overflow-hidden flex items-center justify-center min-w-[40px] min-h-[40px]">
            {siteConfig.logoUrl ? (
              <img src={siteConfig.logoUrl} alt="logo" className="w-8 h-8 object-contain" />
            ) : (
              <Command className="text-brand-primary" size={20} />
            )}
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tighter text-white uppercase leading-none">{siteConfig.brandName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] text-brand-primary font-black uppercase tracking-[0.3em]">{siteConfig.eventName}</span>
              <div className="w-1 h-1 bg-brand-accent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          {currentPage === 'lottery' && (
            <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 backdrop-blur-2xl rounded-xl border border-white/5 group hover:bg-white/10 transition-all shadow-lg">
              <div className="text-right">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">当前奖池</div>
                <div className="text-[11px] text-brand-primary font-extrabold leading-none tabular-nums">{poolSize} <span className="text-[8px] font-medium opacity-60">ACTIVE</span></div>
              </div>
              <div className="w-7 h-7 rounded-lg border border-brand-primary/30 flex items-center justify-center bg-brand-primary/10 group-hover:scale-110 transition-transform">
                <User className="text-brand-primary" size={12} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 backdrop-blur-2xl rounded-xl border border-white/5 group hover:bg-white/10 transition-all shadow-lg">
            <div className="text-right">
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">系统状态</div>
              <div className="text-[11px] text-brand-accent font-extrabold leading-none uppercase">Online</div>
            </div>
            <div className="w-7 h-7 rounded-lg border border-brand-accent/30 flex items-center justify-center bg-brand-accent/10 group-hover:scale-110 transition-transform">
              <Sparkles className="text-brand-accent" size={12} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Stage */}
      <main className="flex-1 relative z-10 pt-16 pb-24 px-8 overflow-hidden">
        <div className="max-w-[1400px] mx-auto h-full animate-fade-in relative scale-adaptive">
          {children}
        </div>
      </main>

      {/* Floating Minimal Dock - Moved to Bottom Right */}
      <div className="fixed bottom-8 right-12 z-50">
        <nav className="flex items-center gap-2 p-2 bg-black/60 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as PageView)}
                title={item.label}
                className={`
                  group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500
                  ${isActive 
                    ? 'bg-brand-primary text-white shadow-[0_0_25px_rgba(15,108,255,0.5)] scale-110' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};