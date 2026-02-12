export interface FileSystemNode {
    name: string;
    path: string;
    type: 'file' | 'folder';
    size?: number;
    modified?: number;
}

const normalizePath = (p: string | undefined): string => {
    if (!p) return '';
    if (typeof p !== 'string') return '';
    return p.replace(/\\/g, '/');
};

export const fileSystemService = {
    isElectronAvailable: (): boolean => {
        return typeof window !== 'undefined' && !!(window as any).__electron__?.fs;
    },

    listDirectory: async (dirPath: string): Promise<FileSystemNode[]> => {
        try {
            if (!fileSystemService.isElectronAvailable()) {
                console.warn('Electron não disponível para listar diretório');
                return [];
            }
            if (!dirPath || typeof dirPath !== 'string') {
                console.warn('Caminho de diretório inválido:', dirPath);
                return [];
            }
            const normalizedPath = normalizePath(dirPath);
            if (!normalizedPath) {
                console.warn('Caminho normalizado está vazio');
                return [];
            }
            const files = await (window as any).__electron__?.fs?.list(normalizedPath);
            return files || [];
        } catch (error) {
            console.error('Erro ao listar diretório:', error);
            throw error;
        }
    },

    readFile: async (filePath: string): Promise<string> => {
        try {
            if (!fileSystemService.isElectronAvailable()) {
                console.warn('Electron não disponível para ler arquivo');
                return '';
            }
            const normalizedPath = normalizePath(filePath);
            const content = await (window as any).__electron__?.fs?.read(normalizedPath);
            return content || '';
        } catch (error) {
            console.error('Erro ao ler arquivo:', error);
            throw error;
        }
    },

    writeFile: async (filePath: string, content: string): Promise<boolean> => {
        try {
            if (!fileSystemService.isElectronAvailable()) {
                console.warn('Electron não disponível para escrever arquivo');
                return false;
            }
            const normalizedPath = normalizePath(filePath);
            const result = await (window as any).__electron__?.fs?.write(normalizedPath, content);
            return result?.success || false;
        } catch (error) {
            console.error('Erro ao escrever arquivo:', error);
            throw error;
        }
    },

    createFile: async (filePath: string): Promise<boolean> => {
        try {
            if (!fileSystemService.isElectronAvailable()) {
                throw new Error('Electron não disponível para criar arquivo');
            }
            if (!filePath || typeof filePath !== 'string') {
                throw new Error('Caminho de arquivo inválido');
            }
            const normalizedPath = normalizePath(filePath);
            if (!normalizedPath) {
                throw new Error('Caminho normalizado está vazio');
            }
            console.log('Criando arquivo em:', normalizedPath);
            const result = await (window as any).__electron__?.fs?.createFile(normalizedPath);
            console.log('Resultado da criação:', result);
            return result?.success || false;
        } catch (error) {
            console.error('Erro ao criar arquivo:', error);
            throw error;
        }
    },

    createFolder: async (folderPath: string): Promise<boolean> => {
        try {
            if (!fileSystemService.isElectronAvailable()) {
                throw new Error('Electron não disponível para criar pasta');
            }
            const normalizedPath = normalizePath(folderPath);
            const result = await (window as any).__electron__?.fs?.createFolder(normalizedPath);
            return result?.success || false;
        } catch (error) {
            console.error('Erro ao criar pasta:', error);
            throw error;
        }
    },

    delete: async (path: string): Promise<boolean> => {
        try {
            if (!fileSystemService.isElectronAvailable()) {
                throw new Error('Electron não disponível para deletar');
            }
            const normalizedPath = normalizePath(path);
            const result = await (window as any).__electron__?.fs?.delete(normalizedPath);
            return result?.success || false;
        } catch (error) {
            console.error('Erro ao deletar:', error);
            throw error;
        }
    },

    getHomeDirectory: async (): Promise<string> => {
        try {
            if (!fileSystemService.isElectronAvailable()) {
                throw new Error('Electron não disponível para obter home dir');
            }
            const home = await (window as any).__electron__?.fs?.getHomeDir();
            return normalizePath(home) || '';
        } catch (error) {
            console.error('Erro ao obter diretório home:', error);
            throw error;
        }
    },

    getDocumentsDirectory: async (): Promise<string> => {
        try {
            if (!fileSystemService.isElectronAvailable()) {
                throw new Error('Electron não disponível para obter docs dir');
            }
            const docs = await (window as any).__electron__?.fs?.getDocsDir();
            return normalizePath(docs) || '';
        } catch (error) {
            console.error('Erro ao obter diretório de documentos:', error);
            throw error;
        }
    }
};

declare global {
    interface Window {
        __electron__?: any;
        __electron_ssh__?: any;
        __electron_terminal__?: any;
    }
}
