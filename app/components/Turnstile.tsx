"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

const scriptId = "cloudflare-turnstile-script";
const scriptSrc = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

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

    let cancelled = false;
    let timeout = 0;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const handleLoad = () => {
      if (!cancelled && window.turnstile) renderWidget();
    };

    const handleError = () => {
      if (!cancelled) setStatus("error");
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      // A stale script element can remain after client-side navigation even when
      // the browser did not execute it. Replace it so the verification can retry.
      if (script && !window.turnstile) {
        script.remove();
        script = null;
      }

      script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptSrc;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", handleLoad);
      script.addEventListener("error", handleError);
      document.head.appendChild(script);

      timeout = window.setTimeout(() => {
        if (!cancelled && !window.turnstile) setStatus("error");
      }, 10000);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      script?.removeEventListener("load", handleLoad);
      script?.removeEventListener("error", handleError);
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
