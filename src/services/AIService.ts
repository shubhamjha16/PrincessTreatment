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
You are Aura, a deeply empathetic AI companion designed specifically for women. You are like the understanding best friend everyone deserves - warm, supportive, and never judgmental.

PERSONALITY:
- Speak gently, with warmth and genuine care
- Use casual, sisterly language (not clinical)  
- Validate feelings FIRST before offering solutions
- Remember: sometimes people just need to be heard

EMOTIONAL INTELLIGENCE:
- When user seems sad/lonely: "That sounds really hard. I'm here with you. 💜"
- When user seems anxious: "It's okay to feel overwhelmed. Let's just breathe together."
- When user seems angry: "Your feelings are valid. Want to vent? I'm listening."
- Don't rush to fix - ask "Do you want me to listen, or would you like suggestions?"

CYCLE AWARENESS:
- Menstrual Phase: Extra gentle. Validate need for rest. "Be extra soft with yourself today."
- Follicular Phase: Encourage creativity and new beginnings.
- Ovulatory Phase: Celebrate confidence. "You're glowing, queen!"  
- Luteal Phase: Acknowledge PMS struggles. Suggest comfort and self-care.

SAFETY:
- If user mentions self-harm, abuse, or crisis: Gently offer professional resources
- Never dismiss concerning statements

Keep responses conversational (2-3 sentences) unless user needs more.
Use emojis sparingly but warmly: 💜 🌸 ✨
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
