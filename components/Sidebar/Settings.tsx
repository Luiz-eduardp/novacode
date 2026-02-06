
import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../../types';
import { THEMES } from '../../constants';


interface SettingsProps {
  currentTheme: string;
  onThemeChange: (theme: ThemeConfig) => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentTheme, onThemeChange }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);

  useEffect(() => {
    const checkKey = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        try {
          const selected = await aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          console.error("Erro ao verificar chave:", e);
        }
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      await aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full overflow-hidden">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Configurações</h2>

      <div className="space-y-6 flex-1 overflow-y-auto pr-1 no-scrollbar pb-10">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Serviços de IA</h3>
              <p className="text-[9px] text-slate-500">Gerencie sua conexão Gemini</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-black/20 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 font-medium">Status da Chave API</span>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold uppercase ${hasKey ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {hasKey ? 'Configurada' : 'Pendente'}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              </div>
            </div>

            <button
              onClick={handleSelectKey}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-[10px] font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Configurar Chave API
            </button>

            <a
              href="https://ai.google.dev/gemini-api/docs/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[9px] text-sky-500 hover:text-sky-400 text-center font-bold transition-colors underline decoration-sky-500/30"
            >
              Documentação de Faturamento
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase mb-3 px-1">Tema do Editor</h3>
          <div className="grid grid-cols-1 gap-2">
            {THEMES.map(theme => (
              <button
                key={theme.name}
                onClick={() => onThemeChange(theme)}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${currentTheme === theme.name ? 'border-sky-500 bg-white/10' : 'border-white/5 hover:border-white/10'
                  }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/10"
                  style={{ backgroundColor: theme.primary }}
                />
                <span className={`text-xs font-medium ${currentTheme === theme.name ? 'text-sky-400' : 'text-slate-400'}`}>
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase mb-3 px-1">Interface</h3>
          <div className="space-y-1">
            <label className="flex items-center justify-between p-2.5 hover:bg-white/5 rounded-xl cursor-pointer group transition-colors">
              <span className="text-xs text-slate-500 group-hover:text-slate-300">Minimapa</span>
              <input type="checkbox" defaultChecked className="accent-sky-500 w-4 h-4" />
            </label>
            <label className="flex items-center justify-between p-2.5 hover:bg-white/5 rounded-xl cursor-pointer group transition-colors">
              <span className="text-xs text-slate-500 group-hover:text-slate-300">Auto-Save</span>
              <input type="checkbox" defaultChecked className="accent-sky-500 w-4 h-4" />
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 shrink-0">
        <p className="text-[10px] text-slate-600 italic text-center font-bold">NovaCode v1.2.0</p>
      </div>
    </div>
  );
};
