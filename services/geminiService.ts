
import { GoogleGenAI, Type } from "@google/genai";
import { CodeQualityReport } from "../types";

export const analyzeCodeQuality = async (code: string, language: string): Promise<CodeQualityReport> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analise o seguinte código ${language} quanto à qualidade, performance e segurança. Retorne um objeto JSON seguindo estritamente o esquema. TODAS AS RESPOSTAS (vulnerabilidades, sugestões) DEVEM ESTAR EM PORTUGUÊS BRASILEIRO.
      Código:
      ${code}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            vulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            complexity: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
          },
          required: ["score", "vulnerabilities", "suggestions", "complexity"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Erro na Análise de IA:", error);
    return { score: 0, vulnerabilities: ["Erro na API"], suggestions: ["Verifique sua Chave API nas Configurações"], complexity: "Low" };
  }
};

export const formatCodeAI = async (code: string, language: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Reformate o seguinte código ${language} para melhor legibilidade e padrões de mercado. Retorne APENAS o código formatado, sem markdown ou explicações.
      Código:
      ${code}`,
    });
    return response.text.trim();
  } catch (error) {
    return code;
  }
};

export const simulateRemoteSSHCommand = async (command: string, context: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Aja como um Terminal Linux. Execute o comando: "${command}" em um contexto de servidor remoto: "${context}". Retorne o stdout/stderr em português se houver mensagens de erro explicativas.`,
    });
    return response.text.trim();
  } catch (error) {
    return "ssh: conexão redefinida pelo par. Verifique sua chave API.";
  }
};

export const validateSQL = async (sql: string): Promise<{ isValid: boolean; error?: string; suggestions?: string[] }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Valide este SQL: ${sql}. Responda em Português Brasileiro.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            error: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["isValid"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    return { isValid: false, error: "Falha na validação da API" };
  }
};

export const generateCommandAutocomplete = async (partial: string): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Sugira 5 comandos shell que começam com "${partial}". Retorne um array de strings JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    return [];
  }
};
