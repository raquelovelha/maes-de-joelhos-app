
import { GoogleGenAI } from "@google/genai";

// Spiritual mentor service using Gemini 3 Flash to provide encouragement to mothers.
export async function getSpiritualEncouragement(prompt: string): Promise<string> {
  try {
    // Creating a new instance right before the call as recommended for ensuring up-to-date configuration.
    // The API key is obtained directly from process.env.API_KEY.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Você é uma mentora espiritual do ministério Despertar de Débora. Responda de forma acolhedora, pastoral, feminina e encorajadora. Use passagens bíblicas se apropriado. Responda em Português do Brasil.",
        temperature: 0.8,
      },
    });
    
    // Accessing the .text property directly as per the latest SDK property definitions.
    return response.text || "Deus está ouvindo suas orações, amada Débora.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Que a paz do Senhor esteja com você hoje.";
  }
}
