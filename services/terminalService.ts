/**
 * Terminal Service - Executa comandos reais no sistema
 */

export interface CommandResult {
  success: boolean;
  output: string;
  isCleared?: boolean;
}

/**
 * Remove códigos ANSI/escape sequences da saída
 */
export const stripAnsiCodes = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/\x1B\[\?[0-9;]*[a-zA-Z]/g, '') 
    .replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '') 
    .replace(/\x1B\([B0]/g, '') 
    .replace(/\x1B\[H/g, '') 
    .replace(/\x1B\[2J/g, '') 
    .replace(/\[\?[0-9;]*[a-zA-Z]/g, '') 
    .replace(/\(B\[m/g, '') 
    .replace(/\[m/g, '') 
    .trim();
};

export const executeTerminalCommand = async (command: string, cwd?: string): Promise<CommandResult> => {
  try {
    // @ts-ignore
    const result = await window.__electron_terminal__?.execute(command, cwd || '~');
    if (!result) return { success: false, output: 'Erro: API de terminal não disponível', isCleared: false };
    
    return {
      ...result,
      output: stripAnsiCodes(result.output)
    };
  } catch (error) {
    return {
      success: false,
      output: error instanceof Error ? error.message : String(error),
      isCleared: false
    };
  }
};

export const executeTerminalCommandStream = async (command: string, cwd?: string): Promise<CommandResult> => {
  try {
    // @ts-ignore
    const result = await window.__electron_terminal__?.executeStream(command, cwd || '~');
    if (!result) return { success: false, output: 'Erro: API de terminal não disponível', isCleared: false };
    
    return {
      ...result,
      output: stripAnsiCodes(result.output)
    };
  } catch (error) {
    return {
      success: false,
      output: error instanceof Error ? error.message : String(error),
      isCleared: false
    };
  }
};

/**
 * Executa um comando e retorna apenas a saída (sem o objeto de resultado)
 */
export const runCommand = async (command: string, cwd?: string): Promise<string> => {
  const result = await executeTerminalCommand(command, cwd);
  return result.output;
};
