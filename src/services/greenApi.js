const API_URL = "https://api.green-api.com";

function buildUrl({ idInstance, token }, method, suffix = "") {
  return `${API_URL}/waInstance${idInstance}/${method}/${token}${suffix}`;
}

async function request(credentials, method, options = {}) {
  const response = await fetch(
    buildUrl(credentials, method, options.suffix),
    options,
  );
  const responseText = await response.text();
  let body = null;

  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch {
      body = { message: responseText };
    }
  }

  if (!response.ok) {
    throw new Error(body?.message || `Ошибка API: ${response.status}`);
  }

  return body;
}

export function sendTextMessage(credentials, chatId, message) {
  return request(credentials, "sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, message }),
  });
}

export function receiveNotification(credentials) {
  return request(credentials, "receiveNotification");
}

export function acknowledgeNotification(credentials, receiptId) {
  return request(credentials, "deleteNotification", {
    method: "DELETE",
    suffix: `/${receiptId}`,
  });
}
