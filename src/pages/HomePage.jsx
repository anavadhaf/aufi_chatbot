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
import { useAuthStore } from "../store/auth.store";
import { showToast } from "../utils/toast";

const quickActions = [
  { label: "Check Leave Balance", icon: CalendarCheck },
  { label: "Apply for Leave", icon: CalendarPlus },
  { label: "Employee Directory", icon: UsersRound },
  { label: "Attendance Summary", icon: Clock3 },
  { label: "Company Policies", icon: BookOpenText },
  { label: "Team Information", icon: UsersRound },
];

export function HomePage() {
  const logout = useAuthStore((state) => state.logout);
  const authToken = useAuthStore((state) => state.accessToken);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const hasStartedChat = chatHistory.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const sendMessage = async (message = inputValue) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isTyping) {
      return;
    }

    setChatHistory((history) => [
      ...history,
      { id: crypto.randomUUID(), role: "user", content: trimmedMessage },
    ]);
    setInputValue("");
    setIsTyping(true);

    try {
      const reply = await sendChatMessage({
        message: trimmedMessage,
        authToken,
        sessionId,
      });

      setChatHistory((history) => [
        ...history,
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);
    } catch (error) {
      console.error("Unable to send chat message:", error);
      showToast({
        title: "Message not sent",
        description: "AUFI could not reach the chat service. Please try again.",
        variant: "error",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleNewChat = () => {
    setSessionId(crypto.randomUUID());
    setChatHistory([]);
    setInputValue("");
    setIsTyping(false);
  };

  const handleQuickAction = (action) => {
    sendMessage(action);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(15,118,110,0.30)_0%,rgba(6,95,70,0.18)_23%,rgba(5,5,5,0)_58%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent" />

      <header className="relative z-10 flex h-20 items-center justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100/15 bg-white/[0.06] shadow-[0_0_28px_rgba(16,185,129,0.12)] backdrop-blur-xl">
            <Sparkles className="h-5 w-5 text-emerald-300" aria-hidden="true" />
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
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 text-xs font-medium text-white/70 backdrop-blur-xl transition duration-300 hover:border-emerald-200/25 hover:bg-white/[0.09] hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
            >
              <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">New chat</span>
            </button>
          )}

          <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] py-1.5 pl-2 pr-4 backdrop-blur-xl sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/15 text-xs font-semibold text-emerald-200">
              HR
            </div>
            <div className="leading-tight">
              <p className="text-xs font-medium text-white/90">HR User</p>
              <p className="text-[11px] text-emerald-200/55">Connected</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Logout"
            title="Logout"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/65 backdrop-blur-xl transition duration-300 hover:border-emerald-200/25 hover:bg-white/[0.09] hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
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
            <h1 className="font-['Host_Grotesk_Variable'] text-[24px] font-normal leading-tight tracking-normal text-white sm:text-[30px]">
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
                        ? "max-w-[85%] rounded-3xl rounded-br-md bg-emerald-300 px-5 py-3 text-sm leading-6 text-[#032b24] shadow-[0_12px_36px_rgba(16,185,129,0.12)] sm:max-w-[75%]"
                        : "max-w-[90%] text-sm leading-7 text-white/85 sm:max-w-[80%]"
                    }
                  >
                    {message.role === "assistant" && (
                      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-emerald-300/80">
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        AUFI
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start" role="status" aria-label="AUFI is typing">
                  <div className="flex items-center gap-3 text-sm text-white/55">
                    <Sparkles className="h-4 w-4 animate-pulse text-emerald-300" aria-hidden="true" />
                    <div className="flex items-center gap-1.5">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="h-2 w-2 animate-bounce rounded-full bg-emerald-200/70"
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
          onSubmit={handleSubmit}
          className={`w-full max-w-3xl ${hasStartedChat ? "mb-4 shrink-0" : "mt-8"}`}
        >
          <div className="group relative rounded-full border border-white/[0.12] bg-white/[0.065] p-1 shadow-[0_22px_75px_rgba(0,0,0,0.38),0_0_58px_rgba(6,95,70,0.11)] backdrop-blur-2xl transition duration-300 focus-within:border-emerald-200/30 focus-within:bg-white/[0.08]">
            <div className="flex h-[50px] items-center gap-2.5 pl-4">
              <Sparkles
                className="h-4 w-4 shrink-0 text-emerald-300/75 sm:h-5 sm:w-5"
                aria-hidden="true"
              />
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                disabled={isTyping}
                aria-label="Ask AUFI HR Assistant"
                placeholder="Ask about leave, attendance, employees, policies, or HR workflows..."
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35 sm:text-[15px]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send request"
                title="Send request"
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-emerald-300 text-[#032b24] shadow-[0_0_24px_rgba(110,231,183,0.20)] transition duration-300 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:ring-offset-2 focus:ring-offset-[#101512] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/25 disabled:shadow-none"
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
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-3.5 text-xs font-medium text-white/60 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200/20 hover:bg-emerald-300/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
              >
                <Icon className="h-3.5 w-3.5 text-emerald-300/70" aria-hidden="true" />
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
      `}</style>
    </main>
  );
}
