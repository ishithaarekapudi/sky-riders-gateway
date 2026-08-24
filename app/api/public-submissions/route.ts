import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const submissions = {
  opportunity: { table: "opportunity_submissions", fields: ["submission_type", "name", "official_url", "description", "eligible_ages", "location", "deadline_or_availability", "cost_or_award", "submitter_name", "submitter_email", "submitter_connection"] },
  mentor: { table: "mentor_applications", fields: ["first_name", "last_name", "email", "age_range", "city_state", "meeting_format", "interest_areas", "availability", "conduct_consent", "current_role_organization", "experience_qualifications", "preferred_mentee_age", "screening_consent"] },
  mentee: { table: "mentee_applications", fields: ["first_name", "last_name", "email", "age_range", "city_state", "meeting_format", "interest_areas", "availability", "conduct_consent", "guidance_requested", "current_stage", "guardian_email", "guardian_consent_confirmed"] },
  contact: { table: "contact_inquiries", fields: ["name", "email", "organization", "topic", "message"] },
  newsletter: { table: "newsletter_subscribers", fields: ["email", "first_name", "source", "status"] },
  deletion: { table: "data_deletion_requests", fields: ["requester_name", "requester_email", "request_scope", "details"] },
} as const;

export async function POST(request: NextRequest) {
  try {
    const { kind, payload, captchaToken } = await request.json();
    const config = submissions[kind as keyof typeof submissions];
    if (!config || !payload || typeof payload !== "object") return NextResponse.json({ error: "Invalid submission." }, { status: 400 });

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) return NextResponse.json({ error: "Spam protection is not configured yet." }, { status: 503 });
    if (!captchaToken) return NextResponse.json({ error: "Please complete the security check." }, { status: 400 });

    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: turnstileSecret,
        response: captchaToken,
        remoteip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      }),
    });
    const verification = await verify.json();
    if (!verification.success) return NextResponse.json({ error: "The security check expired or failed. Please try it again." }, { status: 400 });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) return NextResponse.json({ error: "Secure form storage is not configured yet." }, { status: 503 });

    const clean = Object.fromEntries(config.fields.filter(field => field in payload).map(field => [field, payload[field]]));
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await supabase.from(config.table).insert(clean);
    if (error) {
      if (kind === "newsletter" && error.code === "23505") return NextResponse.json({ ok: true });
      console.error("Protected form insert failed", { kind, code: error.code });
      return NextResponse.json({ error: "We could not save this submission. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We could not process this submission." }, { status: 400 });
  }
}
