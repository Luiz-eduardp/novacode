
import React, { useState } from 'react';
import { analyzeCodeQuality } from '../../services/geminiService';
import { CodeQualityReport } from '../../types';

interface AIChatProps {
  activeCode: string;
  language: string;
}

export const AIChat: React.FC<AIChatProps> = ({ activeCode, language }) => {
  const [report, setReport] = useState<CodeQualityReport | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    const result = await analyzeCodeQuality(activeCode, language);
    setReport(result);
    setLoading(false);
  };

  const getComplexityLabel = (c: string) => {
    switch(c) {
      case 'Low': return 'Baixa';
      case 'Medium': return 'Média';
      case 'High': return 'Alta';
      default: return c;
    }
  };

  return (
    <div className="p-4 flex flex-col h-full overflow-y-auto">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Qualidade via IA</h2>
      
      {!report && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
          <div className="text-sky-500 mb-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <p className="text-sm text-slate-400 mb-4">Analise o arquivo atual para complexidade, bugs e boas práticas.</p>
          <button 
            onClick={runAnalysis}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-sm font-semibold transition-all"
          >
            Iniciar Análise
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-slate-400 animate-pulse">Escaneando padrões...</p>
        </div>
      )}

      {report && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded border border-slate-800">
            <div>
              <p className="text-xs text-slate-500">Nota Global</p>
              <p className={`text-2xl font-bold ${report.score > 80 ? 'text-emerald-500' : report.score > 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                {report.score}/100
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Complexidade</p>
              <p className="text-sm font-semibold text-slate-300">{getComplexityLabel(report.complexity)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 mb-2">Vulnerabilidades</h3>
            <div className="space-y-2">
              {report.vulnerabilities.map((v, i) => (
                <div key={i} className="flex gap-2 p-2 bg-rose-900/20 border border-rose-900/50 rounded text-xs text-rose-300">
                  <span className="shrink-0">•</span>
                  <span>{v}</span>
                </div>
              ))}
              {report.vulnerabilities.length === 0 && <p className="text-xs text-slate-500">Nenhuma vulnerabilidade encontrada.</p>}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 mb-2">Sugestões de Refatoração</h3>
            <div className="space-y-2">
              {report.suggestions.map((s, i) => (
                <div key={i} className="flex gap-2 p-2 bg-sky-900/20 border border-sky-900/50 rounded text-xs text-sky-200">
                  <span className="shrink-0">💡</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setReport(null)}
            className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 border border-slate-800 rounded transition-colors"
          >
            Limpar Análise
          </button>
        </div>
      )}
    </div>
  );
};
