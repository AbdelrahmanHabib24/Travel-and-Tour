import "server-only";
import crypto from "crypto";

const DEFAULT_HF_SPACE_URL = "https://abdelrahmanhabib-livekit-voice-agent.hf.space";
const DEFAULT_LOCAL_BACKEND_URL = "http://127.0.0.1:7860";

/**
 * Derive the shared authentication token used between Next.js API routes
 * and the Python AI backend. Never exposed to the browser.
 */
export function getBackendAuthToken(): string | null {
  const explicit = process.env.BACKEND_SHARED_SECRET?.trim();
  if (explicit) {
    return explicit;
  }

  const seed =
    process.env.LIVEKIT_API_SECRET?.trim() || process.env.JWT_SECRET?.trim();
  if (seed) {
    return crypto
      .createHmac("sha256", seed)
      .update("travel-and-tour-ai-backend-v1")
      .digest("hex");
  }

  return null;
}

/**
 * Return ordered backend base URLs to try.
 * - If PYTHON_BACKEND_URL is explicitly configured, it takes priority.
 * - In local development, http://127.0.0.1:7860 is tried before HF_SPACE_URL so
 *   a locally running Python backend is used automatically when available.
 */
export function getBackendBaseUrls(): string[] {
  const urls: string[] = [];

  const configuredPrimary = process.env.PYTHON_BACKEND_URL?.trim();
  if (configuredPrimary) {
    urls.push(configuredPrimary.replace(/\/+$/, ""));
  }

  if (process.env.NODE_ENV !== "production") {
    const localUrl = DEFAULT_LOCAL_BACKEND_URL.replace(/\/+$/, "");
    if (!urls.includes(localUrl)) {
      urls.push(localUrl);
    }
  }

  const hfUrl = (process.env.HF_SPACE_URL || DEFAULT_HF_SPACE_URL)
    .trim()
    .replace(/\/+$/, "");
  if (hfUrl && !urls.includes(hfUrl)) {
    urls.push(hfUrl);
  }

  return urls;
}

export function buildBackendHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "TravelTour-NextServerProxy/2.0",
  };

  const token = getBackendAuthToken();
  if (token) {
    headers["X-Backend-Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

