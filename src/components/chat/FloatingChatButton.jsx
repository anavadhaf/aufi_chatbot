import { useState } from "react";

const quickActions = ["Apply Leave", "View Attendance", "Submit Claim", "HR Support"];

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {isOpen ? (
        <section
          aria-label="Aufi HR Assistant chat"
          className="w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-white/20 bg-[#07383c]/95 shadow-2xl shadow-cyan-950/60 backdrop-blur-2xl"
        >
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-white">Aufi HR Assistant</p>
              <p className="mt-1 text-xs text-cyan-100/65">Authenticated with OrangeHRM</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xl text-cyan-50 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              ×
            </button>
          </header>

          <div className="p-5">
            <div className="rounded-2xl rounded-tl-sm bg-white/10 p-4 text-sm leading-6 text-cyan-50/85">
              You are signed in. What can I help you with today?
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  className="min-h-[42px] rounded-xl border border-cyan-100/15 bg-white/[0.07] px-3 text-xs font-medium text-cyan-50 transition hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-cyan-100"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close HR assistant chat" : "Open HR assistant chat"}
        className="flex h-14 items-center gap-3 rounded-full border border-cyan-100/25 bg-cyan-50 px-5 text-sm font-semibold text-[#062529] shadow-[0_0_38px_rgba(103,232,249,0.38)] transition duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#062529]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B3A3F] text-xs text-white">
          A
        </span>
        {isOpen ? "Close Chat" : "Chat with Aufi"}
      </button>
    </div>
  );
}
