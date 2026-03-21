import React, { useState, useEffect, useRef } from 'react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('chat_history');
        return saved ? JSON.parse(saved) : [
            { id: 1, text: "Hello! Welcome to TeleCare Helpdesk. How can I assist you today?", sender: 'bot' }
        ];
    });
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestions = [
        { label: '+ Book New', key: 'book' },
        { label: 'Join Call', key: 'video' },
        { label: 'Write Prescription', key: 'prescribe' },
        { label: 'Refill Medication', key: 'refill' }
    ];

    const responses = {
        'book': "To schedule a visit, go to the 'Appointments' tab on your Dashboard and click '+ Book New'.",
        'video': "Once it's time for your visit, you'll see a 'Join Call' button in your 'Appointments' list. Need HD support?",
        'login': "Click 'Get Started Now' on the home page or 'Login' to access your medical records.",
        'prescribe': "Doctors can use the '+ Write Prescription' button within the 'Prescriptions' tab on their dashboard.",
        'refill': "Patients can click the 'Refill' button on existing prescriptions to request more medication.",
        'department': "We have specialists in Cardiology, Neurology, Pediatrics, General Medicine, Dermatology, Orthopedics, Psychiatry, and Ophthalmology.",
        'hello': "Welcome to TeleCare! I can help you with '+ Book New', 'Join Call', or managing your 'Prescriptions'.",
        'thanks': "You're welcome! Explore your Dashboard for 'Appointments' and more."
    };

    useEffect(() => {
        localStorage.setItem('chat_history', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = (text = null) => {
        const messageText = text || inputValue;
        if (!messageText.trim()) return;

        const userMsg = { id: Date.now(), text: messageText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        if (!text) setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const botResponse = getBotResponse(messageText.toLowerCase());
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
            setIsTyping(false);
        }, 600);
    };

    const getBotResponse = (input) => {
        // Advanced matching: check for keywords first
        if (input.includes('book') || input.includes('appointment') || input.includes('schedule')) return responses.book;
        if (input.includes('video') || input.includes('call') || input.includes('join')) return responses.video;
        if (input.includes('prescription') || input.includes('prescribe')) return responses.prescribe;
        if (input.includes('refill') || input.includes('medication')) return responses.refill;
        if (input.includes('dept') || input.includes('specialist')) return responses.department;
        if (input.includes('login') || input.includes('reset')) return responses.login;
        if (input.includes('hi') || input.includes('hello')) return responses.hello;

        for (const [key, value] of Object.entries(responses)) {
            if (input.includes(key)) return value;
        }

        return "I'm not quite sure. Try clicking '+ Book New' or 'Join Call' if you have an appointment now!";
    };

    const clearChat = () => {
        const initial = [{ id: 1, text: "Chat cleared. How else can I help?", sender: 'bot' }];
        setMessages(initial);
        localStorage.removeItem('chat_history');
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, fontFamily: "'Inter', sans-serif" }}>
            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '380px',
                    height: '550px',
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: '28px',
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    marginBottom: '1rem',
                    animation: 'chatSlideUp 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className="status-dot"></div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1rem' }}>TeleCare Assistant</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Always Online</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={clearChat} title="Clear Chat" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.7 }}>🧹</button>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
                        {messages.map(msg => (
                            <div key={msg.id} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                padding: '1rem',
                                borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                background: msg.sender === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'white',
                                color: msg.sender === 'user' ? 'white' : '#1e293b',
                                fontSize: '0.92rem',
                                lineHeight: '1.5',
                                boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(37, 99, 235, 0.2)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
                                border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', background: '#e2e8f0', padding: '0.6rem 1rem', borderRadius: '15px', display: 'flex', gap: '4px' }}>
                                <div className="typing-dot"></div>
                                <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                                <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions Area */}
                    <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {suggestions.map(s => (
                            <button
                                key={s.key}
                                onClick={() => handleSend(s.key)}
                                style={{
                                    padding: '0.5rem 0.8rem',
                                    borderRadius: '99px',
                                    border: '1px solid #3b82f6',
                                    background: 'transparent',
                                    color: '#3b82f6',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.color = 'white'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3b82f6'; }}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1.25rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message..."
                                style={{
                                    flex: 1,
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '16px',
                                    padding: '0.75rem 1.25rem',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'border 0.2s',
                                    background: '#f1f5f9'
                                }}
                            />
                            <button
                                onClick={() => handleSend()}
                                style={{
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '44px',
                                    height: '44px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                                }}
                            >➤</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '24px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 15px 35px rgba(37, 99, 235, 0.4)',
                    cursor: 'pointer',
                    fontSize: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    position: 'relative'
                }}
                className="chatbot-main-btn"
            >
                {isOpen ? '✕' : '💬'}
                {!isOpen && (
                    <div className="notification-ping"></div>
                )}
            </button>

            <style>{`
                @keyframes chatSlideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .status-dot {
                    width: 10px; height: 10px; border-radius: 50%; 
                    background-color: #10b981; border: 2px solid white;
                    box-shadow: 0 0 8px #10b981;
                }
                .typing-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background-color: #64748b;
                    animation: typingBounce 1.4s infinite ease-in-out;
                }
                @keyframes typingBounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }
                .notification-ping {
                    position: absolute; top: -4px; right: -4px;
                    width: 20px; height: 20px; background-color: #ef4444;
                    border-radius: 50%; border: 4px solid white;
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                @keyframes ping {
                    75%, 100% { transform: scale(1.5); opacity: 0; }
                }
                .chatbot-main-btn:hover {
                    transform: scale(1.1) rotate(5deg);
                }
            `}</style>
        </div>
    );
};

export default ChatBot;
