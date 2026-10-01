function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function createMessage({ id, text, direction, chatId }) {
  return {
    id: id || crypto.randomUUID(),
    text,
    direction,
    chatId,
    time: formatTime(),
  };
}
export function notificationToMessage(notification) {
  const body = notification?.body;
  const text = body?.messageData?.textMessageData?.textMessage;
  const chatId = body?.senderData?.chatId;
  if (body?.typeWebhook !== "incomingMessageReceived" || !text || !chatId)
    return null;
  return createMessage({
    id: notification.receiptId,
    text,
    chatId,
    direction: "incoming",
  });
}
