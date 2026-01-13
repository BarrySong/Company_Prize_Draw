import React, { useState } from 'react';
import { Gift, Plus, Trash2, Edit2, Package, Sparkles } from 'lucide-react';
import { Prize } from '../types';
import { generateId } from '../utils/storage';

interface PrizeManagerProps {
  prizes: Prize[];
  setPrizes: (p: Prize[]) => void;
}

export const PrizeManager: React.FC<PrizeManagerProps> = ({ prizes, setPrizes }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPrize, setTempPrize] = useState<Partial<Prize>>({});

  const handleAdd = () => {
    const newPrize: Prize = { id: generateId(), name: '新奖项', count: 1, drawnCount: 0, description: '', image: '' };
    setPrizes([...prizes, newPrize]);
    startEdit(newPrize);
  };

  const startEdit = (prize: Prize) => { 
    setEditingId(prize.id); 
    setTempPrize({ ...prize }); 
  };
  
  const cancelEdit = () => { 
    setEditingId(null); 
    setTempPrize({}); 
  };
  
  const saveEdit = () => {
    if (!editingId) return;
    setPrizes(prizes.map((p) => (p.id === editingId ? { ...p, ...tempPrize } as Prize : p)));
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-6 h-full max-h-[calc(100vh-180px)] overflow-hidden">
      {/* Refined Header */}
      <div className="flex justify-between items-center px-4 shrink-0 mt-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-brand-primary" />
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">奖项配置</h2>
          </div>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em]">Prize Pool Calibration</p>
        </div>
        <button
          onClick={handleAdd}
          className="group bg-brand-primary text-white hover:scale-105 active:scale-95 transition-all px-6 py-2.5 rounded-2xl font-black text-xs shadow-brand-glow flex items-center gap-2"
        >
          <Plus size={18} strokeWidth={3} /> 
          <span>新增奖项</span>
        </button>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {prizes.map((prize) => (
            <div 
              key={prize.id} 
              className={`glass-card group rounded-[24px] overflow-hidden transition-all duration-500 border h-fit ${
                editingId === prize.id ? 'ring-2 ring-brand-primary border-transparent' : 'border-white/5 hover:border-brand-primary/30'
              }`}
            >
              {editingId === prize.id ? (
                <div className="p-4 space-y-3 bg-brand-surface/90 backdrop-blur-3xl">
                  <div className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1 flex items-center gap-2">
                    编辑奖项
                  </div>
                  
                  <div className="space-y-2">
                    <input type="text" value={tempPrize.name} onChange={(e) => setTempPrize({ ...tempPrize, name: e.target.value })} className="liquid-input w-full px-3 py-1.5 rounded-lg font-bold text-sm" placeholder="奖项名称" />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" min="1" value={tempPrize.count} onChange={(e) => setTempPrize({ ...tempPrize, count: parseInt(e.target.value) || 0 })} className="liquid-input w-full px-3 py-1.5 rounded-lg font-bold text-sm" placeholder="名额" />
                      <input type="number" disabled value={tempPrize.drawnCount} className="w-full px-3 py-1.5 rounded-lg bg-white/5 text-gray-600 border border-transparent font-bold text-sm" />
                    </div>

                    <input type="text" value={tempPrize.description} onChange={(e) => setTempPrize({ ...tempPrize, description: e.target.value })} className="liquid-input w-full px-3 py-1.5 rounded-lg text-xs" placeholder="描述" />
                    <input type="text" value={tempPrize.image} onChange={(e) => setTempPrize({ ...tempPrize, image: e.target.value })} className="liquid-input w-full px-3 py-1.5 rounded-lg text-[10px]" placeholder="图片URL" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button onClick={saveEdit} className="flex-1 bg-brand-primary text-white py-2 rounded-lg font-black text-xs">保存</button>
                    <button onClick={cancelEdit} className="px-3 py-2 bg-white/5 text-gray-500 rounded-lg text-xs font-bold">取消</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Reduced Image Area */}
                  <div className="relative h-28 flex items-center justify-center p-4 bg-gradient-to-b from-brand-primary/5 to-transparent overflow-hidden">
                    {prize.image ? (
                      <img src={prize.image} alt={prize.name} className="h-full object-contain drop-shadow-lg transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <Gift size={32} className="text-gray-700 opacity-20" />
                    )}
                    
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-[-5px] group-hover:translate-y-0">
                      <button onClick={() => startEdit(prize)} className="w-7 h-7 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center text-white hover:bg-brand-primary">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => setPrizes(prizes.filter(p => p.id !== prize.id))} className="w-7 h-7 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center text-white hover:bg-red-500">
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="absolute top-2 left-2 bg-brand-primary/20 backdrop-blur-md border border-brand-primary/30 px-2 py-0.5 rounded-full text-[9px] font-black text-brand-primary">
                      余 {prize.count - prize.drawnCount}
                    </div>
                  </div>

                  {/* Info Area - Compact */}
                  <div className="px-4 pb-4 pt-2">
                    <h3 className="text-base font-black text-white mb-0.5 tracking-tight truncate">{prize.name}</h3>
                    <p className="text-[10px] text-gray-500 font-medium mb-3 line-clamp-1">{prize.description || '年度盛典奖项'}</p>
                    
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Package size={10} className="text-brand-primary" />
                        进度 {prize.drawnCount}/{prize.count}
                      </span>
                      <span className="text-brand-primary">{Math.round((prize.drawnCount / (prize.count || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-brand-primary h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${(prize.drawnCount / (prize.count || 1)) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};