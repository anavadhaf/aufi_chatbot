import { ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";
import { startLogin } from "../../services/auth.service";
import { showToast } from "../../utils/toast";

export function LoginCard() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await startLogin();
    } catch (error) {
      setIsLoading(false);
      showToast({
        title: "Login Failed",
        description: error.message || "Unable to start OrangeHRM authentication.",
        variant: "error",
      });
    }
  };

  return (
    <section
      aria-labelledby="login-heading"
      className="w-full max-w-md"
    >
      <div className="login-card relative overflow-hidden rounded-[1.75rem] border border-[#E4AFFF]/15 bg-[#0f0f19]/55 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(114,14,217,0.15)] backdrop-blur-[24px] sm:p-8">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#E4AFFF]/50 to-transparent" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#E4AFFF]/10 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-[#720ED9]/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(228,175,255,0.08),transparent_42%)]" />

        <div className="relative">
          <div className="mb-10 flex items-center gap-5">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E4AFFF]/25 bg-[linear-gradient(145deg,rgba(228,175,255,0.22),rgba(114,14,217,0.16))] shadow-[0_0_34px_rgba(228,175,255,0.22),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl">
              <div className="absolute inset-[-12px] rounded-[1.5rem] bg-[#720ED9]/18 blur-2xl" />
              <span className="relative text-2xl font-semibold text-[#E4AFFF]">A</span>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-[#E4AFFF]">
                Aufi
                <Sparkles className="h-3.5 w-3.5 text-[#E4AFFF]/80" aria-hidden="true" />
              </p>
              <p className="mt-1 text-lg font-semibold text-white">HR Assistant</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 id="login-heading" className="text-[34px] font-bold leading-tight tracking-normal text-white sm:text-4xl">
              Welcome Back
            </h2>
            <p className="max-w-sm text-[15px] leading-7 text-[#f1ddff]/68">
              Sign in with your OrangeHRM account to continue to your AI workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            aria-busy={isLoading}
            className="group mt-10 flex h-[56px] min-h-[56px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-[#E4AFFF]/20 bg-[linear-gradient(135deg,#E4AFFF_0%,#B55CFF_45%,#720ED9_100%)] bg-[length:120%_120%] bg-center px-5 py-4 text-[15px] font-semibold text-white shadow-[0_14px_34px_rgba(114,14,217,0.34),0_0_24px_rgba(228,175,255,0.14),inset_0_1px_0_rgba(255,255,255,0.18)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_18px_44px_rgba(114,14,217,0.42),0_0_34px_rgba(228,175,255,0.22),inset_0_1px_0_rgba(255,255,255,0.20)] active:translate-y-0 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#E4AFFF] focus:ring-offset-2 focus:ring-offset-[#08050d] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
                Redirecting to OrangeHRM...
              </>
            ) : (
              <>
                <UserRound className="h-5 w-5 text-white/92" aria-hidden="true" />
                Login with OrangeHRM
              </>
            )}
          </button>

          <div className="mt-9 flex items-center gap-4 text-sm text-[#f1ddff]/42">
            <div className="h-px flex-1 bg-white/10" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>Secured by AUFI</span>
            </div>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </div>
      </div>

      <style>{`
        .login-card {
          animation: login-card-enter 780ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        @keyframes login-card-enter {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}
