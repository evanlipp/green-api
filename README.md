# GREEN-API MAX chat

Небольшой React-интерфейс для отправки и получения текстовых сообщений в MAX через GREEN-API.

## Запуск

```bash
npm install
npm run dev
```

Введите `idInstance`, `apiTokenInstance` и `chatId` (или номер в формате вашего инстанса), затем откройте чат.

## Реализовано

- `sendMessage` для отправки текста;
- опрос `receiveNotification` каждые 3 секунды;
- подтверждение уведомления через `deleteNotification`.

Код разделён по ответственности: компоненты находятся в `src/components`, запросы к API — в `src/services`, а обработка polling — в `src/hooks`.

Для входящих сообщений у инстанса нужен HTTP API: пустой `webhookUrl` и `incomingWebhook: yes`. Данные инстанса не записываются в `localStorage`.
