import {
  ArrowUp,
  BookOpenText,
  CalendarCheck,
  CalendarPlus,
  Clock3,
  LogOut,
  MessageSquarePlus,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../services/chat.service";
import { ensureValidAccessToken, SessionExpiredError } from "../services/session.service";
import { useAuthStore } from "../store/auth.store";
import { showToast } from "../utils/toast";

const STREAM_CHUNK_DELAY_MS = 28;

const quickActions = [
  { label: "Check Leave Balance", icon: CalendarCheck },
  { label: "Apply for Leave", icon: CalendarPlus },
  { label: "Employee Directory", icon: UsersRound },
  { label: "Attendance Summary", icon: Clock3 },
  { label: "Company Policies", icon: BookOpenText },
  { label: "Team Information", icon: UsersRound },
];

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function splitIntoStreamChunks(text) {
  return text.match(/\S+\s*/g) ?? [text];
}

function renderInlineMarkdown(text, keyPrefix) {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const nodes = [];
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const value = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    if (value.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${index}`} className="font-semibold text-white/95">
          {value.slice(2, -2)}
        </strong>,
      );
    } else if (value.startsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-code-${index}`}
          className="rounded-md border border-white/10 bg-white/[0.08] px-1.5 py-0.5 text-[0.92em] text-[#E4AFFF]"
        >
          {value.slice(1, -1)}
        </code>,
      );
    } else {
      const [, label, href] = value.match(/\[([^\]]+)\]\(([^)]+)\)/) ?? [];
      nodes.push(
        <a
          key={`${keyPrefix}-link-${index}`}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[#E4AFFF] underline decoration-[#E4AFFF]/35 underline-offset-4 transition hover:text-white"
        >
          {label}
        </a>,
      );
    }

    lastIndex = index + value.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function MarkdownMessage({ content }) {
  const lines = content.split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      index += 1;
      continue;
    }

    if (trimmedLine.startsWith("```")) {
      const codeLines = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push(
        <pre
          key={`code-${index}`}
          className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-[13px] leading-relaxed text-[#f7e8ff]"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      index += 1;
      continue;
    }

    const heading = trimmedLine.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const HeadingTag = `h${heading[1].length + 2}`;
      blocks.push(
        <HeadingTag
          key={`heading-${index}`}
          className="mb-2 mt-4 text-[15px] font-semibold leading-snug text-white first:mt-0"
        >
          {renderInlineMarkdown(heading[2], `heading-${index}`)}
        </HeadingTag>,
      );
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(trimmedLine)) {
      const items = [];

      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }

      blocks.push(
        <ul key={`ul-${index}`} className="my-3 list-disc space-y-1.5 pl-5">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>
              {renderInlineMarkdown(item, `ul-${index}-${itemIndex}`)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmedLine)) {
      const items = [];

      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }

      blocks.push(
        <ol key={`ol-${index}`} className="my-3 list-decimal space-y-1.5 pl-5">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>
              {renderInlineMarkdown(item, `ol-${index}-${itemIndex}`)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraphLines = [];

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("```") &&
      !/^(#{1,3})\s+/.test(lines[index].trim()) &&
      !/^[-*]\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <p key={`p-${index}`} className="my-2 whitespace-pre-wrap first:mt-0 last:mb-0">
        {renderInlineMarkdown(paragraphLines.join(" "), `p-${index}`)}
      </p>,
    );
  }

  return <div className="assistant-markdown">{blocks}</div>;
}

export function HomePage() {
  const logout = useAuthStore((state) => state.logout);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [pendingReplies, setPendingReplies] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const keepInputFocusedRef = useRef(false);
  const mountedRef = useRef(true);

  const hasStartedChat = chatHistory.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, pendingReplies]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (keepInputFocusedRef.current) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [chatHistory, pendingReplies]);

  const focusInputSoon = () => {
    if (!keepInputFocusedRef.current) {
      return;
    }

    window.requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
  };

  const streamAssistantReply = async (messageId, reply) => {
    const chunks = splitIntoStreamChunks(reply);

    for (const chunk of chunks) {
      if (!mountedRef.current) {
        return;
      }

      setChatHistory((history) =>
        history.map((message) =>
          message.id === messageId
            ? { ...message, content: `${message.content}${chunk}` }
            : message,
        ),
      );
      focusInputSoon();
      await wait(STREAM_CHUNK_DELAY_MS);
    }

    if (!mountedRef.current) {
      return;
    }

    setChatHistory((history) =>
      history.map((message) =>
        message.id === messageId ? { ...message, isStreaming: false } : message,
      ),
    );
    focusInputSoon();
  };

  const sendMessage = async (message = inputValue) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    keepInputFocusedRef.current = true;
    setChatHistory((history) => [
      ...history,
      { id: crypto.randomUUID(), role: "user", content: trimmedMessage },
    ]);
    setInputValue("");
    setPendingReplies((count) => count + 1);
    focusInputSoon();

    try {
      const authToken = await ensureValidAccessToken();
      const reply = await sendChatMessage({
        message: trimmedMessage,
        authToken,
        sessionId,
      });
      const assistantMessageId = crypto.randomUUID();

      setChatHistory((history) => [
        ...history,
        { id: assistantMessageId, role: "assistant", content: "", isStreaming: true },
      ]);
      setPendingReplies((count) => Math.max(0, count - 1));
      await streamAssistantReply(assistantMessageId, reply);
    } catch (error) {
      console.error("Unable to send chat message:", error);
      if (error instanceof SessionExpiredError) {
        setPendingReplies((count) => Math.max(0, count - 1));
        return;
      }

      showToast({
        title: "Message not sent",
        description: "AUFI could not reach the chat service. Please try again.",
        variant: "error",
      });
      setPendingReplies((count) => Math.max(0, count - 1));
      focusInputSoon();
    }
  };

  const handlePagePointerDown = (event) => {
    if (!formRef.current?.contains(event.target)) {
      keepInputFocusedRef.current = false;
    }
  };

  const handleInputBlur = (event) => {
    if (!formRef.current?.contains(event.relatedTarget)) {
      keepInputFocusedRef.current = false;
      return;
    }

    focusInputSoon();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleNewChat = () => {
    keepInputFocusedRef.current = true;
    setSessionId(crypto.randomUUID());
    setChatHistory([]);
    setInputValue("");
    setPendingReplies(0);
    focusInputSoon();
  };

  const handleQuickAction = (action) => {
    keepInputFocusedRef.current = true;
    sendMessage(action);
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#050505] font-sans text-white"
      onPointerDownCapture={handlePagePointerDown}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(228,175,255,0.24)_0%,rgba(114,14,217,0.18)_23%,rgba(5,5,5,0)_58%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E4AFFF]/30 to-transparent" />

      <header className="relative z-10 flex h-20 items-center justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E4AFFF]/15 bg-white/[0.06] shadow-[0_0_28px_rgba(228,175,255,0.14)] backdrop-blur-xl">
            <Sparkles className="h-5 w-5 text-[#E4AFFF]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-normal text-white">AUFI HR Assistant</p>
            <p className="text-xs text-white/45">OrangeHRM workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {hasStartedChat && (
            <button
              type="button"
              onClick={handleNewChat}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 text-xs font-medium text-white/70 backdrop-blur-xl transition duration-300 hover:border-[#E4AFFF]/25 hover:bg-white/[0.09] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#E4AFFF]/70"
            >
              <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">New chat</span>
            </button>
          )}

          <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] py-1.5 pl-2 pr-4 backdrop-blur-xl sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#720ED9]/20 text-xs font-semibold text-[#E4AFFF]">
              HR
            </div>
            <div className="leading-tight">
              <p className="text-xs font-medium text-white/90">HR User</p>
              <p className="text-[11px] text-[#E4AFFF]/55">Connected</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Logout"
            title="Logout"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/65 backdrop-blur-xl transition duration-300 hover:border-[#E4AFFF]/25 hover:bg-white/[0.09] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#E4AFFF]/70"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      <section
        className={`relative z-10 mx-auto flex h-[calc(100vh-5rem)] w-full max-w-6xl flex-col items-center px-5 sm:px-8 ${
          hasStartedChat ? "justify-between pb-8 pt-4" : "justify-center pb-20 pt-6"
        }`}
      >
        {!hasStartedChat && (
          <div className="flex w-full max-w-3xl justify-center text-center">
            <h1 className="text-[24px] font-semibold leading-tight tracking-normal text-white sm:text-[30px]">
              Hi! Need help with your HR tasks?
            </h1>
          </div>
        )}

        {hasStartedChat && (
          <div
            className="scrollbar-hidden w-full max-w-3xl flex-1 overflow-y-auto pb-8 pr-1"
            aria-live="polite"
          >
            <div className="space-y-6 py-4">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={
                      message.role === "user"
                        ? "max-w-[85%] rounded-3xl rounded-br-md bg-[linear-gradient(135deg,#E4AFFF_0%,#720ED9_100%)] px-5 py-3 text-[15px] font-medium leading-6 text-white shadow-[0_12px_36px_rgba(114,14,217,0.20)] sm:max-w-[75%]"
                        : "max-w-[90%] text-[15px] font-normal leading-[1.6] text-white/85 sm:max-w-[80%]"
                    }
                  >
                    {message.role === "assistant" && (
                      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#E4AFFF]/85">
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        AUFI
                      </div>
                    )}
                    {message.role === "assistant" ? (
                      <div>
                        <MarkdownMessage content={message.content} />
                        {message.isStreaming && (
                          <span className="streaming-cursor ml-0.5 inline-block h-4 w-1 translate-y-0.5 rounded-full bg-[#E4AFFF]" />
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {pendingReplies > 0 && (
                <div className="flex justify-start" role="status" aria-label="AUFI is typing">
                  <div className="flex items-center gap-3 text-sm text-white/55">
                    <Sparkles className="h-4 w-4 animate-pulse text-[#E4AFFF]" aria-hidden="true" />
                    <div className="flex items-center gap-1.5">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="h-2 w-2 animate-bounce rounded-full bg-[#E4AFFF]/70"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`w-full max-w-3xl ${hasStartedChat ? "mb-4 shrink-0" : "mt-8"}`}
        >
          <div className="group relative rounded-full border border-[#E4AFFF]/20 bg-white/[0.06] p-1 shadow-[0_18px_60px_rgba(0,0,0,0.34),0_0_30px_rgba(114,14,217,0.15)] backdrop-blur-2xl transition duration-300 hover:border-[#E4AFFF]/28 hover:bg-white/[0.075] focus-within:border-[#E4AFFF]/35 focus-within:bg-white/[0.085] focus-within:shadow-[0_18px_64px_rgba(0,0,0,0.36),0_0_52px_rgba(114,14,217,0.18),0_0_0_1px_rgba(228,175,255,0.15)]">
            <div className="flex h-[46px] items-center gap-2.5 pl-4">
              <Sparkles
                className="h-4 w-4 shrink-0 text-[#E4AFFF]/75 sm:h-5 sm:w-5"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onFocus={() => {
                  keepInputFocusedRef.current = true;
                }}
                onBlur={handleInputBlur}
                aria-label="Ask AUFI HR Assistant"
                placeholder="Ask about leave, attendance, employees, policies, or HR workflows..."
                className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-normal leading-6 text-white outline-none placeholder:text-[15px] placeholder:font-normal placeholder:text-white/35 sm:text-[16px] sm:placeholder:text-[16px]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                aria-label="Send request"
                title="Send request"
                className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#E4AFFF_0%,#720ED9_100%)] text-white shadow-[0_0_24px_rgba(114,14,217,0.24)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(228,175,255,0.28)] focus:outline-none focus:ring-2 focus:ring-[#E4AFFF] focus:ring-offset-2 focus:ring-offset-[#120020] disabled:cursor-not-allowed disabled:bg-white/10 disabled:bg-none disabled:text-white/25 disabled:shadow-none disabled:hover:translate-y-0"
              >
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </form>

        {!hasStartedChat && (
          <div className="mt-4 flex w-full max-w-3xl flex-wrap justify-center gap-2">
            {quickActions.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleQuickAction(label)}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-3.5 text-xs font-medium text-white/60 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#E4AFFF]/25 hover:bg-[#720ED9]/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#E4AFFF]/60"
              >
                <Icon className="h-3.5 w-3.5 text-[#E4AFFF]/75" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }

        .assistant-markdown > * + * {
          margin-top: 0.72rem;
        }

        .streaming-cursor {
          animation: cursor-blink 1s steps(2, start) infinite;
        }

        @keyframes cursor-blink {
          0%, 45% {
            opacity: 1;
          }

          46%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}
