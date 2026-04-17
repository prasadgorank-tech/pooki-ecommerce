"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";
import { products } from "@/lib/data";

type Message = { role: "user" | "agent"; content: string };

const QUICK_PROMPTS = [
  "Outfit for a sunset party?",
  "Best baggy fits?",
  "What's limited stock?",
];

export default function AIStylistChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", content: "Hey! I'm Pooki's AI Stylist. Tell me the vibe and I'll build your fit. 🔥" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getLocalResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    if (msg.includes("party") || msg.includes("night") || msg.includes("club"))
      return `For a night out 🔥, go with our Nylon Track Jacket (Obsidian, ₹4,599) layered over a Heavyweight Oversized Tee + Utility Cargo Pants. Unmatched agent energy. Check /drops!`;
    if (msg.includes("baggy") || msg.includes("oversized"))
      return `Top baggy picks right now 🔥: Utility Cargo Pants (₹2,999), Heavyweight Sweatpants (₹2,199), Parachute Pants Olive (₹3,199). Head to /collections/all and filter by Baggy Fit!`;
    if (msg.includes("slim") || msg.includes("clean") || msg.includes("minimal"))
      return `Clean and decisive 💯: Minimal Slim Denim Black Wash (₹3,499) + Essential Slim Tee (₹999) = timeless. Visit /collections/all → Slim filter.`;
    if (msg.includes("budget") || msg.includes("cheap") || msg.includes("afford"))
      return `Best value picks 💚: Essential Slim Tee (₹999) and Heavyweight Oversized Tee (₹1,499). Premium quality without breaking the bank.`;
    if (msg.includes("jacket") || msg.includes("outerwear") || msg.includes("winter"))
      return `Outerwear game 💪: Nylon Track Jacket Obsidian (₹4,599), Cropped Puffer Onyx (₹5,999), Coach Jacket Navy (₹3,999). All in /collections/all → Outerwear.`;
    if (msg.includes("tee") || msg.includes("t-shirt") || msg.includes("top"))
      return `Our tee lineup 👕: Heavyweight Oversized Tee in Black or White (₹1,499 each), or the Essential Slim Tee (₹999). Perfect base layers. Check /collections/all → Tees.`;
    if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey"))
      return `Hey agent 👋! Tell me the vibe — a party look, daily fit, or just need fresh drops? I'll build your outfit.`;
    return `Based on your vibe, check /collections/all and use the filters — Size, Fit, and Price. Want me to recommend something specific? Tell me the occasion! 🎯`;
  };

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const response = await fetch("/api/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, products: "" }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      // If API returns null (no key), use local fallback
      return data.reply || getLocalResponse(userMessage);
    } catch {
      return getLocalResponse(userMessage);
    }
  };


  const handleSend = async (msg?: string) => {
    const text = msg || input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    const reply = await getAIResponse(text);
    setMessages(prev => [...prev, { role: "agent", content: reply }]);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        id="ai-stylist-fab"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Stylist"
        className={`fixed bottom-6 right-6 group bg-[var(--foreground)] text-[var(--background)] p-4 shadow-2xl transition-all duration-300 hover:scale-110 z-50 flex items-center gap-2 ${
          isOpen ? "hidden" : "flex"
        }`}
      >
        <Sparkles size={20} />
        <span className="text-xs font-black uppercase tracking-widest max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          AI Stylist
        </span>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-[360px] h-[520px] bg-[var(--background)] border border-[var(--color-border)] shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 ${
        isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}>
        {/* Header */}
        <div className="bg-[var(--foreground)] text-[var(--background)] px-4 py-3 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <div>
              <p className="font-black tracking-tight uppercase text-sm">Pooki AI Stylist</p>
              <p className="text-[10px] opacity-60">Powered by Gemini</p>
            </div>
          </div>
          <button
            id="ai-stylist-close"
            onClick={() => setIsOpen(false)}
            className="hover:opacity-60 transition-opacity p-1"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "agent" && (
                <div className="w-6 h-6 bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <Sparkles size={10} className="text-white" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[var(--foreground)] text-[var(--background)] font-medium"
                  : "bg-[var(--color-secondary)] text-[var(--foreground)]"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-6 h-6 bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0 mr-2">
                <Sparkles size={10} className="text-white" />
              </div>
              <div className="bg-[var(--color-secondary)] p-3 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[var(--color-muted)]" />
                <span className="text-xs text-[var(--color-muted)]">Styling...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
            {QUICK_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="flex-shrink-0 border border-[var(--color-border)] text-[10px] font-bold uppercase tracking-widest px-3 py-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-[var(--color-border)] flex items-center gap-2 flex-shrink-0"
        >
          <input
            id="ai-stylist-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask for an outfit idea..."
            disabled={loading}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-muted)] disabled:opacity-50"
          />
          <button
            id="ai-stylist-send"
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 text-[var(--foreground)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-30"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );
}
