
import React, { useState } from 'react';
import { Snippet } from '../../types';

interface SnippetManagerProps {
  snippets: Snippet[];
  onInsert: (code: string) => void;
  onAdd: (snippet: Snippet) => void;
}

export const SnippetManager: React.FC<SnippetManagerProps> = ({ snippets, onInsert, onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSnippet, setNewSnippet] = useState<Partial<Snippet>>({
    name: '', trigger: '', code: '', category: 'Geral'
  });

  const categories = Array.from(new Set(snippets.map(s => s.category)));

  const handleSave = () => {
    if (newSnippet.name && newSnippet.code) {
      onAdd({ ...newSnippet, id: Date.now().toString() } as Snippet);
      setIsAdding(false);
      setNewSnippet({ name: '', trigger: '', code: '', category: 'Geral' });
    }
  };

  return (
    <div className="p-4 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fragmentos (Snippets)</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          title="Novo Fragmento"
          className="p-1 hover:bg-slate-800 rounded text-sky-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-3 animate-in fade-in zoom-in duration-200">
          <input 
            placeholder="Nome (ex: Botão React)" 
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs outline-none focus:border-sky-500"
            value={newSnippet.name}
            onChange={e => setNewSnippet({...newSnippet, name: e.target.value})}
          />
          <input 
            placeholder="Gatilho (ex: rbtn)" 
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs outline-none focus:border-sky-500"
            value={newSnippet.trigger}
            onChange={e => setNewSnippet({...newSnippet, trigger: e.target.value})}
          />
          <textarea 
            placeholder="Bloco de código..." 
            className="w-full h-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs outline-none focus:border-sky-500 font-mono"
            value={newSnippet.code}
            onChange={e => setNewSnippet({...newSnippet, code: e.target.value})}
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-sky-600 hover:bg-sky-500 text-white py-1 rounded text-xs font-bold">Salvar</button>
            <button onClick={() => setIsAdding(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 py-1 rounded text-xs font-bold">Cancelar</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4">
        {categories.map(cat => (
          <div key={cat} className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-600 uppercase mb-1">{cat}</h3>
            {snippets.filter(s => s.category === cat).map(s => (
              <div key={s.id} className="group p-2 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 rounded transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-300">{s.name}</span>
                  <span className="text-[9px] bg-slate-800 text-slate-500 px-1 rounded font-mono">{s.trigger}</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate mb-2">{s.description || 'Sem descrição'}</p>
                <button 
                  onClick={() => onInsert(s.code)}
                  className="w-full py-1 bg-slate-800 group-hover:bg-sky-900/40 text-[10px] text-slate-400 group-hover:text-sky-400 rounded transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  Inserir Fragmento
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
