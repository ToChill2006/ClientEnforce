"use client";

import * as React from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

export type ChatMessage = {
  id: string;
  sender_type: "admin" | "client";
  sender_name?: string | null;
  body: string;
  created_at: string;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) {
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) {
    return `Yesterday ${d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
  }
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function Avatar({ name, isAdmin }: { name?: string | null; isAdmin: boolean }) {
  const initials = (name || (isAdmin ? "A" : "C")).charAt(0).toUpperCase();
  return (
    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${isAdmin ? "bg-[var(--color-accent)]" : "bg-gray-400"}`}>
      {initials}
    </div>
  );
}

export function ChatBubble({
  messagesUrl,
  postUrl,
  currentSide,
  accentColor,
  title = "Messages",
  placeholder = "Type a message…",
}: {
  messagesUrl: string;
  postUrl: string;
  currentSide: "admin" | "client";
  accentColor?: string;
  title?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [unread, setUnread] = React.useState(0);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const accent = accentColor || "var(--color-accent)";

  async function fetchMessages(markRead = false) {
    try {
      const res = await fetch(messagesUrl, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      const msgs: ChatMessage[] = json.messages ?? [];
      setMessages(msgs);
      if (!markRead) {
        // count messages from the other side that arrived since last open
        setUnread((prev) => {
          const newOther = msgs.filter((m) => m.sender_type !== currentSide).length;
          return open ? 0 : newOther > prev ? newOther - prev : 0;
        });
      } else {
        setUnread(0);
      }
    } catch {
      // ignore
    }
  }

  React.useEffect(() => {
    setLoading(true);
    fetchMessages().finally(() => setLoading(false));
    const t = setInterval(() => fetchMessages(open), 15_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesUrl]);

  React.useEffect(() => {
    if (open) {
      setUnread(0);
      fetchMessages(true);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 80);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json.message) {
        setMessages((prev) => [...prev, json.message]);
      }
      setDraft("");
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open messages"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: accent, color: "#fff" }}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {unread > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex w-[340px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-2xl"
          style={{ height: "480px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 text-white" style={{ backgroundColor: accent }}>
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-sm font-semibold">{title}</span>
            <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100 transition-opacity">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--color-text-muted)]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-xs text-[var(--color-text-muted)]">
                <MessageCircle className="mb-2 h-8 w-8 opacity-30" />
                <p className="font-medium">No messages yet</p>
                <p className="mt-0.5">Send a message to get the conversation started.</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMine = m.sender_type === currentSide;
                return (
                  <div key={m.id} className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                    {!isMine && <Avatar name={m.sender_name} isAdmin={m.sender_type === "admin"} />}
                    <div className={`flex max-w-[75%] flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}>
                      {!isMine && m.sender_name && (
                        <span className="px-1 text-[10px] font-medium text-[var(--color-text-muted)]">{m.sender_name}</span>
                      )}
                      <div
                        className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${isMine ? "rounded-br-sm text-white" : "rounded-bl-sm bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]"}`}
                        style={isMine ? { backgroundColor: accent } : undefined}
                      >
                        {m.body}
                      </div>
                      <span className="px-1 text-[10px] text-[var(--color-text-muted)]">{formatTime(m.created_at)}</span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[var(--color-border)] px-3 py-2.5">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm leading-normal text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] overflow-hidden"
                style={{ minHeight: "38px", maxHeight: "96px" }}
              />
              <button
                onClick={send}
                disabled={!draft.trim() || sending}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
                style={{ backgroundColor: accent }}
                aria-label="Send"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      )}
    </>
  );
}
