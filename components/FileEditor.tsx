import React, { useEffect, useRef } from 'react';
import { FileNode, ThemeConfig } from '../types';
import Editor, { OnMount } from '@monaco-editor/react';

interface FileEditorProps {
  file: FileNode | null;
  updateFileContent: (id: string, content: string) => void;
  theme: ThemeConfig;
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

const FileEditor: React.FC<FileEditorProps> = ({ file, updateFileContent, theme }) => {
  const editorRef = useRef<any>(null);

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

  if (!file) return null;

  const language = detectLang(file.name, file.language);

  return (
    <div className="flex-1 flex flex-col min-h-0">
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
          onChange={(value) => updateFileContent(file.id, value || '')}
          options={{ automaticLayout: true, wordWrap: 'on', minimap: { enabled: false } }}
        />
      </div>
    </div>
  );
};

export default FileEditor;