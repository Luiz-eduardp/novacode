
import React, { useState } from 'react';
import { validateSQL } from '../../services/geminiService';

export const SQLValidator: React.FC = () => {
  const [sql, setSql] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleValidate = async () => {
    setLoading(true);
    const res = await validateSQL(sql);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="p-4 flex flex-col h-full gap-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Auditor SQL</h2>
      <textarea
        className="w-full h-40 bg-slate-900 border border-slate-700 rounded p-3 text-sm font-mono text-slate-300 focus:ring-1 focus:ring-sky-500 outline-none"
        placeholder="Cole seu SQL aqui para validar..."
        value={sql}
        onChange={(e) => setSql(e.target.value)}
      />
      <button
        onClick={handleValidate}
        disabled={loading || !sql}
        className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white font-semibold py-2 rounded text-sm transition-colors"
      >
        {loading ? 'Analisando...' : 'Validar Consulta'}
      </button>

      {result && (
        <div className={`p-4 rounded border ${result.isValid ? 'bg-emerald-900/20 border-emerald-800' : 'bg-rose-900/20 border-rose-800'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-3 h-3 rounded-full ${result.isValid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span className="font-semibold text-sm">{result.isValid ? 'Consulta Válida' : 'Erro de Validação'}</span>
          </div>
          {result.error && <p className="text-xs text-rose-300 mb-3">{result.error}</p>}
          {result.suggestions && result.suggestions.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">Sugestões:</p>
              <ul className="text-xs list-disc list-inside space-y-1 text-slate-300">
                {result.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
