
import { FileNode, Snippet, Plugin, ThemeConfig, SSHSession, RemoteFileNode, CustomCommand } from './types';

export const INITIAL_FILES: FileNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: '1-1',
        name: 'main.py',
        type: 'file',
        language: 'python',
        content: `def ola_mundo():\n    print("Olá NovaCode!")\n\nif __name__ == "__main__":\n    ola_mundo()`
      },
      {
        id: '1-2',
        name: 'utils.js',
        type: 'file',
        language: 'javascript',
        content: `export const formatarData = (date) => {\n  return new Date(date).toLocaleDateString('pt-BR');\n};`
      }
    ]
  },
  {
    id: '2',
    name: 'consultas.sql',
    type: 'file',
    language: 'sql',
    content: `SELECT * FROM usuarios WHERE ativo = true ORDER BY criado_em DESC;`
  },
  {
    id: '3',
    name: 'package.json',
    type: 'file',
    language: 'json',
    content: `{\n  "name": "novacode-editor",\n  "version": "1.0.0",\n  "dependencies": {}\n}`
  }
];

export const INITIAL_SSH_SESSIONS: SSHSession[] = [];

export const MOCK_REMOTE_FILES: RemoteFileNode[] = [
  { name: 'bin', type: 'folder', permissions: 'drwxr-xr-x' },
  { name: 'etc', type: 'folder', permissions: 'drwxr-xr-x' },
  { name: 'home', type: 'folder', permissions: 'drwxr-xr-x' },
  { name: 'var', type: 'folder', permissions: 'drwxr-xr-x' },
  { name: 'config.yaml', type: 'file', size: '1.2 KB', modified: '2023-10-15', permissions: '-rw-r--r--' },
  { name: 'docker-compose.yml', type: 'file', size: '4.5 KB', modified: '2023-11-01', permissions: '-rw-r--r--' },
  { name: 'iniciar.sh', type: 'file', size: '200 B', modified: '2023-09-20', permissions: '-rwxr-xr-x' }
];

export const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: 's1',
    name: 'React Function Component',
    trigger: 'rfc',
    category: 'React',
    description: 'Cria um componente funcional básico',
    code: `import React from 'react';\n\nexport const \${1:NomeDoComponente} = () => {\n  return (\n    <div>\${1:NomeDoComponente}</div>\n  );\n};`
  },
  {
    id: 's2',
    name: 'Try-Except Python',
    trigger: 'try',
    category: 'Python',
    description: 'Bloco básico de tratamento de erro',
    code: `try:\n    \${1:pass}\nexcept Exception as e:\n    print(f"Erro: {e}")`
  }
];

export const INITIAL_PLUGINS: Plugin[] = [
  {
    id: 'p1',
    name: 'Linter Prettier',
    version: '1.2.0',
    author: 'Equipe NovaCode',
    description: 'Formatação avançada de código e linting para JS/TS.',
    enabled: true,
    type: 'linter'
  },
  {
    id: 'p2',
    name: 'SQL Syntax Pro',
    version: '0.8.5',
    author: 'DataExpert',
    description: 'Realce de sintaxe SQL aprimorado e suporte a dialetos.',
    enabled: false,
    type: 'tool'
  }
];

export const THEMES: ThemeConfig[] = [
  { name: 'Meia-Noite Profunda', primary: '#38bdf8', bg: '#0f172a', sidebar: '#1e293b', accent: '#0369a1' },
  { name: 'Floresta de Ardósia', primary: '#10b981', bg: '#061a15', sidebar: '#0a2620', accent: '#065f46' },
  { name: 'Roxo Real', primary: '#a855f7', bg: '#1a1033', sidebar: '#26184d', accent: '#6b21a8' }
];

export const INITIAL_CUSTOM_COMMANDS: CustomCommand[] = [
  { id: 'c1', name: 'Start Dev', command: 'npm run dev', category: 'Node.js' },
  { id: 'c2', name: 'Build Project', command: 'npm run build', category: 'Node.js' },
  { id: 'c3', name: 'Docker Up', command: 'docker compose up -d', category: 'Docker' },
  { id: 'c4', name: 'Git Status', command: 'git status', category: 'Git' }
];
