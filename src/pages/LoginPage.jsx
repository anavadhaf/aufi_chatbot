import { Navigate } from "react-router-dom";
import { LoginCard } from "../components/auth/LoginCard";
import { useAuthStore } from "../store/auth.store";

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#021B1F] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(51,214,196,0.32),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(129,230,217,0.24),transparent_24%),linear-gradient(135deg,#021B1F_0%,#0B3A3F_46%,#1A6B6B_100%)]" />
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute bottom-4 right-4 h-96 w-96 rounded-full bg-emerald-200/10 blur-3xl" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <LoginCard />
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
