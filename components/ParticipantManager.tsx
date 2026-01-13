import React, { useState } from 'react';
import { Trash2, Search, User, Check, Trophy, UserMinus } from 'lucide-react';
import { Participant } from '../types';
import { generateId } from '../utils/storage';

interface ParticipantManagerProps {
  participants: Participant[];
  setParticipants: (p: Participant[]) => void;
}

export const ParticipantManager: React.FC<ParticipantManagerProps> = ({ participants, setParticipants }) => {
  const [mode, setMode] = useState<'single' | 'batch'>('batch');
  const [importText, setImportText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'winner' | 'pending'>('all');
  
  // Single member state
  const [singleName, setSingleName] = useState('');
  const [singleCode, setSingleCode] = useState('');
  const [singleDept, setSingleDept] = useState('');

  const handleBatchImport = () => {
    if (!importText.trim()) return;
    const lines = importText.split('\n');
    const news = lines.map(line => {
      const parts = line.split(/[,，\t\s]+/).map(s => s.trim());
      return parts.length >= 2 ? { id: generateId(), name: parts[0], code: parts[1], department: parts[2] || '通用', isWinner: false } : null;
    }).filter(Boolean) as Participant[];
    setParticipants([...participants, ...news]);
    setImportText('');
  };

  const handleSingleAdd = () => {
    if (!singleName || !singleCode) return;
    const newP = { id: generateId(), name: singleName, code: singleCode, department: singleDept || '通用', isWinner: false };
    setParticipants([...participants, newP]);
    setSingleName(''); setSingleCode(''); setSingleDept('');
  };

  const filtered = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'winner') return matchesSearch && p.isWinner;
    if (statusFilter === 'pending') return matchesSearch && !p.isWinner;
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8 pb-10 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-white mb-2">全员名单</h2>
          <div className="flex items-center gap-3">
            <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-xs">Staff Registry & Management</p>
            <div className="flex items-center gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div>
               <span className="text-[10px] text-brand-accent font-black uppercase">Live DB</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-md">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${statusFilter === 'all' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
            >全部</button>
            <button 
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${statusFilter === 'pending' ? 'bg-brand-primary/20 text-brand-primary' : 'text-gray-500'}`}
            >待抽取</button>
            <button 
              onClick={() => setStatusFilter('winner')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${statusFilter === 'winner' ? 'bg-brand-accent/20 text-brand-accent' : 'text-gray-500'}`}
            >已中奖</button>
          </div>

          <div className="relative glass-card px-4 py-2 rounded-2xl flex items-center gap-2 flex-1 md:flex-initial border border-white/10">
            <Search size={16} className="text-brand-primary" />
            <input 
              className="bg-transparent border-none focus:outline-none text-sm font-bold text-white placeholder-gray-600 w-full"
              placeholder="快速检索..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="px-6 py-2 bg-brand-primary/10 rounded-2xl border border-brand-primary/30 text-brand-primary font-black text-xs whitespace-nowrap">
            {participants.length} 人总数
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 items-start">
        {/* Left Input Section */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-[32px] p-6 flex flex-col border border-white/5">
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6 shrink-0">
              <button onClick={() => setMode('batch')} className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all ${mode === 'batch' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>批量导入</button>
              <button onClick={() => setMode('single')} className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all ${mode === 'single' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>单人登记</button>
            </div>
            
            <div className="min-h-[220px] flex flex-col">
              {mode === 'batch' ? (
                <textarea 
                  className="flex-1 w-full liquid-input rounded-xl p-4 text-sm font-medium focus:outline-none resize-none mb-4 min-h-[180px]"
                  placeholder="格式：姓名, 工号, 部门 (每行一人)"
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                />
              ) : (
                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black text-gray-500 mb-1 block uppercase tracking-widest">姓名</label>
                      <input value={singleName} onChange={e => setSingleName(e.target.value)} className="liquid-input w-full px-4 py-2.5 rounded-xl text-sm" placeholder="姓名" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-500 mb-1 block uppercase tracking-widest">工号</label>
                      <input value={singleCode} onChange={e => setSingleCode(e.target.value)} className="liquid-input w-full px-4 py-2.5 rounded-xl text-sm" placeholder="工号" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-500 mb-1 block uppercase tracking-widest">部门</label>
                    <input value={singleDept} onChange={e => setSingleDept(e.target.value)} className="liquid-input w-full px-4 py-2.5 rounded-xl text-sm" placeholder="部门名称" />
                  </div>
                </div>
              )}

              <button 
                onClick={mode === 'batch' ? handleBatchImport : handleSingleAdd} 
                className="w-full py-3.5 bg-brand-primary text-white rounded-xl font-black text-sm shadow-brand-glow hover:brightness-110 active:scale-[0.98] transition-all"
              >
                {mode === 'batch' ? '执行批量入库' : '确认添加成员'}
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5">
             <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">数据库状态</div>
             <div className="flex gap-4 mt-2">
                <div className="flex-1">
                  <div className="text-white font-black text-lg">{participants.filter(p => p.isWinner).length}</div>
                  <div className="text-[9px] text-brand-accent font-bold uppercase">已抽取</div>
                </div>
                <div className="flex-1">
                  <div className="text-white font-black text-lg">{participants.filter(p => !p.isWinner).length}</div>
                  <div className="text-[9px] text-brand-primary font-bold uppercase">奖池中</div>
                </div>
             </div>
          </div>
        </div>

        {/* Right List Section */}
        <div className="lg:col-span-8 h-full overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
            {filtered.length > 0 ? filtered.map(p => (
              <div key={p.id} className={`glass-card p-5 rounded-3xl flex items-center justify-between group transition-all border ${p.isWinner ? 'border-brand-accent/20 bg-brand-accent/[0.02]' : 'border-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black transition-colors ${p.isWinner ? 'bg-brand-accent/20 text-brand-accent' : 'bg-brand-primary/20 text-brand-primary'}`}>
                    {p.isWinner ? <Trophy size={18} /> : <User size={18} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-black text-white text-sm">{p.name}</div>
                      {p.isWinner ? (
                        <span className="text-[8px] bg-brand-accent/10 text-brand-accent px-1.5 py-0.5 rounded border border-brand-accent/20 font-black uppercase tracking-tighter">Winner</span>
                      ) : (
                        <span className="text-[8px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded border border-brand-primary/20 font-black uppercase tracking-tighter">Pending</span>
                      )}
                    </div>
                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{p.department} · {p.code}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {p.isWinner && <Check size={14} className="text-brand-accent mr-2" />}
                  <button onClick={() => setParticipants(participants.filter(x => x.id !== p.id))} className="p-2.5 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-16 text-center glass-card rounded-3xl opacity-30 border border-dashed border-white/10 flex flex-col items-center gap-3">
                <UserMinus size={32} />
                <p className="italic text-sm">暂无符合条件的成员</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
