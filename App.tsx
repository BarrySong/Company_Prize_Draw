
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LotteryMachine } from './components/LotteryMachine';
import { ParticipantManager } from './components/ParticipantManager';
import { PrizeManager } from './components/PrizeManager';
import { HistoryBoard } from './components/HistoryBoard';
import { SettingsManager } from './components/SettingsManager';
import { loadState, saveState } from './utils/storage';
import { AppState, PageView, Participant, Prize, Winner, SiteConfig } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('lottery');
  
  // Global State
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  // FIX: Added missing eventName property to initial siteConfig state
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ brandName: 'CYPRESSTEL', eventName: 'Annual Gala 2025', logoUrl: '' });

  // Initialize
  useEffect(() => {
    const initialState = loadState();
    setParticipants(initialState.participants);
    setPrizes(initialState.prizes);
    setWinners(initialState.winners);
    setSiteConfig(initialState.siteConfig);
  }, []);

  // Persist State
  useEffect(() => {
    saveState({ participants, prizes, winners, siteConfig });
  }, [participants, prizes, winners, siteConfig]);

  const handleUpdateParticipants = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
  };

  const handleUpdatePrizes = (newPrizes: Prize[]) => {
    setPrizes(newPrizes);
  };

  const handleUpdateSiteConfig = (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
  };

  const handleDrawComplete = (newWinners: Winner[]) => {
    setWinners(prev => [...prev, ...newWinners]);
    const winnerIds = new Set(newWinners.map(w => w.participantId));
    setParticipants(prev => prev.map(p => 
        winnerIds.has(p.id) ? { ...p, isWinner: true } : p
    ));
    if (newWinners.length > 0) {
        const prizeId = newWinners[0].prizeId;
        setPrizes(prev => prev.map(p => 
            p.id === prizeId ? { ...p, drawnCount: p.drawnCount + newWinners.length } : p
        ));
    }
  };

  const handleClearHistory = () => {
      setWinners([]);
      setParticipants(prev => prev.map(p => ({ ...p, isWinner: false })));
      setPrizes(prev => prev.map(p => ({ ...p, drawnCount: 0 })));
  };

  const availableCount = participants.filter(p => !p.isWinner).length;

  const renderPage = () => {
    switch (currentPage) {
      case 'lottery':
        return (
          <LotteryMachine 
            participants={participants} 
            prizes={prizes} 
            onDrawComplete={handleDrawComplete} 
          />
        );
      case 'participants':
        return (
          <ParticipantManager 
            participants={participants} 
            setParticipants={handleUpdateParticipants} 
          />
        );
      case 'prizes':
        return (
          <PrizeManager 
            prizes={prizes} 
            setPrizes={handleUpdatePrizes} 
          />
        );
      case 'history':
        return (
          <HistoryBoard 
            winners={winners} 
            participants={participants} 
            prizes={prizes} 
            onClearHistory={handleClearHistory}
          />
        );
      case 'settings':
        return (
          <SettingsManager 
            siteConfig={siteConfig} 
            onUpdate={handleUpdateSiteConfig} 
          />
        );
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
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
