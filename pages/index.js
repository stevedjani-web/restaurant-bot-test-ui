import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const webhook = "https://lobima.app.n8n.cloud/webhook/restaurant-bot-ui";

  const sendMessage = async () => {
    if (!message) return;

    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`${webhook}?message=${encodeURIComponent(message)}`);
      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "bot", text: data.reply_text || "No response" }
      ]);
    } catch (e) {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "Erreur connexion bot" }
      ]);
    }

    setMessage("");
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>🍽️ Restaurant Bot Test</h2>

      <div style={{ border: "1px solid #ddd", padding: 10, height: 400, overflowY: "auto", background: "#f5f5f5" }}>
        {chat.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === "user" ? "right" : "left", margin: "10px 0" }}>
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 10,
                background: msg.role === "user" ? "#DCF8C6" : "#fff",
                border: "1px solid #ccc",
                whiteSpace: "pre-line"
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: 10, gap: 8 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1, padding: 10 }}
          placeholder="Tape ton message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage} style={{ padding: "10px 14px" }}>
          Envoyer
        </button>
      </div>
    </div>
  );
}
