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
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/[0.09] p-7 shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl sm:p-8">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-200/15 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-emerald-200/10 blur-3xl" />

        <div className="relative">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-100/25 bg-white/[0.12] shadow-[0_0_34px_rgba(103,232,249,0.25)] backdrop-blur-xl">
              <span className="text-xl font-semibold text-cyan-50">A</span>
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-100/70">
                Aufi
              </p>
              <p className="text-base font-semibold text-white">HR Assistant</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 id="login-heading" className="text-3xl font-semibold tracking-normal text-white">
              Welcome Back
            </h2>
            <p className="max-w-sm text-sm leading-6 text-cyan-50/70">
              Sign in with your OrangeHRM account to continue.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            aria-busy={isLoading}
            className="mt-9 flex h-[52px] min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl border border-cyan-100/25 bg-cyan-50 px-5 py-4 text-sm font-semibold text-[#062529] shadow-[0_0_34px_rgba(103,232,249,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_0_46px_rgba(103,232,249,0.42)] focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#062529] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[#062529]/25 border-t-[#062529]"
                  aria-hidden="true"
                />
                Redirecting to OrangeHRM...
              </>
            ) : (
              "Login with OrangeHRM"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
