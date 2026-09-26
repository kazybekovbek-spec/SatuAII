
"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Сәлем! Мен SatuAI көмекшісімін. Бизнесіңізге қалай көмектесе аламын? / Здравствуйте! Чем могу помочь?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text = input) {
    if (!text.trim() || loading) return;

    const next: Message[] = [
      ...messages,
      { role: "user", content: text }
    ];

    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: next })
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.reply ?? data.message ?? "Жауап алынбады."
        }
      ]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Қате пайда болды. Қайталап көріңіз."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#080d1b",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: 20
    }}>
      <div style={{
        maxWidth: 800,
        margin: "auto"
      }}>
        <h1 style={{ color: "#7294ff" }}>SatuAI ✦</h1>
        <p>Сіздің ақылды бизнес көмекшіңіз</p>

        <div style={{
          background: "#111a30",
          borderRadius: 20,
          padding: 20,
          height: "60vh",
          overflowY: "auto"
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              background: m.role === "user"
                ? "#3456ac" : "#222d47",
              padding: 14,
              borderRadius: 14,
              marginBottom: 12,
              marginLeft: m.role === "user" ? 35 : 0,
              marginRight: m.role === "assistant" ? 35 : 0,
              whiteSpace: "pre-wrap"
            }}>
              {m.content}
            </div>
          ))}
          {loading && <p>Жауап дайындалуда...</p>}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          style={{
            display: "flex",
            gap: 10,
            marginTop: 15
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Хабарлама жазыңыз..."
            style={{
              flex: 1,
              minWidth: 0,
              padding: 15,
              borderRadius: 12,
              border: "1px solid #354367",
              background: "#111a30",
              color: "white"
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 15,
              border: 0,
              borderRadius: 12,
              background: "#6585ff",
              color: "white"
            }}
          >
            Жіберу
          </button>
        </form>
      </div>
    </main>
  );
}
