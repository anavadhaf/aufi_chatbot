import { useState } from "react";

const quickActions = ["Apply Leave", "View Attendance", "Submit Claim", "HR Support"];

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {isOpen ? (
        <section
          aria-label="Aufi HR Assistant chat"
          className="w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-[#E4AFFF]/20 bg-[#120020]/95 shadow-2xl shadow-[#120020]/70 backdrop-blur-2xl"
        >
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-white">Aufi HR Assistant</p>
              <p className="mt-1 text-xs text-[#E4AFFF]/65">Authenticated with OrangeHRM</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xl text-[#f7e8ff] transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#E4AFFF]"
            >
              ×
            </button>
          </header>

          <div className="p-5">
            <div className="rounded-2xl rounded-tl-sm bg-white/10 p-4 text-sm leading-6 text-[#f7e8ff]/85">
              You are signed in. What can I help you with today?
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  className="min-h-[42px] rounded-xl border border-[#E4AFFF]/15 bg-white/[0.07] px-3 text-xs font-medium text-[#f7e8ff] transition hover:border-[#E4AFFF]/25 hover:bg-[#720ED9]/15 focus:outline-none focus:ring-2 focus:ring-[#E4AFFF]"
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
        className="flex h-14 items-center gap-3 rounded-full border border-[#E4AFFF]/30 bg-[linear-gradient(135deg,#E4AFFF_0%,#720ED9_100%)] px-5 text-sm font-semibold text-white shadow-[0_0_38px_rgba(114,14,217,0.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_46px_rgba(228,175,255,0.30)] focus:outline-none focus:ring-2 focus:ring-[#E4AFFF] focus:ring-offset-2 focus:ring-offset-[#120020]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#120020]/80 text-xs text-white">
          A
        </span>
        {isOpen ? "Close Chat" : "Chat with Aufi"}
      </button>
    </div>
  );
}
