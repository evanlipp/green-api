import { useEffect, useRef } from "react";
import {
  acknowledgeNotification,
  receiveNotification,
} from "../services/greenApi";
import { notificationToMessage } from "../utils/messages";

const POLLING_INTERVAL = 3000;

export function useNotifications({
  credentials,
  chatId,
  enabled,
  onMessage,
  onError,
}) {
  const isRequestInProgress = useRef(false);

  useEffect(() => {
    if (!enabled) return undefined;

    let isActive = true;

    async function poll() {
      if (isRequestInProgress.current) return;
      isRequestInProgress.current = true;

      try {
        const notification = await receiveNotification(credentials);
        if (!notification) return;

        const message = notificationToMessage(notification);
        if (message?.chatId === chatId && isActive) onMessage(message);

        await acknowledgeNotification(credentials, notification.receiptId);
      } catch (error) {
        if (isActive) onError(error.message || "Не удалось получить сообщение");
      } finally {
        isRequestInProgress.current = false;
      }
    }

    poll();
    const intervalId = window.setInterval(poll, POLLING_INTERVAL);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [chatId, credentials, enabled, onError, onMessage]);
}
