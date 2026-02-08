import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FileNode, ThemeConfig } from '../types';
import Editor, { OnMount } from '@monaco-editor/react';
import { useChronos } from '../hooks/useChronos';
import { ChronosPanel } from './App/ChronosPanel';

interface FileEditorProps {
  file: FileNode | null;
  updateFileContent: (id: string, content: string) => void;
  theme: ThemeConfig;
  onSaveFile?: (id: string, content: string) => void;
  onCreateFile?: (parentId?: string) => void;
  onCreateFolder?: (parentId?: string) => void;
}

const extMap: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  java: 'java',
  html: 'html',
  htm: 'html',
  css: 'css',
  json: 'json',
  md: 'markdown',
  markdown: 'markdown',
  xml: 'xml',
  rust: 'rust',
  rs: 'rust',
  go: 'go',
  php: 'php'
};

function detectLang(name?: string, explicit?: string) {
  if (explicit) return explicit.toLowerCase();
  if (!name) return 'plaintext';
  const parts = name.split('.');
  const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  return extMap[ext] || ext || 'plaintext';
}

const FileEditor: React.FC<FileEditorProps> = ({
  file,
  updateFileContent,
  theme,
  onSaveFile,
  onCreateFile,
  onCreateFolder
}) => {
  const editorRef = useRef<any>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showChronos, setShowChronos] = useState(false);
  
  const chronos = useChronos(file?.id || '');
  const snapshots = file ? chronos.getAllSnapshots(file.id) : [];
  const currentIndex = file ? chronos.getCurrentIndex(file.id) : -1;
  const canUndo = file ? chronos.canUndo(file.id) : false;
  const canRedo = file ? chronos.canRedo(file.id) : false;

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
    try {
      editor.getModel()?.updateOptions?.({ tabSize: 2 });
    } catch (e) {
    }
  };

  useEffect(() => {
    if (!file) return;
    try {
      const model = editorRef.current?.getModel?.();
      if (model && model.getValue() !== (file.content || '')) {
        model.setValue(file.content || '');
      }
    } catch (e) {
    }
  }, [file]);

  const handleSaveFile = useCallback(() => {
    if (!file) return;
    const currentContent = editorRef.current?.getValue?.() || '';
    chronos.createSnapshot(file.id, currentContent, `Salvo em ${new Date().toLocaleTimeString()}`);
    if (onSaveFile) {
      onSaveFile(file.id, currentContent);
    }
    setUnsavedChanges(false);
  }, [file, chronos, onSaveFile]);

  const handleContentChange = useCallback((value: string | undefined) => {
    if (!file) return;
    const content = value || '';
    updateFileContent(file.id, content);
    setUnsavedChanges(true);
  }, [file, updateFileContent]);

  const handleChronosNavigate = useCallback((snapshotIndex: number) => {
    if (!file) return;
    const content = chronos.goToSnapshot(file.id, snapshotIndex);
    if (content !== null) {
      updateFileContent(file.id, content);
      setUnsavedChanges(false);
    }
  }, [file, chronos, updateFileContent]);

  const handleUndo = useCallback(() => {
    if (!file) return;
    const content = chronos.goToPrevious(file.id);
    if (content !== null) {
      updateFileContent(file.id, content);
      if (editorRef.current) {
        editorRef.current.setValue(content);
      }
    }
  }, [file, chronos, updateFileContent]);

  const handleRedo = useCallback(() => {
    if (!file) return;
    const content = chronos.goToNext(file.id);
    if (content !== null) {
      updateFileContent(file.id, content);
      if (editorRef.current) {
        editorRef.current.setValue(content);
      }
    }
  }, [file, chronos, updateFileContent]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSaveFile();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    }
    
    if (((e.ctrlKey || e.metaKey) && e.key === 'y') || 
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
      e.preventDefault();
      handleRedo();
    }
  }, [handleSaveFile, handleUndo, handleRedo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!file) return null;

  const language = detectLang(file.name, file.language);

  function handleDeleteSnapshot(snapshotId: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {file && (
        <div className="h-10 border-b border-white/5 bg-white/2 px-4 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChronos(!showChronos)}
              title="Abrir histórico de alterações (Chronos)"
              className="px-2 py-1 rounded hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Chronos ({snapshots.length})
            </button>
          </div>
          <div className="flex items-center gap-2">
            {unsavedChanges && <span className="text-amber-400">● Não salvo</span>}
            <button
              onClick={handleSaveFile}
              title="Salvar (Ctrl+S)"
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 transition-colors text-white text-xs"
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {showChronos && file && (
        <ChronosPanel
          snapshots={snapshots}
          currentIndex={currentIndex}
          theme={theme}
          onNavigate={handleChronosNavigate}
          onDelete={handleDeleteSnapshot}
        />
      )}

      <div className="flex-1 flex">
        <div className="hidden sm:flex w-14 border-r border-white/5 text-slate-700 flex-col items-center pt-6 select-none fira-code text-[11px]">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="leading-7 h-7">{i + 1}</div>
          ))}
        </div>
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            theme={theme?.name === 'light' ? 'vs' : 'vs-dark'}
            defaultLanguage={language}
            language={language}
            defaultValue={file.content || ''}
            onMount={handleMount}
            onChange={handleContentChange}
            options={{ automaticLayout: true, wordWrap: 'on', minimap: { enabled: false } }}
          />
        </div>
      </div>
    </div>
  );
};

export default FileEditor;