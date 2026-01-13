import React from 'react';
import { Download, Trash2, Trophy, Clock } from 'lucide-react';
import { Winner, Participant, Prize } from '../types';

interface HistoryBoardProps {
  winners: Winner[];
  participants: Participant[];
  prizes: Prize[];
  onClearHistory: () => void;
}

export const HistoryBoard: React.FC<HistoryBoardProps> = ({ winners, participants, prizes, onClearHistory }) => {
  const enrichedWinners = winners.map(w => {
    const p = participants.find(part => part.id === w.participantId);
    const prize = prizes.find(pr => pr.id === w.prizeId);
    return {
        ...w,
        participantName: p?.name || '未知人员',
        participantCode: p?.code || '---',
        department: p?.department || '---',
        prizeName: prize?.name || '未知奖项',
    };
  }).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="h-full flex flex-col space-y-8 pb-12">
      <div className="glass-panel px-8 py-7 flex justify-between items-center border-brand-blue/10">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">中奖名单</h2>
          <p className="text-brand-grey font-medium mt-1">记录年度盛典所有幸运时刻。</p>
        </div>
        <div className="flex gap-4">
             <button onClick={() => window.print()} className="bg-white/5 hover:bg-white/10 text-white border border-white/5 px-6 py-3 rounded-full font-black text-sm transition-all">
                <Download size={18} className="inline mr-2" /> 导出数据
            </button>
             <button onClick={onClearHistory} className="text-red-400 bg-red-500/10 hover:bg-red-500/20 px-6 py-3 rounded-full font-black text-sm transition-all border border-red-500/20">
                <Trash2 size={18} className="inline mr-2" /> 重置名单
            </button>
        </div>
      </div>

      <div className="glass-panel flex-1 overflow-hidden flex flex-col border-white/5">
        <div className="overflow-auto flex-1 bg-brand-bg/40">
            <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5 sticky top-0 z-10 backdrop-blur-xl">
                    <tr>
                        <th className="py-5 px-10 text-[10px] font-black text-brand-grey uppercase tracking-[0.2em]">奖项</th>
                        <th className="py-5 px-10 text-[10px] font-black text-brand-grey uppercase tracking-[0.2em]">姓名</th>
                        <th className="py-5 px-10 text-[10px] font-black text-brand-grey uppercase tracking-[0.2em]">部门 · 工号</th>
                        <th className="py-5 px-10 text-[10px] font-black text-brand-grey uppercase tracking-[0.2em] text-right">时间</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {enrichedWinners.length === 0 ? (
                         <tr>
                            <td colSpan={4} className="py-40 text-center">
                                <div className="flex flex-col items-center opacity-30">
                                    <Trophy size={64} className="text-brand-grey mb-4" />
                                    <p className="font-bold tracking-widest uppercase">等待中奖记录</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        enrichedWinners.map((w, idx) => (
                            <tr key={w.id} className="group hover:bg-brand-blue/5 transition-colors">
                                <td className="py-5 px-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-1.5 h-10 rounded-full ${idx < 3 ? 'bg-brand-blue shadow-neon' : 'bg-brand-grey'}`}></div>
                                        <span className={`text-lg font-black ${idx < 3 ? 'text-brand-blue' : 'text-white'}`}>{w.prizeName}</span>
                                    </div>
                                </td>
                                <td className="py-5 px-10">
                                    <span className="text-xl font-black text-white">{w.participantName}</span>
                                </td>
                                <td className="py-5 px-10">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-brand-grey font-bold">{w.department}</span>
                                        <span className="text-[10px] text-brand-grey font-mono mt-1">{w.participantCode}</span>
                                    </div>
                                </td>
                                <td className="py-5 px-10 text-right">
                                    <div className="flex items-center justify-end gap-2 text-brand-grey text-xs font-black">
                                        <Clock size={14} className="text-brand-blue" />
                                        {new Date(w.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};