
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LotteryMachine } from './components/LotteryMachine';
import { ParticipantManager } from './components/ParticipantManager';
import { PrizeManager } from './components/PrizeManager';
import { HistoryBoard } from './components/HistoryBoard';
import { SettingsManager } from './components/SettingsManager';
import { db } from './utils/firebase';
import { ref, onValue, set, update } from 'firebase/database';
import { AppState, PageView, Participant, Prize, Winner, SiteConfig } from './types';

const INITIAL_PRIZES: Prize[] = [
  { id: '1', name: '特等奖', count: 1, drawnCount: 0, description: '神秘大奖', image: '🎁' },
  { id: '2', name: '一等奖', count: 3, drawnCount: 0, description: '新款智能手机', image: '📱' },
  { id: '3', name: '二等奖', count: 10, drawnCount: 0, description: '降噪耳机', image: '🎧' },
];

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('lottery');
  const [dbStatus, setDbStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  
  // Global State
  const [participants, setParticipants] = useState<Participant[]>([]);
  // Fix: Removed reference to non-existent 'prizesData' and used INITIAL_PRIZES
  const [prizes, setPrizes] = useState<Prize[]>(INITIAL_PRIZES);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ 
    brandName: 'CYPRESSTEL', 
    eventName: 'Annual Gala 2025', 
    logoUrl: '' 
  });

  // 1. Firebase 实时监听与后台同步
  useEffect(() => {
    const dataRef = ref(db, 'lottery_app');
    const connectedRef = ref(db, '.info/connected');

    // 监听连接状态
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        setDbStatus('online');
      } else {
        setDbStatus('offline');
      }
    });

    // 监听数据变化
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setParticipants(data.participants || []);
        setPrizes(data.prizes || INITIAL_PRIZES);
        setWinners(data.winners || []);
        setSiteConfig(data.siteConfig || { brandName: 'CYPRESSTEL', eventName: 'Annual Gala 2025' });
      } else {
        // 初始化云端
        set(dataRef, {
          participants: [],
          prizes: INITIAL_PRIZES,
          winners: [],
          siteConfig: { brandName: 'CYPRESSTEL', eventName: 'Annual Gala 2025', logoUrl: '' }
        });
      }
    }, (error) => {
      console.error("Firebase sync failed:", error);
      setDbStatus('offline');
    });

    return () => unsubscribe();
  }, []);

  const syncToCloud = (updates: Partial<AppState>) => {
    update(ref(db, 'lottery_app'), updates).catch(err => {
      console.warn("Update queued/failed:", err);
      setDbStatus('offline');
    });
  };

  const handleUpdateParticipants = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    syncToCloud({ participants: newParticipants });
  };

  const handleUpdatePrizes = (newPrizes: Prize[]) => {
    setPrizes(newPrizes);
    syncToCloud({ prizes: newPrizes });
  };

  const handleUpdateSiteConfig = (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    syncToCloud({ siteConfig: newConfig });
  };

  const handleFullStateImport = (state: AppState) => {
    set(ref(db, 'lottery_app'), state);
  };

  const handleDrawComplete = (newWinners: Winner[]) => {
    const updatedWinners = [...winners, ...newWinners];
    const winnerIds = new Set(newWinners.map(w => w.participantId));
    const updatedParticipants = participants.map(p => 
        winnerIds.has(p.id) ? { ...p, isWinner: true } : p
    );

    let updatedPrizes = prizes;
    if (newWinners.length > 0) {
        const prizeId = newWinners[0].prizeId;
        updatedPrizes = prizes.map(p => 
            p.id === prizeId ? { ...p, drawnCount: p.drawnCount + newWinners.length } : p
        );
    }

    syncToCloud({
      winners: updatedWinners,
      participants: updatedParticipants,
      prizes: updatedPrizes
    });
  };

  const handleClearHistory = () => {
      if (window.confirm('确定要清空所有中奖记录吗？')) {
          syncToCloud({
            winners: [],
            participants: participants.map(p => ({ ...p, isWinner: false })),
            prizes: prizes.map(p => ({ ...p, drawnCount: 0 }))
          });
      }
  };

  const availableCount = participants.filter(p => !p.isWinner).length;

  const renderPage = () => {
    switch (currentPage) {
      case 'lottery':
        return <LotteryMachine participants={participants} prizes={prizes} onDrawComplete={handleDrawComplete} />;
      case 'participants':
        return <ParticipantManager participants={participants} setParticipants={handleUpdateParticipants} />;
      case 'prizes':
        return <PrizeManager prizes={prizes} setPrizes={handleUpdatePrizes} />;
      case 'history':
        return <HistoryBoard winners={winners} participants={participants} prizes={prizes} onClearHistory={handleClearHistory} />;
      case 'settings':
        return <SettingsManager siteConfig={siteConfig} onUpdate={handleUpdateSiteConfig} onFullStateUpdate={handleFullStateImport} />;
      default:
        return <div>Not found</div>;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      onNavigate={setCurrentPage} 
      poolSize={availableCount}
      siteConfig={siteConfig}
      dbStatus={dbStatus}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
