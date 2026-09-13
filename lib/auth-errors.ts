/** Convert provider errors and thrown network failures into safe, actionable copy. */
export function friendlyAuthError(error: unknown): string {
  const fallback = "We couldn’t complete that request. Please wait for a fresh security check and try again.";
  const details = error && typeof error === "object" ? error as Record<string, unknown> : {};
  const message = typeof error === "string" ? error : typeof details.message === "string" ? details.message : "";
  const code = typeof details.code === "string" ? details.code : "";
  const text = message.toLowerCase();
  if (code === "invalid_credentials" || text.includes("invalid login credentials")) return "We couldn’t sign you in with that email and password. Try entering them manually, or use Forgot password to recover your account.";
  if (code === "email_not_confirmed" || text.includes("email not confirmed")) return "Please confirm your email before logging in. You can resend the confirmation below.";
  if (code === "user_already_exists" || text.includes("user already registered") || text.includes("already been registered")) return "An account already exists for this email. Try logging in or resetting your password.";
  if (code === "weak_password" || text.includes("password should be")) return "Please choose a password with at least 8 characters.";
  if (code === "same_password") return "Please choose a different password from your current password.";
  if (details.status === 429 || code.includes("rate_limit") || text.includes("rate limit")) return "Too many attempts. Please wait a few minutes before trying again.";
  if (code === "captcha_failed" || text.includes("captcha") || text.includes("timeout-or-duplicate")) return "The security check expired or could not be verified. Wait for the new check to finish, then try again.";
  if (text.includes("failed to fetch") || text.includes("network") || details.name === "AuthRetryableFetchError" || (typeof details.status === "number" && details.status >= 500)) return "We can’t reach the account service right now. Please check your connection and try again shortly.";
  if (code === "email_address_not_authorized") return "Email delivery is not available for this address yet. Please contact Gateway for help.";
  if (code === "session_not_found" || code === "refresh_token_not_found" || text.includes("auth session missing")) return "Your session has expired. Please request a new password-reset link or log in again.";
  // Never render raw objects, JSON, HTML, or an unknown provider response.
  return fallback;
}
