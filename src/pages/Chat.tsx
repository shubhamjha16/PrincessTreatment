import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, RefreshCw } from 'lucide-react';
import { aiService } from '../services/AIService';
import { VoiceService } from '../services/VoiceService';
import { detectIntent, getCareSuggestion } from '../services/IntentService';
import { ChatProductCard } from '../components/ChatProductCard';
import { ProductModal } from '../components/ProductModal';
import { type Product } from '../context/ShopContext';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai' | 'product';
    timestamp: Date;
    products?: Product[]; // For product suggestion messages
    careSuggestion?: string;
}

export const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hello, Princess. How are you feeling today? 🌸", sender: 'ai', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceService, setVoiceService] = useState<VoiceService | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
            // AGENTIC COMMERCE: Detect intent from user message
            const intent = detectIntent(text);

            // Generate AI response
            const responseText = await aiService.generateChatResponse(text, { cyclePhase: 'Luteal', mood: 'Tired' });
            const aiMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, sender: 'ai', timestamp: new Date() };
            setMessages(prev => [...prev, aiMsg]);

            // If intent detected, show product suggestions after AI response
            if (intent.type !== 'none' && intent.suggestedProducts.length > 0) {
                setTimeout(() => {
                    const productMsg: Message = {
                        id: (Date.now() + 2).toString(),
                        text: '',
                        sender: 'product',
                        timestamp: new Date(),
                        products: intent.suggestedProducts,
                        careSuggestion: getCareSuggestion(intent.type)
                    };
                    setMessages(prev => [...prev, productMsg]);
                }, 800); // Slight delay for natural feel
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsTyping(false);
        }
    };

    const toggleVoice = () => {
        if (!voiceService) return;

        if (isListening) {
            // Stop listening
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
                <button className="icon-btn" onClick={() => setMessages([
                    { id: '1', text: "Hello, Princess. How are you feeling today? 🌸", sender: 'ai', timestamp: new Date() }
                ])} title="Clear Chat">
                    <RefreshCw size={20} />
                </button>
            </header>

            <div className="message-list">
                {messages.map(msg => {
                    // Product suggestion card
                    if (msg.sender === 'product' && msg.products) {
                        return (
                            <div key={msg.id} className="message-bubble received product-suggestion-bubble">
                                {msg.careSuggestion && (
                                    <p className="care-suggestion-text">{msg.careSuggestion}</p>
                                )}
                                <div className="product-cards-row">
                                    {msg.products.map(product => (
                                        <ChatProductCard
                                            key={product.id}
                                            product={product}
                                            onViewDetails={() => setSelectedProduct(product)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    // Normal text message
                    return (
                        <div key={msg.id} className={`message-bubble ${msg.sender === 'user' ? 'sent' : 'received'}`}>
                            {msg.text}
                        </div>
                    );
                })}
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

            {/* Product Modal for detailed view */}
            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
};
