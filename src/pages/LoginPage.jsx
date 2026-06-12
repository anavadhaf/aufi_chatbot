import { Navigate } from "react-router-dom";
import { LoginCard } from "../components/auth/LoginCard";
import { useAuthStore } from "../store/auth.store";

const stars = [
  ["7%", "9%", "2px", "0s"],
  ["13%", "22%", "1px", "1.6s"],
  ["18%", "14%", "1px", "2.4s"],
  ["24%", "27%", "2px", "0.8s"],
  ["31%", "8%", "1px", "3.2s"],
  ["39%", "19%", "1px", "1.2s"],
  ["47%", "11%", "2px", "2.8s"],
  ["54%", "25%", "1px", "0.4s"],
  ["62%", "7%", "1px", "2s"],
  ["69%", "18%", "2px", "3.6s"],
  ["76%", "12%", "1px", "1s"],
  ["83%", "24%", "1px", "2.2s"],
  ["91%", "10%", "2px", "0.6s"],
  ["96%", "29%", "1px", "3s"],
  ["5%", "35%", "1px", "2.6s"],
  ["17%", "39%", "1px", "0.2s"],
  ["28%", "33%", "1px", "1.8s"],
  ["36%", "42%", "2px", "3.4s"],
  ["52%", "37%", "1px", "1.4s"],
  ["64%", "34%", "1px", "2.9s"],
  ["73%", "43%", "1px", "0.9s"],
  ["88%", "36%", "2px", "2.1s"],
];

const shootingStars = [
  ["17%", "18%", "0s"],
  ["48%", "12%", "3.6s"],
  ["72%", "25%", "6.4s"],
];

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="login-shell relative min-h-screen overflow-hidden bg-[#050505] font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(228,175,255,0.12),transparent_40%),radial-gradient(circle_at_top_right,rgba(114,14,217,0.20),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(114,14,217,0.18),transparent_40%),linear-gradient(180deg,#050505_0%,#09030F_30%,#120421_70%,#080808_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[42vh] bg-[linear-gradient(180deg,rgba(3,3,8,0.78)_0%,rgba(9,3,15,0.45)_52%,transparent_100%)]" />
      <div className="absolute -left-28 top-10 h-80 w-80 rounded-full bg-[#E4AFFF]/10 blur-3xl" />
      <div className="absolute -right-24 top-8 h-96 w-96 rounded-full bg-[#720ED9]/12 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-24 translate-y-20 rounded-full bg-[#720ED9]/14 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-[48vh] opacity-80">
        {stars.map(([left, top, size, delay]) => (
          <span
            key={`${left}-${top}`}
            className="login-star absolute rounded-full bg-[#E4AFFF]"
            style={{
              left,
              top,
              width: size,
              height: size,
              animationDelay: delay,
            }}
          />
        ))}
        {shootingStars.map(([left, top, delay]) => (
          <span
            key={`${left}-${top}`}
            className="shooting-star absolute"
            style={{
              left,
              top,
              animationDelay: delay,
            }}
          />
        ))}
      </div>

      <section className="login-content relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <LoginCard />
        </div>
      </section>

      <style>{`
        .login-shell {
          animation: login-page-fade 700ms ease-out both;
        }

        .login-star {
          box-shadow: 0 0 10px rgba(228, 175, 255, 0.72);
          opacity: 0.62;
          animation: star-twinkle 5.8s ease-in-out infinite;
        }

        .shooting-star {
          height: 1px;
          width: 118px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(228, 175, 255, 0.92), transparent);
          box-shadow: 0 0 18px rgba(228, 175, 255, 0.55);
          opacity: 0;
          transform: rotate(-32deg) translate3d(0, 0, 0);
          animation: shooting-star-drift 9s ease-in-out infinite;
        }

        .login-content {
          animation: login-content-rise 800ms cubic-bezier(0.2, 0.8, 0.2, 1) 120ms both;
        }

        @keyframes login-page-fade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes login-content-rise {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes star-twinkle {
          0%, 100% {
            opacity: 0.38;
            transform: translateY(0) scale(0.92);
          }

          50% {
            opacity: 0.9;
            transform: translateY(2px) scale(1);
          }
        }

        @keyframes shooting-star-drift {
          0%, 68% {
            opacity: 0;
            transform: rotate(-32deg) translate3d(-8px, 0, 0);
          }

          72% {
            opacity: 0.8;
          }

          84% {
            opacity: 0;
            transform: rotate(-32deg) translate3d(210px, 0, 0);
          }

          100% {
            opacity: 0;
            transform: rotate(-32deg) translate3d(210px, 0, 0);
          }
        }
      `}</style>
    </main>
  );
}

export default LoginPage;
