const CHAT_WEBHOOK_URL = "http://localhost:5678/webhook/hr-chat";

export async function sendChatMessage({ message, authToken, sessionId }) {
  const response = await fetch(CHAT_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      authToken,
      sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed with status ${response.status}`);
  }

  const data = await response.json();
  const output = data?.response?.output ?? data?.output;

  if (typeof output !== "string" || !output.trim()) {
    throw new Error("The chat response did not include an AI reply.");
  }

  return output;
}
