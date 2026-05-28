import React, { useState } from 'react';

const quickQuestions = [
    'Какие у вас цены?',
    'Хочу записаться',
    'Есть акции?'
];

function ChatSection({ apiUrl, onBook }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async (message) => {
        if (!message.trim()) return;

        setMessages((current) => [...current, { type: 'user', text: message }]);
        setInput('');

        if (message.toLowerCase().includes('запис')) {
            setTimeout(onBook, 700);
        }

        try {
            const response = await fetch(`${apiUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            setMessages((current) => [...current, { type: 'bot', text: data.text || data.message, suggestions: data.suggestions }]);
        } catch (error) {
            setMessages((current) => [
                ...current,
                { type: 'bot', text: 'Ассистент сейчас недоступен. Попробуйте еще раз через минуту.' }
            ]);
        }
    };

    return (
        <section className="panel chat-panel">
            <div className="section-title">
                <p className="eyebrow">Ассистент</p>
                <h2>AI-чат барбершопа</h2>
                <p>Здесь можно узнать цены, акции, свободное время и детали записи.</p>
            </div>

            <div className="chat-window">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <p>Начните с быстрого вопроса.</p>
                        <div className="quick-row">
                            {quickQuestions.map((question) => (
                                <button key={question} className="ghost-action" onClick={() => sendMessage(question)}>
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div key={`${message.type}-${index}`} className={`message ${message.type}`}>
                            <p>{message.text}</p>
                            {message.suggestions && (
                                <div className="quick-row">
                                    {message.suggestions.map((suggestion) => (
                                        <button key={suggestion} className="ghost-action" onClick={() => sendMessage(suggestion)}>
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <form
                className="chat-form"
                onSubmit={(event) => {
                    event.preventDefault();
                    sendMessage(input);
                }}
            >
                <input
                    value={input}
                    placeholder="Напишите вопрос..."
                    onChange={(event) => setInput(event.target.value)}
                />
                <button className="primary-action" disabled={!input.trim()}>
                    Отправить
                </button>
            </form>
        </section>
    );
}

export default ChatSection;
