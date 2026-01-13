import React, { useState } from 'react';
import { Layout as LayoutIcon, Image as ImageIcon, Type, Save, CheckCircle, Command, Sparkles, Calendar } from 'lucide-react';
import { SiteConfig } from '../types';

interface SettingsManagerProps {
  siteConfig: SiteConfig;
  onUpdate: (config: SiteConfig) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ siteConfig, onUpdate }) => {
  const [tempConfig, setTempConfig] = useState<SiteConfig>(siteConfig);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    onUpdate(tempConfig);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempConfig({ ...tempConfig, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full items-center pt-8 md:pt-12 max-w-2xl mx-auto overflow-y-auto custom-scrollbar px-4">
      {/* Refined Header */}
      <div className="text-center shrink-0">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles size={20} className="text-brand-primary animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">品牌定制</h2>
        </div>
        <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-[10px]">Custom Branding & Visual Identity</p>
      </div>

      {/* Main Settings Card */}
      <div className="w-full glass-card rounded-[40px] p-8 md:p-10 border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl -mr-16 -mt-16 rounded-full"></div>
        
        {/* Brand Name Input */}
        <div className="space-y-3 relative z-10">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Type size={14} className="text-brand-primary" />
            主标题 (公司名称)
          </label>
          <input
            type="text"
            value={tempConfig.brandName}
            onChange={(e) => setTempConfig({ ...tempConfig, brandName: e.target.value })}
            placeholder="例如: CYPRESSTEL"
            className="liquid-input w-full px-6 py-4 rounded-2xl font-black text-xl tracking-tight focus:ring-2 ring-brand-primary/50 transition-all bg-white/5 border-white/10"
          />
        </div>

        {/* Event Name Input - NEW */}
        <div className="space-y-3 relative z-10">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Calendar size={14} className="text-brand-primary" />
            副标题 (活动名称)
          </label>
          <input
            type="text"
            value={tempConfig.eventName}
            onChange={(e) => setTempConfig({ ...tempConfig, eventName: e.target.value })}
            placeholder="例如: Annual Gala 2025"
            className="liquid-input w-full px-6 py-4 rounded-2xl font-bold text-sm tracking-widest focus:ring-2 ring-brand-primary/50 transition-all bg-white/5 border-white/10 uppercase"
          />
        </div>

        {/* Logo Upload Section */}
        <div className="space-y-3 relative z-10">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <ImageIcon size={14} className="text-brand-primary" />
            左上角 LOGO
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 rounded-3xl border border-dashed border-white/10 hover:border-brand-primary/30 transition-colors">
            <div className="w-20 h-20 rounded-2xl bg-brand-surface border border-white/5 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              {tempConfig.logoUrl ? (
                <img src={tempConfig.logoUrl} alt="Logo Preview" className="w-16 h-16 object-contain" />
              ) : (
                <LayoutIcon size={32} className="text-gray-700 opacity-40" />
              )}
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                id="logo-upload"
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className="inline-block px-6 py-2.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-xl text-xs font-black cursor-pointer transition-all border border-brand-primary/20"
              >
                选择图片文件
              </label>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">推荐 1:1 比例 · PNG 格式</p>
              {tempConfig.logoUrl && (
                <button 
                  onClick={() => setTempConfig({ ...tempConfig, logoUrl: '' })}
                  className="block text-[9px] text-red-500/60 font-black hover:text-red-500 transition-colors uppercase tracking-widest mx-auto sm:mx-0"
                >
                  [ 移除自定义 LOGO ]
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 relative z-10">
          <button
            onClick={handleSave}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
              showSuccess 
              ? 'bg-brand-accent text-white shadow-[0_0_40px_rgba(0,214,187,0.3)]' 
              : 'bg-brand-primary text-white shadow-brand-glow hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {showSuccess ? (
              <>
                <CheckCircle size={24} />
                <span className="tracking-widest uppercase">保存成功</span>
              </>
            ) : (
              <>
                <Save size={24} />
                <span className="tracking-widest uppercase">保存所有更改</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer Info / Preview Stats */}
      <div className="grid grid-cols-2 gap-4 w-full opacity-60 max-w-lg pb-12">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center">
            <div className="text-[8px] font-black uppercase text-gray-500 mb-2 tracking-widest">当前预览</div>
            <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-brand-primary/20 rounded-md border border-brand-primary/30 flex items-center justify-center overflow-hidden">
                        {tempConfig.logoUrl ? <img src={tempConfig.logoUrl} className="w-4 h-4 object-contain" /> : <Command size={10} className="text-brand-primary" />}
                    </div>
                    <div className="text-[10px] font-black text-white truncate max-w-[100px] uppercase">{tempConfig.brandName}</div>
                </div>
                <div className="text-[7px] text-brand-primary font-black uppercase ml-7 tracking-tighter">{tempConfig.eventName}</div>
            </div>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
             <div className="text-[8px] font-black uppercase text-gray-500 mb-1 tracking-widest">存储引擎</div>
             <div className="text-[10px] font-black text-brand-accent uppercase flex items-center gap-1">
               <div className="w-1 h-1 rounded-full bg-brand-accent animate-pulse"></div>
               Cloud Local
             </div>
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