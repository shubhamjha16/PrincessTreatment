/*
 * AIService.ts
 * Type-safe interface for Google Gemini API
 */
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from "@google/generative-ai";

// TODO: Replace with your actual Gemini API Key
const API_KEY = "GEMINI_API_KEY_HERE";

export interface UserContext {
    cyclePhase?: string;
    mood?: string;
    name?: string;
}

class AIService {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;
    private chatSession: ChatSession | null = null;
    private systemPrompt: string;

    constructor() {
        this.genAI = new GoogleGenerativeAI(API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

        this.systemPrompt = `
      You are Aura, an empathetic and warm AI companion for women alongside their menstrual cycle.
      Your tone is supportive, gentle, and understanding, like a best friend or big sister.
      
      Key responsibilities:
      1. Mood Support: Offer comfort for PMS, anxiety, or sadness.
      2. Cycle Awareness: If the user mentions their cycle phase (Follicular, Ovulatory, Luteal, Menstrual), tailor advice to that phase.
      3. Product Recommendations: Suggest relevant self-care items naturally.
      
      Keep responses concise (under 3 sentences usually) unless asked for more. 
      Use emojis sparingly but effectively.
    `;
    }

    /*
     * Starts or retrieves the chat session with history
     */
    async getChatSession(): Promise<ChatSession> {
        if (!this.chatSession) {
            this.chatSession = this.model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: this.systemPrompt }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I am Aura, your supportive companion. I'm ready to help." }],
                    }
                ],
                generationConfig: {
                    maxOutputTokens: 150,
                    temperature: 0.7,
                }
            });
        }
        return this.chatSession;
    }

    /*
     * Generates a response from Gemini based on user message and context
     */
    async generateChatResponse(message: string, context: UserContext = {}): Promise<string> {
        try {
            const session = await this.getChatSession();

            // Enrich message with context if provided
            let enrichedMessage = message;
            if (context.cyclePhase || context.mood) {
                enrichedMessage = `[Context: Phase=${context.cyclePhase || 'Unknown'}, Mood=${context.mood || 'Unknown'}] User says: ${message}`;
            }

            const result = await session.sendMessage(enrichedMessage);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "I'm having trouble connecting right now. Please check your API Key in AIService.ts.";
        }
    }

    /*
     * Suggests content topics for the Discover feed based on cycle phase
     */
    async getDiscoveryTopics(cyclePhase: string): Promise<string[]> {
        try {
            const prompt = `Give me 3 short, comma-separated topic keywords for a woman in her ${cyclePhase} phase. Examples: "Yoga, Hydration, journaling"`;
            const result = await this.model.generateContent(prompt);
            const text = result.response.text();
            return text.split(',').map(t => t.trim());
        } catch (e) {
            console.error("Discovery Error:", e);
            return ["Self care", "Relaxation", "Wellness"]; // Fallback
        }
    }
}

export const aiService = new AIService();
