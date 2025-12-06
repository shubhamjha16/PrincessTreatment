import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, RefreshCw } from 'lucide-react';
import { aiService } from '../services/AIService';
import { VoiceService } from '../services/VoiceService';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hello, Princess. How are you feeling today? 🌸", sender: 'ai', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceService, setVoiceService] = useState<VoiceService | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setVoiceService(new VoiceService());
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Mock context - in real app would come from Dashboard/CycleService state
            const responseText = await aiService.generateChatResponse(text, { cyclePhase: 'Luteal', mood: 'Tired' });

            const aiMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, sender: 'ai', timestamp: new Date() };
            setMessages(prev => [...prev, aiMsg]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsTyping(false);
        }
    };

    const toggleVoice = () => {
        if (!voiceService) return;

        if (isListening) {
            // Stop listening logic if implemented, for now assuming it stops on end
        } else {
            setIsListening(true);
            voiceService.startListening(
                (text) => {
                    setInput(text);
                    setIsListening(false);
                    handleSend(text);
                },
                (err) => {
                    alert("Voice Error: " + err);
                    setIsListening(false);
                }
            );
        }
    };

    return (
        <div className="chat-container fade-in">
            <header className="dashboard-header">
                <div>
                    <h2 className="greeting">Chat with Aura</h2>
                    <p className="subtitle">Your empathetic AI companion</p>
                </div>
                <button className="icon-btn" onClick={() => setMessages([])} title="Clear Chat">
                    <RefreshCw size={20} />
                </button>
            </header>

            <div className="message-list">
                {messages.map(msg => (
                    <div key={msg.id} className={`message-bubble ${msg.sender === 'user' ? 'sent' : 'received'}`}>
                        {msg.text}
                    </div>
                ))}
                {isTyping && (
                    <div className="message-bubble received typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area glass-panel">
                <form className="chat-form" onSubmit={(e) => { e.preventDefault(); handleSend(input); }}>
                    <button
                        type="button"
                        className={`icon-btn mic-btn ${isListening ? 'listening' : ''}`}
                        onClick={toggleVoice}
                        style={{ marginRight: '0.5rem', width: '40px', height: '40px' }}
                    >
                        <Mic size={20} />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isTyping}
                    />
                    <button type="submit" className="send-btn" disabled={isTyping || !input.trim()}>
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};
