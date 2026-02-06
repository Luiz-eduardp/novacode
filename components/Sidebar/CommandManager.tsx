
import React, { useState } from 'react';
import { CustomCommand } from '../../types';

interface CommandManagerProps {
  commands: CustomCommand[];
  onExecute: (cmd: string) => void;
  onAdd: (cmd: CustomCommand) => void;
  onDelete: (id: string) => void;
}

export const CommandManager: React.FC<CommandManagerProps> = ({ commands, onExecute, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCmd, setNewCmd] = useState<Partial<CustomCommand>>({ name: '', command: '', category: 'Desenvolvimento' });

  const categories = Array.from(new Set(commands.map(c => c.category)));

  const handleSave = () => {
    if (newCmd.name && newCmd.command) {
      onAdd({ ...newCmd, id: Date.now().toString() } as CustomCommand);
      setIsAdding(false);
      setNewCmd({ name: '', command: '', category: 'Desenvolvimento' });
    }
  };

  return (
    <div className="p-5 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Meus Comandos</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-sky-500/20 hover:text-sky-400 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3 animate-in fade-in zoom-in duration-200">
          <input 
            placeholder="Nome amigável" 
            className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-xs outline-none focus:border-sky-500/50"
            value={newCmd.name}
            onChange={e => setNewCmd({...newCmd, name: e.target.value})}
          />
          <input 
            placeholder="Comando (ex: npm run dev)" 
            className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-xs outline-none focus:border-sky-500/50 font-mono"
            value={newCmd.command}
            onChange={e => setNewCmd({...newCmd, command: e.target.value})}
          />
          <input 
            placeholder="Categoria" 
            className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-xs outline-none focus:border-sky-500/50"
            value={newCmd.category}
            onChange={e => setNewCmd({...newCmd, category: e.target.value})}
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-sky-600 hover:bg-sky-500 text-white py-2 rounded-xl text-xs font-bold">Adicionar</button>
            <button onClick={() => setIsAdding(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 py-2 rounded-xl text-xs font-bold">Voltar</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 no-scrollbar">
        {categories.length === 0 && !isAdding && (
          <div className="text-center py-10 opacity-30">
            <p className="text-xs text-slate-500">Nenhum comando salvo.</p>
          </div>
        )}
        
        {categories.map(cat => (
          <div key={cat} className="space-y-3">
            <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">{cat}</h3>
            <div className="space-y-2">
              {commands.filter(c => c.category === cat).map(c => (
                <div key={c.id} className="group p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-sky-400 transition-colors">{c.name}</span>
                    <button 
                      onClick={() => onDelete(c.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <code className="block text-[10px] text-slate-500 bg-black/20 p-2 rounded-lg font-mono mb-3 truncate">{c.command}</code>
                  <button 
                    onClick={() => onExecute(c.command)}
                    className="w-full py-1.5 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                    Executar Comando
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
