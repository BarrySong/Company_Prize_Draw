
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Check, Sparkles, Zap, ChevronLeft, ChevronRight, Heart, Star, Flame } from 'lucide-react';
import { Participant, Prize, Winner } from '../types';
import { generateId } from '../utils/storage';

interface LotteryMachineProps {
  participants: Participant[];
  prizes: Prize[];
  onDrawComplete: (winners: Winner[]) => void;
}

const FestiveDecoration = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Floating Lanterns */}
    <div className="absolute top-10 left-[5%] animate-float-slow opacity-40">
      <div className="w-12 h-16 bg-red-600 rounded-t-full relative shadow-[0_0_30px_rgba(220,38,38,0.5)]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-yellow-500"></div>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-yellow-600 rounded-full"></div>
      </div>
    </div>
    <div className="absolute top-32 right-[8%] animate-float-medium opacity-30">
      <div className="w-10 h-14 bg-red-500 rounded-t-full relative shadow-[0_0_20px_rgba(220,38,38,0.4)]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-yellow-400"></div>
      </div>
    </div>
    
    {/* Decorative Badges */}
    <div className="absolute bottom-40 left-[10%] animate-pulse opacity-20 hidden xl:block">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 border-2 border-brand-primary/30 rounded-full flex items-center justify-center rotate-12">
          <span className="text-brand-primary font-black text-[10px] tracking-widest uppercase">Lucky 2025</span>
        </div>
      </div>
    </div>

    {/* Light Beams */}
    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
  </div>
);

export const LotteryMachine: React.FC<LotteryMachineProps> = ({
  participants,
  prizes,
  onDrawComplete,
}) => {
  const [activePrizeIndex, setActivePrizeIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentDisplayNames, setCurrentDisplayNames] = useState<Participant[]>([]);
  const [drawCount] = useState(1);
  const [showResultModal, setShowResultModal] = useState(false);
  const [roundWinners, setRoundWinners] = useState<Participant[]>([]);
  
  const animationRef = useRef<number>();
  const lastUpdateTime = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const availableParticipants = participants.filter((p) => !p.isWinner);
  const currentPrize = prizes[activePrizeIndex];

  const hasPrizes = prizes && prizes.length > 0;

  const getPrizeAt = (offset: number = 0) => {
    if (!hasPrizes) return null;
    const index = (activePrizeIndex + offset + prizes.length) % prizes.length;
    return { prize: prizes[index], index };
  };

  const isEmoji = (str: string | undefined) => {
    if (!str) return false;
    return str.length <= 4 && !str.startsWith('http');
  };

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
  };

  const playSound = (type: 'start' | 'tick' | 'stop' | 'win' | 'select') => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    if (type === 'select') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.1);
      return;
    }

    if (type === 'start') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.1);
    } else if (type === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150 + Math.random() * 100, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.05);
    } else if (type === 'stop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.2);
    } else if (type === 'win') {
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.1, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.5);
      });
    }
  };

  useEffect(() => {
    if (isRunning) {
      const update = (t: number) => {
        if (t - lastUpdateTime.current > 40) { 
          const rollPoolSize = Math.max(drawCount * 4, 20);
          const batch = Array.from({length: rollPoolSize}).map(() => 
            availableParticipants[Math.floor(Math.random() * availableParticipants.length)]
          );
          setCurrentDisplayNames(batch);
          playSound('tick');
          lastUpdateTime.current = t;
        }
        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  }, [isRunning, availableParticipants, drawCount]);

  const handleDraw = () => {
    initAudio();
    if (!currentPrize || availableParticipants.length < drawCount) return;
    if (!isRunning) {
      setIsRunning(true);
      playSound('start');
    } else {
      setIsRunning(false);
      playSound('stop');
      const winners = [];
      const pool = [...availableParticipants];
      for (let i = 0; i < drawCount; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        winners.push(pool.splice(idx, 1)[0]);
      }
      setCurrentDisplayNames(winners);
      setRoundWinners(winners);
      setTimeout(() => {
        setShowResultModal(true);
        playSound('win');
        confetti({ 
          particleCount: 250, 
          spread: 120, 
          origin: { y: 0.5 }, 
          colors: ['#0f6cff', '#00d6bb', '#ffffff', '#ffa600', '#ff0000'],
          gravity: 0.8
        });
        onDrawComplete(winners.map(w => ({ id: generateId(), participantId: w.id, prizeId: currentPrize.id, timestamp: Date.now() })));
      }, 400);
    }
  };

  const navigatePrize = (direction: number) => {
    if (isRunning || !hasPrizes) return;
    initAudio();
    playSound('select');
    setActivePrizeIndex(prev => (prev + direction + prizes.length) % prizes.length);
  };

  const leftPrize = getPrizeAt(-1);
  const rightPrize = getPrizeAt(1);

  if (!hasPrizes) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center opacity-40">
        <Trophy size={80} className="mb-4 text-gray-500" />
        <p className="font-black uppercase tracking-widest text-sm">奖池未配置</p>
      </div>
    );
  }

  const renderPrizeImage = (prize: Prize | null, className: string = "w-full h-full object-contain") => {
    if (!prize) return null;
    if (isEmoji(prize.image)) {
      return (
        <span className="text-[100px] leading-none select-none drop-shadow-2xl floating">
          {prize.image}
        </span>
      );
    }
    if (prize.image) {
      return <img src={prize.image} className={className} alt={prize.name} />;
    }
    return <Trophy className="text-brand-primary opacity-20" strokeWidth={0.8} />;
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
      <FestiveDecoration />

      <div className="w-full flex flex-col items-center justify-center -mt-24 relative z-10">
        
        {/* Draw Animation Overlay */}
        <div className={`fixed inset-0 z-[60] bg-[#050810] transition-all duration-1000 flex flex-col items-center justify-center overflow-hidden ${isRunning ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,108,255,0.15)_0%,transparent_70%)] animate-pulse"></div>
           <div className="relative z-10 w-full max-w-6xl flex flex-col items-center -mt-20">
              <div className="mb-12 text-center space-y-4">
                 <div className="inline-flex items-center gap-3 bg-brand-primary/20 border border-brand-primary/40 px-6 py-2 rounded-full backdrop-blur-3xl animate-bounce">
                    <Sparkles className="text-brand-accent" size={20} />
                    <span className="text-brand-primary font-black text-lg tracking-[0.5em] uppercase">正在锁定</span>
                 </div>
                 <h3 className="text-white text-7xl font-black tracking-tighter opacity-80 uppercase">{currentPrize?.name}</h3>
              </div>
              <div className="w-full relative py-8 overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-transparent to-[#050810] z-20 pointer-events-none"></div>
                 <div className="flex items-center justify-center gap-12 animate-vortex">
                    {currentDisplayNames.map((p, i) => (
                      <div key={i} className="shrink-0">
                        <div className="w-80 h-48 glass-card rounded-[40px] border-brand-primary/30 flex flex-col items-center justify-center p-8 bg-brand-primary/5 scale-95 opacity-40 blur-[2px]">
                           <div className="text-5xl font-black text-white tracking-tighter mb-3">{p?.name}</div>
                           <div className="text-xs text-brand-primary font-black tracking-[0.3em] uppercase opacity-60">{p?.department}</div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
           <div className="absolute bottom-40">
              <button onClick={handleDraw} className="group relative px-28 py-10 bg-white text-brand-surface rounded-full text-4xl font-black hover:scale-105 transition-all shadow-[0_0_100px_rgba(15,108,255,0.4)] active:scale-95">
                <span className="relative z-10 uppercase tracking-widest">停止抽奖</span>
              </button>
           </div>
        </div>

        {!isRunning && (
          <div className="animate-fade-in flex flex-col items-center w-full max-w-7xl">
            
            {/* Cinematic Stage */}
            <div className="relative flex items-center justify-center w-full h-80 mb-16">
              
              {/* Floating Emblems around Stage */}
              <div className="absolute -top-10 left-1/4 animate-float-slow text-brand-accent/20">
                <Heart size={40} />
              </div>
              <div className="absolute top-0 right-1/4 animate-float-medium text-brand-primary/20">
                <Star size={30} fill="currentColor" />
              </div>
              
              {/* Left Secondary Card */}
              {prizes.length > 1 && leftPrize && (
                <button 
                  onClick={() => navigatePrize(-1)}
                  className="absolute left-[8%] xl:left-[18%] w-48 h-64 glass-card rounded-[40px] border-white/5 opacity-15 blur-[3px] scale-90 hover:opacity-40 transition-all duration-700 hover:scale-95 z-0"
                >
                  <div className="flex flex-col items-center justify-center gap-4 text-center p-6 grayscale h-full">
                    <div className="w-24 h-24 flex items-center justify-center opacity-60">
                      {isEmoji(leftPrize.prize.image) ? (
                        <span className="text-5xl">{leftPrize.prize.image}</span>
                      ) : (
                        leftPrize.prize.image ? (
                          <img src={leftPrize.prize.image} className="w-full h-full object-contain" alt="" />
                        ) : (
                          <Trophy size={48} className="text-white/40" />
                        )
                      )}
                    </div>
                    <div className="text-white/40 font-black text-[10px] uppercase tracking-widest truncate w-full px-2">{leftPrize.prize.name}</div>
                  </div>
                </button>
              )}

              {/* Central Focused Card */}
              <div className="relative z-20 group">
                <div className="absolute -inset-16 bg-brand-primary/20 blur-[120px] rounded-full animate-pulse opacity-40"></div>
                
                <div className="relative w-80 h-80 glass-card rounded-[60px] border-brand-primary/30 flex items-center justify-center p-12 floating shimmer shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden">
                  {renderPrizeImage(currentPrize, "w-full h-full object-contain scale-110")}
                </div>

                {/* Micro Navigation */}
                {prizes.length > 1 && (
                  <>
                    <button 
                      onClick={() => navigatePrize(-1)}
                      className="absolute -left-20 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-brand-primary transition-all hover:scale-125 z-30"
                    >
                      <ChevronLeft size={64} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => navigatePrize(1)}
                      className="absolute -right-20 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-brand-primary transition-all hover:scale-125 z-30"
                    >
                      <ChevronRight size={64} strokeWidth={2.5} />
                    </button>
                  </>
                )}
              </div>

              {/* Right Secondary Card */}
              {prizes.length > 2 && rightPrize && (
                <button 
                  onClick={() => navigatePrize(1)}
                  className="absolute right-[8%] xl:right-[18%] w-48 h-64 glass-card rounded-[40px] border-white/5 opacity-15 blur-[3px] scale-90 hover:opacity-40 transition-all duration-700 hover:scale-95 z-0"
                >
                  <div className="flex flex-col items-center justify-center gap-4 text-center p-6 grayscale h-full">
                    <div className="w-24 h-24 flex items-center justify-center opacity-60">
                      {isEmoji(rightPrize.prize.image) ? (
                        <span className="text-5xl">{rightPrize.prize.image}</span>
                      ) : (
                        rightPrize.prize.image ? (
                          <img src={rightPrize.prize.image} className="w-full h-full object-contain" alt="" />
                        ) : (
                          <Trophy size={48} className="text-white/40" />
                        )
                      )}
                    </div>
                    <div className="text-white/40 font-black text-[10px] uppercase tracking-widest truncate w-full px-2">{rightPrize.prize.name}</div>
                  </div>
                </button>
              )}

            </div>

            {/* Info Section */}
            <div className="text-center mb-10 w-full relative">
              {/* Small fire icon for 'hot' feeling */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1 opacity-40">
                <Flame size={16} className="text-brand-warning animate-bounce" />
                <Flame size={16} className="text-red-500 animate-bounce delay-75" />
                <Flame size={16} className="text-brand-warning animate-bounce delay-150" />
              </div>
              <h2 className="text-8xl font-black tracking-tighter text-white mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30">{currentPrize?.name}</h2>
              <div className="flex items-center justify-center gap-8 opacity-60">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-white/20"></div>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-brand-primary font-black tracking-[0.8em] text-[12px] uppercase">{currentPrize?.description || '荣耀盛典 · 年度巨献'}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">奖项剩余：{currentPrize?.count - currentPrize?.drawnCount} / {currentPrize?.count}</p>
                </div>
                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-white/20"></div>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={handleDraw} 
              disabled={!currentPrize || currentPrize.count <= currentPrize.drawnCount} 
              className="group relative px-28 py-8 bg-brand-primary text-white rounded-full text-4xl font-black shadow-[0_25px_80px_rgba(15,108,255,0.4)] hover:scale-105 active:scale-95 transition-all overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center">
                <span className="tracking-[0.2em] uppercase">立即抽奖</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            </button>
          </div>
        )}
      </div>

      {/* FIXED: AI PRECISION 2.5 label positioned further left-bottom, aligned with dock bottom edge */}
      <div className={`fixed bottom-11 left-12 transition-all duration-1000 ${isRunning ? 'translate-y-40 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="flex items-center gap-3 text-white/10 text-[10px] font-black uppercase tracking-[0.5em]">
             <Zap size={12} className="text-brand-accent animate-pulse" />
             AI PRECISION 2.5
          </div>
      </div>

      {showResultModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#050810]/98 backdrop-blur-3xl animate-fade-in">
          <div className="w-full max-w-5xl glass-card rounded-[60px] p-16 text-center border-white/10 shadow-[0_0_150px_rgba(15,108,255,0.2)] relative overflow-hidden scale-90 md:scale-100">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-primary/20 blur-[150px] rounded-full"></div>
            <div className="relative mb-10">
               <Trophy size={80} className="text-brand-warning mx-auto mb-6 floating" />
               <h3 className="text-7xl font-black tracking-tighter text-white mb-2">荣耀揭晓</h3>
               <p className="text-xl text-gray-400 font-medium">恭喜获得 <span className="text-brand-primary font-black uppercase tracking-widest">{currentPrize?.name}</span></p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mb-12 max-h-[40vh] overflow-y-auto custom-scrollbar">
              {roundWinners.map(w => (
                <div key={w.id} className="w-56 p-8 bg-white/5 rounded-[40px] border border-white/10 flex flex-col items-center group animate-scale-up">
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-[28px] flex items-center justify-center text-4xl font-black text-brand-primary uppercase mb-4">
                    {w.name[0]}
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{w.name}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{w.department}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowResultModal(false)} className="px-20 py-5 bg-brand-primary text-white rounded-full font-black text-xl shadow-brand-glow hover:scale-105 transition-all flex items-center gap-4 mx-auto">
              <span>确认领取</span>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Check size={20} strokeWidth={4} />
              </div>
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes vortex {
          0% { transform: translateX(20%); }
          100% { transform: translateX(-20%); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(-10deg); }
        }
        @keyframes scale-up {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-scale-up { animation: scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-vortex {
          display: flex;
          animation: vortex 0.4s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(15, 108, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
