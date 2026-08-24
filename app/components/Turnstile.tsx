"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function Turnstile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile || widgetIdRef.current) return;

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "light",
        size: "flexible",
        appearance: "always",
        "response-field": false,
        callback: (value: string) => {
          setToken(value);
          setStatus("ready");
        },
        "expired-callback": () => {
          setToken("");
          setStatus("ready");
        },
        "error-callback": () => {
          setToken("");
          setStatus("error");
        },
      });
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!siteKey) return;
    const timer = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(timer);
        renderWidget();
      }
    }, 150);

    return () => {
      window.clearInterval(timer);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  if (!siteKey) {
    return <p className="captcha-setup-note">Spam protection is being configured. Please try again shortly.</p>;
  }

  return <div className="turnstile-field" aria-live="polite">
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive"
      onLoad={renderWidget}
      onReady={renderWidget}
      onError={() => setStatus("error")}
    />
    <span className="turnstile-label">Security check</span>
    <input type="hidden" name="cf-turnstile-response" value={token} />
    <div ref={containerRef} className="turnstile-widget" />
    {status === "loading" && <small className="turnstile-status">Loading secure verification…</small>}
    {status === "error" && <small className="turnstile-status error">The security check could not load. Refresh the page or temporarily disable a content blocker.</small>}
  </div>;
}

export async function submitProtectedForm(kind: string, payload: Record<string, unknown>, form: FormData) {
  const captchaToken = String(form.get("cf-turnstile-response") || "");
  if (!captchaToken) throw new Error("Please complete the security check before submitting.");
  const response = await fetch("/api/public-submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, payload, captchaToken }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "We could not verify this submission. Please try again.");
  return result;
}
