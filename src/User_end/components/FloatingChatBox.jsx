import { useState, useRef, useEffect } from 'react';
import styles from '../pages/styles/floating_chat_box.module.css';

const Icons = {
  Chat: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
};

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'support',
    text: 'Welcome to MilanSetu! How can we help you find your perfect match today?',
    time: '10:00 AM',
  },
];

export default function FloatingChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: trimmed, time },
    ]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'support',
          text: 'Thank you for reaching out! Our relationship manager will get back to you shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 800);
  };

  return (
    <div className={styles.wrapper}>
      {isOpen && (
        <div className={styles.chatWindow} role="dialog" aria-label="Support chat">
          <header className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>MS</div>
              <div>
                <h3 className={styles.headerTitle}>MilanSetu Support</h3>
                <span className={styles.headerStatus}>Online</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <Icons.Close />
            </button>
          </header>

          <div className={styles.messages}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${msg.sender === 'user' ? styles.messageRowUser : ''}`}
              >
                <div
                  className={`${styles.bubble} ${msg.sender === 'user' ? styles.bubbleUser : styles.bubbleSupport}`}
                >
                  <p>{msg.text}</p>
                  <span className={styles.time}>{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className={styles.inputArea} onSubmit={handleSend}>
            <input
              type="text"
              className={styles.input}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className={styles.sendBtn} aria-label="Send message">
              <Icons.Send />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className={`${styles.fab} ${isOpen ? styles.fabActive : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <Icons.Close /> : <Icons.Chat />}
      </button>
    </div>
  );
}
