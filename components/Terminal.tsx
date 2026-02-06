
import React, { useEffect, useRef } from 'react';
import { generateCommandAutocomplete } from '../services/geminiService';
import { FileNode, TerminalSession } from '../types';

interface TerminalProps {
  session: TerminalSession;
  virtualFiles: FileNode[];
  onUpdateSession: (updates: Partial<TerminalSession>) => void;
  onExecuteCommand: (cmd: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ session, virtualFiles, onUpdateSession, onExecuteCommand }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isSSH = session.id?.startsWith?.('ssh-')

  useEffect(() => {
    if (!isSSH) return
    const onData = (payload: any) => {
      if (payload.terminalId !== session.id) return
      onUpdateSession({ lines: [...session.lines, ...(payload.data || '').split(/\n/).filter(Boolean)] })
    }
    const onExit = (payload: any) => {
      if (payload.terminalId !== session.id) return
      onUpdateSession({ lines: [...session.lines, `-- SSH session closed --`] })
    }
    // @ts-ignore
    window.__electron_ssh__?.onData(onData)
    // @ts-ignore
    window.__electron_ssh__?.onExit(onExit)
    return () => {
    }
  }, [isSSH, session.id, session.lines])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [session.lines]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isSSH) {
        try {
          // @ts-ignore
          await window.__electron_ssh__?.send(session.id, session.currentInput + '\n')
          onUpdateSession({ lines: [...session.lines, `nova@${session.name}:~$ ${session.currentInput}`], currentInput: '' })
        } catch (e) { console.warn('ssh send error', e) }
      } else {
        onExecuteCommand(session.currentInput);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (session.currentInput.length > 0) {
        const aiSuggestions = await generateCommandAutocomplete(session.currentInput);
        if (aiSuggestions.length > 0) {
           onUpdateSession({ currentInput: aiSuggestions[0] });
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-slate-300 font-mono text-sm overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 fira-code whitespace-pre-wrap leading-relaxed">
        {session.lines.map((line, i) => (
          <div key={i} className={`mb-1 ${line.startsWith('nova@') ? 'text-emerald-500 font-bold' : ''}`}>
            {line}
          </div>
        ))}
        <div className="flex items-center mt-1">
          <span className="text-emerald-500 font-bold mr-2">$</span>
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-slate-200" 
            value={session.currentInput} 
            onChange={(e) => onUpdateSession({ currentInput: e.target.value })} 
            onKeyDown={handleKeyDown} 
            autoFocus 
          />
        </div>
      </div>
    </div>
  );
};
