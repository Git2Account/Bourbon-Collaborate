
import { GoogleGenAI } from "@google/genai";

// Function to get document suggestions from Gemini
export async function getAIDocumentSuggestion(content: string, context: string) {
  try {
    // Create instance inside the function to ensure up-to-date API key usage
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: Collaborative workspace document editing. 
User query: ${context}
Current Document Content:
${content}

Task: Act as a team member. Suggest a relevant addition, fix, or improvement for the document. 
Return your response in two parts: 
1. A brief message for the chat.
2. A small snippet of markdown text that could be added or replaced.`,
      config: {
        systemInstruction: "You are a professional yet friendly AI collaborator named Gemini Assistant.",
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the document stream right now.";
  }
}

// Function to chat with Gemini using document context
export async function chatWithGemini(userMessage: string, docContent: string) {
  try {
    // Create instance inside the function to ensure up-to-date API key usage
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user said in chat: "${userMessage}". The current document content is: "${docContent}". Respond briefly as a collaborative team member.`,
      config: {
        systemInstruction: "You are Gemini, a team member in a collaborative document editor. Be concise and helpful.",
      }
    });
    return response.text;
  } catch (error) {
    return "System: AI collaborator is temporarily unavailable.";
  }
}

// Added function for image generation using the nano banana series model (gemini-2.5-flash-image)
export async function generateAIImage(prompt: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    // The output response may contain both image and text parts; iterate to find the image part
    if (response.candidates && response.candidates[0] && response.candidates[0].content) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}
