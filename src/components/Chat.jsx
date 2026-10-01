import { useEffect, useRef, useState } from "react";

function MessageList({ messages }) {
  const listRef = useRef(null);
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);
  return (
    <div className="messages" ref={listRef}>
      <div className="date-label">Сегодня</div>
      {messages.length === 0 && (
        <div className="empty-chat">Напишите первое сообщение</div>
      )}
      {messages.map((message) => (
        <article className={`message ${message.direction}`} key={message.id}>
          <p>{message.text}</p>
          <time>{message.time}</time>
        </article>
      ))}
    </div>
  );
}

function MessageComposer({ disabled, onSendMessage }) {
  const [draft, setDraft] = useState("");
  function handleSubmit(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || disabled) return;
    onSendMessage(text);
    setDraft("");
  }
  return (
    <form className="composer" onSubmit={handleSubmit}>
      <input
        value={draft}
        maxLength="4000"
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Напишите сообщение…"
        aria-label="Текст сообщения"
      />
      <button
        type="submit"
        disabled={!draft.trim() || disabled}
        aria-label="Отправить сообщение"
      >
        {disabled ? "…" : "↑"}
      </button>
    </form>
  );
}

export function Chat({ chatId, messages, isSending, error, onSendMessage }) {
  if (!chatId)
    return (
      <section className="chat-panel">
        <div className="empty-state">
          <div className="empty-icon">✦</div>
          <h2>Ваш чат появится здесь</h2>
          <p>Заполните данные инстанса и номер получателя слева.</p>
        </div>
      </section>
    );
  return (
    <section className="chat-panel" aria-live="polite">
      <header className="chat-header">
        <div className="avatar">{chatId.slice(0, 1).toUpperCase()}</div>
        <div>
          <h2>{chatId}</h2>
          <p>
            <i /> На связи через MAX
          </p>
        </div>
      </header>
      <MessageList messages={messages} />
      <MessageComposer disabled={isSending} onSendMessage={onSendMessage} />
      {error && (
        <p className="status" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
