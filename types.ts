
export enum SidebarView {
  Explorer = 'explorer',
  Search = 'search',
  Git = 'git',
  SSH = 'ssh',
  AI = 'ai',
  SQL = 'sql',
  Snippets = 'snippets',
  Plugins = 'plugins',
  Settings = 'settings',
  Commands = 'commands'
}

export interface TerminalSession {
  id: string;
  name: string;
  lines: string[];
  currentInput: string;
}

export interface CustomCommand {
  id: string;
  name: string;
  command: string;
  category: string;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

export interface RemoteFileNode {
  name: string;
  type: 'file' | 'folder' | 'link';
  size?: string;
  modified?: string;
  permissions?: string;
}

export type SSHStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface SSHSession {
  id: string;
  name: string;
  host: string;
  user: string;
  port?: number;
  status: SSHStatus;
  error?: string;
}

export interface CodeQualityReport {
  score: number;
  vulnerabilities: string[];
  suggestions: string[];
  complexity: 'Low' | 'Medium' | 'High';
}

export interface Snippet {
  id: string;
  name: string;
  trigger: string;
  code: string;
  category: string;
  description: string;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  enabled: boolean;
  type: 'linter' | 'theme' | 'formatter' | 'tool';
}

export interface ThemeConfig {
  name: string;
  primary: string;
  bg: string;
  sidebar: string;
  accent: string;
}

export interface ChronosSnapshot {
  id: string;
  timestamp: number;
  content: string;
  description: string;
  fileId: string;
}

export interface ChronosHistory {
  fileId: string;
  snapshots: ChronosSnapshot[];
  currentIndex: number;
}
