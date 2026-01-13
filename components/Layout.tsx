import React from 'react';
import { Users, Gift, Trophy, MonitorPlay, Command, Sparkles, User } from 'lucide-react';
import { PageView } from '../types';

interface LayoutProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  children: React.ReactNode;
  poolSize?: number; // Added to pass pool size to header
}

export const Layout: React.FC<LayoutProps> = ({ currentPage, onNavigate, children, poolSize = 0 }) => {
  const navItems = [
    { id: 'lottery', label: '大厅', icon: MonitorPlay },
    { id: 'participants', label: '人员', icon: Users },
    { id: 'prizes', label: '奖池', icon: Gift },
    { id: 'history', label: '荣耀', icon: Trophy },
  ];

  return (
    <div className="flex flex-col h-screen hero-gradient overflow-hidden selection:bg-brand-primary/30 relative">
      {/* Cinematic Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-12 py-4 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="p-2.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20 backdrop-blur-md">
            <Command className="text-brand-primary" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tighter text-white">CYPRESSTEL</h1>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-brand-primary font-black uppercase tracking-[0.3em]">Annual Gala 2025</span>
              <div className="w-1 h-1 bg-brand-accent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          {/* Prize Pool Stat Box - Integrated into header for consistency */}
          {currentPage === 'lottery' && (
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-2xl rounded-xl border border-white/5 min-w-[120px]">
              <div className="text-right">
                <div className="text-[10px] font-bold text-gray-300">当前奖池</div>
                <div className="text-[8px] text-brand-primary uppercase font-black">{poolSize} <span>Active</span></div>
              </div>
              <div className="w-8 h-8 rounded-full border border-brand-primary/30 flex items-center justify-center bg-brand-primary/5">
                <User className="text-brand-primary" size={14} />
              </div>
            </div>
          )}

          {/* System Status Box */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-2xl rounded-xl border border-white/5 min-w-[120px]">
            <div className="text-right">
              <div className="text-[10px] font-bold text-gray-300">系统就绪</div>
              <div className="text-[8px] text-brand-accent uppercase font-black">Secure Node 01</div>
            </div>
            <div className="w-8 h-8 rounded-full border border-brand-accent/30 flex items-center justify-center bg-brand-accent/5">
              <Sparkles className="text-brand-accent" size={14} />
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

      {/* Floating Minimal Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <nav className="flex items-center gap-3 p-2 bg-black/60 backdrop-blur-3xl rounded-[28px] border border-white/10 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as PageView)}
                className={`
                  group relative flex items-center gap-3 px-6 py-3 rounded-[20px] transition-all duration-500
                  ${isActive 
                    ? 'bg-brand-primary text-white shadow-[0_0_25px_rgba(15,108,255,0.5)] scale-105' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-sm font-bold tracking-tight ${isActive ? 'block' : 'hidden group-hover:block'}`}>
                  {item.label}
                </span>
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