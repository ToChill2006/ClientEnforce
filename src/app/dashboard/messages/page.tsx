"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Send, Loader2, ArrowUpRight, CheckCheck } from "lucide-react";

type Conversation = {
  onboarding_id: string;
  title: string;
  client_name: string;
  client_email: string | null;
  last_message: { body: string; sender_type: string; sender_name: string | null; created_at: string } | null;
  unread_count: number;
  my_last_read_at: string | null;
};

type Message = {
  id: string;
  sender_type: "admin" | "client";
  sender_name: string | null;
  body: string;
  created_at: string;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return `Yesterday`;
  if (diffDays < 7) return d.toLocaleDateString(undefined, { weekday: "short" });
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatMessageTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return `Yesterday ${d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function Avatar({ name, isAdmin }: { name?: string | null; isAdmin: boolean }) {
  const initials = (name || (isAdmin ? "A" : "C")).charAt(0).toUpperCase();
  return (
    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${isAdmin ? "bg-[var(--color-accent)]" : "bg-gray-400"}`}>
      {initials}
    </div>
  );
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [loadingConvs, setLoadingConvs] = React.useState(true);
  const [selected, setSelected] = React.useState<Conversation | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loadingMsgs, setLoadingMsgs] = React.useState(false);
  const [theirLastReadAt, setTheirLastReadAt] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [sendError, setSendError] = React.useState<string | null>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const selectedRef = React.useRef<Conversation | null>(null);

  React.useEffect(() => { selectedRef.current = selected; }, [selected]);

  async function loadConversations() {
    try {
      const res = await fetch("/api/messages/conversations", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      setConversations(json.conversations ?? []);
    } catch { /* silent */ }
  }

  React.useEffect(() => {
    setLoadingConvs(true);
    loadConversations().finally(() => setLoadingConvs(false));
    const t = setInterval(loadConversations, 30_000);
    return () => clearInterval(t);
  }, []);

  async function loadMessages(conv: Conversation, markRead = false) {
    const url = markRead
      ? `/api/onboardings/${conv.onboarding_id}/messages?mark_read=1`
      : `/api/onboardings/${conv.onboarding_id}/messages`;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      setMessages(json.messages ?? []);
      setTheirLastReadAt(json.their_last_read_at ?? null);
      if (markRead) {
        // Update local unread count
        setConversations((prev) =>
          prev.map((c) => c.onboarding_id === conv.onboarding_id ? { ...c, unread_count: 0 } : c)
        );
      }
    } catch { /* silent */ }
  }

  React.useEffect(() => {
    if (!selected) return;
    setLoadingMsgs(true);
    setSendError(null);
    setMessages([]);
    loadMessages(selected, true).finally(() => {
      setLoadingMsgs(false);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 80);
    });

    const t = setInterval(() => {
      if (selectedRef.current) loadMessages(selectedRef.current);
    }, 15_000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.onboarding_id]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!selected || !draft.trim() || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch(`/api/onboardings/${selected.onboarding_id}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: draft.trim() }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) { setSendError(json?.error || `Error ${res.status}`); return; }
      if (json?.message) setMessages((prev) => [...prev, json.message]);
      setDraft("");
      // Update conversation preview
      setConversations((prev) =>
        prev.map((c) =>
          c.onboarding_id === selected.onboarding_id
            ? { ...c, last_message: { body: draft.trim(), sender_type: "admin", sender_name: null, created_at: new Date().toISOString() } }
            : c
        )
      );
    } catch (e: any) {
      setSendError(e?.message || "Failed to send");
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  // Find last message I sent that the other side has read
  const theirReadTime = theirLastReadAt ? new Date(theirLastReadAt).getTime() : 0;
  const lastSeenByThemId = theirReadTime > 0
    ? [...messages].filter((m) => m.sender_type === "admin" && new Date(m.created_at).getTime() <= theirReadTime).pop()?.id ?? null
    : null;

  const totalUnread = conversations.reduce((s, c) => s + c.unread_count, 0);

  return (
    <div className="flex overflow-hidden -mx-4 -mt-5 sm:-mx-6 lg:-mx-8 lg:-mt-7" style={{ height: "calc(100vh - 3.5rem)" }}>
      {/* Left: conversation list */}
      <div className="flex w-[300px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-panel)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          <div>
            <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">Messages</h1>
            {totalUnread > 0 && (
              <p className="text-[11px] text-[var(--color-text-muted)]">{totalUnread} unread</p>
            )}
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--color-text-muted)]" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center text-xs text-[var(--color-text-muted)]">
              <MessageCircle className="mb-2 h-8 w-8 opacity-30" />
              <p className="font-medium">No conversations yet</p>
              <p className="mt-0.5">Messages from exhibitors will appear here.</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isSelected = selected?.onboarding_id === conv.onboarding_id;
              return (
                <button
                  key={conv.onboarding_id}
                  type="button"
                  onClick={() => setSelected(conv)}
                  className={`w-full border-b border-[var(--color-border)] px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "bg-[var(--color-accent-subtle)]"
                      : "hover:bg-[var(--color-bg-hover)]"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-white">
                      {(conv.client_name || "C").charAt(0).toUpperCase()}
                      {conv.unread_count > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white">
                          {conv.unread_count > 9 ? "9+" : conv.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`truncate text-xs font-semibold ${conv.unread_count > 0 ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}`}>
                          {conv.client_name}
                        </span>
                        {conv.last_message && (
                          <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">
                            {formatTime(conv.last_message.created_at)}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[10px] text-[var(--color-text-muted)]">{conv.title}</p>
                      {conv.last_message && (
                        <p className={`mt-0.5 truncate text-[11px] ${conv.unread_count > 0 ? "font-medium text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>
                          {conv.last_message.sender_type === "admin" ? "You: " : ""}
                          {conv.last_message.body}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right: chat panel */}
      {selected ? (
        <div className="flex flex-1 flex-col overflow-hidden bg-[var(--color-bg)]">
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{selected.client_name}</p>
              {selected.client_email && (
                <p className="text-xs text-[var(--color-text-muted)]">{selected.client_email}</p>
              )}
            </div>
            <button
              onClick={() => router.push(`/dashboard/onboardings/${selected.onboarding_id}`)}
              className="flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
            >
              View onboarding
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {loadingMsgs ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--color-text-muted)]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-xs text-[var(--color-text-muted)]">
                <MessageCircle className="mb-2 h-8 w-8 opacity-30" />
                <p className="font-medium">No messages yet</p>
                <p className="mt-0.5">Send a message to start the conversation.</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMine = m.sender_type === "admin";
                const isLastSeenByThem = isMine && m.id === lastSeenByThemId;
                return (
                  <div key={m.id} className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                    {!isMine && <Avatar name={m.sender_name} isAdmin={false} />}
                    <div className={`flex max-w-[65%] flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}>
                      {!isMine && m.sender_name && (
                        <span className="px-1 text-[10px] font-medium text-[var(--color-text-muted)]">{m.sender_name}</span>
                      )}
                      <div
                        className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                          isMine
                            ? "rounded-br-sm bg-[var(--color-accent)] text-white"
                            : "rounded-bl-sm bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]"
                        }`}
                      >
                        {m.body}
                      </div>
                      <span className="px-1 text-[10px] text-[var(--color-text-muted)]">{formatMessageTime(m.created_at)}</span>
                      {isLastSeenByThem && (
                        <span className="flex items-center gap-0.5 px-1 text-[10px] text-[var(--color-text-muted)]">
                          <CheckCheck className="h-3 w-3" />
                          Seen {formatMessageTime(theirLastReadAt!)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-3">
            {sendError && (
              <p className="mb-2 rounded-[var(--radius-sm)] bg-[var(--color-danger-subtle)] px-2 py-1 text-[11px] text-[var(--color-danger)]">{sendError}</p>
            )}
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                placeholder={`Message ${selected.client_name}…`}
                className="flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] overflow-hidden"
                style={{ minHeight: "40px", maxHeight: "120px" }}
              />
              <button
                onClick={send}
                disabled={!draft.trim() || sending}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-white transition-opacity disabled:opacity-40"
                aria-label="Send"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-[var(--color-text-muted)]">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-center text-sm text-[var(--color-text-muted)]">
          <div>
            <MessageCircle className="mx-auto mb-3 h-10 w-10 opacity-20" />
            <p className="font-medium">Select a conversation</p>
            <p className="mt-1 text-xs">Choose a conversation from the list to view messages.</p>
          </div>
        </div>
      )}
    </div>
  );
}
