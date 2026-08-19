"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

export function ChatPanel({ context, companyName }: { context: string; companyName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const starters = useMemo(
    () => [
      `Is ${companyName} a good investment right now?`,
      `How is ${companyName}'s revenue trend over the last decade?`,
      `What is ${companyName}'s profit margin trend?`,
      `How has ${companyName}'s stock performed vs revenue growth?`,
    ],
    [companyName],
  );

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    const nextMessages = [...messages, { role: "user", content } as Message];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, systemContext: context, companyName }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Chat request failed");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "No response generated." }]);
    } catch (err: any) {
      setError(err.message || "Unable to reach AI analyst right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-600">AI Analyst Chat</h3>
      {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {messages.length === 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {starters.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50"
              onClick={() => void sendMessage(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      <div className="mb-3 h-64 space-y-2 overflow-y-auto rounded-lg bg-slate-50 p-3">
        {messages.map((message, idx) => (
          <div key={`${message.role}-${idx}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                message.role === "user" ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-700"
              }`}
            >
              <div 
                className={`prose prose-sm max-w-none ${
                  message.role === "user" 
                    ? "prose-invert" 
                    : "prose-slate"
                }`}
              >
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-slate-500">Analyzing...</p>}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage(input);
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder={`Ask about ${companyName}'s financial performance...`}
        />
        <button
          disabled={loading}
          type="submit"
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </section>
  );
}
