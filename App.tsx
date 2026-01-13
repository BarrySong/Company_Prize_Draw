import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LotteryMachine } from './components/LotteryMachine';
import { ParticipantManager } from './components/ParticipantManager';
import { PrizeManager } from './components/PrizeManager';
import { HistoryBoard } from './components/HistoryBoard';
import { loadState, saveState } from './utils/storage';
import { AppState, PageView, Participant, Prize, Winner } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('lottery');
  
  // Global State
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);

  // Initialize
  useEffect(() => {
    const initialState = loadState();
    setParticipants(initialState.participants);
    setPrizes(initialState.prizes);
    setWinners(initialState.winners);
  }, []);

  // Persist State
  useEffect(() => {
    saveState({ participants, prizes, winners });
  }, [participants, prizes, winners]);

  const handleUpdateParticipants = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
  };

  const handleUpdatePrizes = (newPrizes: Prize[]) => {
    setPrizes(newPrizes);
  };

  const handleDrawComplete = (newWinners: Winner[]) => {
    // 1. Add to winners history
    setWinners(prev => [...prev, ...newWinners]);

    // 2. Mark participants as winners (remove from pool)
    const winnerIds = new Set(newWinners.map(w => w.participantId));
    setParticipants(prev => prev.map(p => 
        winnerIds.has(p.id) ? { ...p, isWinner: true } : p
    ));

    // 3. Update prize counts
    if (newWinners.length > 0) {
        const prizeId = newWinners[0].prizeId;
        setPrizes(prev => prev.map(p => 
            p.id === prizeId ? { ...p, drawnCount: p.drawnCount + newWinners.length } : p
        ));
    }
  };

  const handleClearHistory = () => {
      setWinners([]);
      // Reset participant winner status
      setParticipants(prev => prev.map(p => ({ ...p, isWinner: false })));
      // Reset prize counts
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
      default:
        return <div>Not found</div>;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage} poolSize={availableCount}>
      {renderPage()}
    </Layout>
  );
}

export default App;