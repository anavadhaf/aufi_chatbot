import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  clearStoredCodeVerifier,
  exchangeAuthorizationCode,
  getStoredCodeVerifier,
} from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { showToast } from "../utils/toast";

let pendingTokenExchange = null;
let pendingAuthorizationCode = null;

function exchangeCodeOnce({ code, codeVerifier }) {
  if (pendingTokenExchange && pendingAuthorizationCode === code) {
    return pendingTokenExchange;
  }

  pendingAuthorizationCode = code;
  pendingTokenExchange = exchangeAuthorizationCode({ code, codeVerifier }).catch((error) => {
    pendingAuthorizationCode = null;
    pendingTokenExchange = null;
    throw error;
  });

  return pendingTokenExchange;
}

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [message, setMessage] = useState("Completing secure sign in...");

  useEffect(() => {
    async function completeLogin() {
      const code = searchParams.get("code");
      const oauthError = searchParams.get("error");
      const codeVerifier = getStoredCodeVerifier();

      if (oauthError) {
        setMessage("Login failed. Redirecting...");
        showToast({
          title: "Login Failed",
          description: oauthError,
          variant: "error",
        });
        navigate("/login", { replace: true });
        return;
      }

      if (!code || !codeVerifier) {
        setMessage("Token exchange failed. Redirecting...");
        showToast({
          title: "Token Exchange Failed",
          description: "Missing authorization code or PKCE verifier.",
          variant: "error",
        });
        navigate("/login", { replace: true });
        return;
      }

      try {
        const tokens = await exchangeCodeOnce({ code, codeVerifier });

        clearStoredCodeVerifier();

        login({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresIn: tokens.expires_in,
        });

        console.log("OrangeHRM access token:", tokens.access_token);
        console.log("OrangeHRM token response:", tokens);
        showToast({
          title: "Login Successful",
          description: "OrangeHRM authentication completed.",
          variant: "success",
        });
        navigate("/", { replace: true });
      } catch (error) {
        console.error("OrangeHRM token exchange failed:", error);
        setMessage("Token exchange failed. Redirecting...");
        showToast({
          title: "Token Exchange Failed",
          description:
            error.response?.data?.error_description ||
            error.response?.data?.message ||
            "Unable to complete OrangeHRM authentication.",
          variant: "error",
        });
        navigate("/login", { replace: true });
      }
    }

    completeLogin();
  }, [login, navigate, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#021B1F] px-5 text-white">
      <section className="w-full max-w-md rounded-[1.75rem] border border-white/20 bg-white/[0.09] p-8 text-center shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl">
        <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-cyan-100/20 border-t-cyan-100" />
        <h1 className="text-2xl font-semibold">Authenticating</h1>
        <p className="mt-3 text-sm leading-6 text-cyan-50/70">{message}</p>
      </section>
    </main>
  );
}
