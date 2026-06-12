import axios from "axios";

const verifierStorageKey = "orangehrm_pkce_code_verifier";

const oauthConfig = {
  clientId: import.meta.env.VITE_OAUTH_CLIENT_ID || "",
  clientSecret: import.meta.env.VITE_OAUTH_CLIENT_SECRET || "",
  authUrl:
    import.meta.env.VITE_OAUTH_AUTH_URL ||
    "http://localhost:8080/web/index.php/oauth2/authorize",
  tokenUrl:
    import.meta.env.VITE_OAUTH_TOKEN_URL ||
    "/orangehrm-oauth/web/index.php/oauth2/token",
  redirectUri:
    import.meta.env.VITE_OAUTH_REDIRECT_URI || "http://localhost:5173/auth/callback",
};

function validateOAuthConfig() {
  const missingFields = [];

  if (!oauthConfig.clientId) {
    missingFields.push("VITE_OAUTH_CLIENT_ID");
  }

  if (!oauthConfig.clientSecret) {
    missingFields.push("VITE_OAUTH_CLIENT_SECRET");
  }

  if (!oauthConfig.authUrl) {
    missingFields.push("VITE_OAUTH_AUTH_URL");
  }

  if (!oauthConfig.tokenUrl) {
    missingFields.push("VITE_OAUTH_TOKEN_URL");
  }

  if (!oauthConfig.redirectUri) {
    missingFields.push("VITE_OAUTH_REDIRECT_URI");
  }

  if (missingFields.length > 0) {
    throw new Error(`Missing OAuth configuration: ${missingFields.join(", ")}`);
  }
}

function base64UrlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildTokenBody(values) {
  const body = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    body.set(key, value ?? "");
  });

  return body;
}

export function generateCodeVerifier() {
  const randomBytes = new Uint8Array(64);
  window.crypto.getRandomValues(randomBytes);

  return base64UrlEncode(randomBytes);
}

export async function generateCodeChallenge(codeVerifier) {
  const encodedVerifier = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", encodedVerifier);

  return base64UrlEncode(digest);
}

export function storeCodeVerifier(codeVerifier) {
  sessionStorage.setItem(verifierStorageKey, codeVerifier);
}

export function getStoredCodeVerifier() {
  return sessionStorage.getItem(verifierStorageKey);
}

export function clearStoredCodeVerifier() {
  sessionStorage.removeItem(verifierStorageKey);
}

export function buildAuthorizationUrl(codeChallenge) {
  validateOAuthConfig();

  const authorizationUrl = new URL(oauthConfig.authUrl);

  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("client_id", oauthConfig.clientId);
  authorizationUrl.searchParams.set("redirect_uri", oauthConfig.redirectUri);
  authorizationUrl.searchParams.set("code_challenge", codeChallenge);
  authorizationUrl.searchParams.set("code_challenge_method", "S256");

  return authorizationUrl.toString();
}

export async function startLogin() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const authorizationUrl = buildAuthorizationUrl(codeChallenge);

  storeCodeVerifier(codeVerifier);
  window.location.assign(authorizationUrl);
}

export async function exchangeAuthorizationCode({ code, codeVerifier }) {
  validateOAuthConfig();

  const body = buildTokenBody({
    grant_type: "authorization_code",
    client_id: oauthConfig.clientId,
    client_secret: oauthConfig.clientSecret,
    code,
    redirect_uri: oauthConfig.redirectUri,
    code_verifier: codeVerifier,
  });

  const response = await axios.post(oauthConfig.tokenUrl, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export async function refreshAccessToken(refreshToken) {
  validateOAuthConfig();

  const body = buildTokenBody({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: oauthConfig.clientId,
    client_secret: oauthConfig.clientSecret,
  });

  const response = await axios.post(oauthConfig.tokenUrl, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}
