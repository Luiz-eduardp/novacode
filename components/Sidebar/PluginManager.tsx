
import React from 'react';
import { Plugin } from '../../types';

interface PluginManagerProps {
  plugins: Plugin[];
  onToggle: (id: string) => void;
}

export const PluginManager: React.FC<PluginManagerProps> = ({ plugins, onToggle }) => {
  return (
    <div className="p-4 flex flex-col h-full overflow-hidden">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Extensões / Plugins</h2>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {plugins.map(plugin => (
          <div key={plugin.id} className={`p-3 rounded-lg border transition-all ${plugin.enabled ? 'bg-sky-900/10 border-sky-800/30' : 'bg-slate-900 border-slate-800 opacity-60'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-bold ${plugin.enabled ? 'text-sky-400' : 'text-slate-400'}`}>{plugin.name}</span>
              <span className="text-[9px] text-slate-600 font-mono">v{plugin.version}</span>
            </div>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">{plugin.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-600 italic">por {plugin.author}</span>
              <button 
                onClick={() => onToggle(plugin.id)}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${
                  plugin.enabled ? 'bg-rose-900/30 text-rose-400 hover:bg-rose-900/50' : 'bg-sky-600 text-white hover:bg-sky-500'
                }`}
              >
                {plugin.enabled ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 border border-slate-800 border-dashed rounded-lg text-center">
          <p className="text-xs text-slate-500 mb-2">Quer criar o seu próprio?</p>
          <button className="text-[10px] font-bold text-sky-500 hover:underline flex items-center justify-center gap-1 w-full">
            Ver Documentação do SDK
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
