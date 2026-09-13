import { AccountForm } from "./AccountForm";
import { accountMode, safeNext } from "../../lib/auth-navigation";

export default async function AccountPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const value = (name: string) => typeof params[name] === "string" ? params[name] as string : undefined;
  const mode = accountMode(value("mode"));
  const next = safeNext(value("next"));
  const invalidLink = value("auth_error") === "invalid_link";
  return <AccountForm key={`${mode}:${next}:${invalidLink}`} initialMode={mode} nextPath={next} invalidLink={invalidLink} />;
}
