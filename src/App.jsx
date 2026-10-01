import { useCallback, useState } from "react";
import { Chat } from "./components/Chat";
import { ConnectionForm } from "./components/ConnectionForm";
import { useNotifications } from "./hooks/useNotifications";
import { sendTextMessage } from "./services/greenApi";
import { createMessage } from "./utils/messages";
import "./App.css";

const EMPTY_CREDENTIALS = { idInstance: "", token: "" };

export default function App() {
  const [credentials, setCredentials] = useState(EMPTY_CREDENTIALS);
  const [recipient, setRecipient] = useState("");
  const [activeChatId, setActiveChatId] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const isConnected = Boolean(
    credentials.idInstance.trim() && credentials.token.trim(),
  );

  const handleIncomingMessage = useCallback((message) => {
    setMessages((items) => {
      const hasMessage = items.some(({ id }) => id === message.id);
      return hasMessage ? items : [...items, message];
    });
  }, []);

  const handleReceiveError = useCallback((message) => {
    setError(message);
  }, []);

  useNotifications({
    credentials,
    chatId: activeChatId,
    enabled: isConnected && Boolean(activeChatId),
    onMessage: handleIncomingMessage,
    onError: handleReceiveError,
  });

  function handleOpenChat(event) {
    event.preventDefault();
    if (!isConnected) return setError("Введите idInstance и apiTokenInstance");
    const chatId = recipient.trim();
    if (!chatId) return setError("Введите номер или chatId получателя");
    setActiveChatId(chatId);
    setMessages([]);
    setError("");
  }

  async function handleSendMessage(text) {
    if (!activeChatId || isSending) return;
    setError("");
    setIsSending(true);
    try {
      const { idMessage } = await sendTextMessage(
        credentials,
        activeChatId,
        text,
      );
      setMessages((items) => [
        ...items,
        createMessage({ id: idMessage, text, direction: "outgoing" }),
      ]);
    } catch (requestError) {
      setError(requestError.message || "Не удалось отправить сообщение");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="setup-panel">
        <div className="brand">
          <span className="brand-mark">G</span>
          <span>GREEN-API</span>
        </div>
        <div className="setup-copy">
          <p className="eyebrow">MAX messenger</p>
          <h1>Сообщения без лишнего</h1>
          <p>Введите данные инстанса и начните диалог.</p>
        </div>
        <ConnectionForm
          credentials={credentials}
          recipient={recipient}
          onCredentialsChange={setCredentials}
          onRecipientChange={setRecipient}
          onSubmit={handleOpenChat}
        />
        <p className="security-note">
          Данные используются только в текущей вкладке и не сохраняются.
        </p>
      </aside>
      <Chat
        chatId={activeChatId}
        messages={messages}
        isSending={isSending}
        error={error}
        onSendMessage={handleSendMessage}
      />
    </main>
  );
}
