import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "../../../../lib/admin-access";
import { readLogo } from "../../../../lib/logo-upload";
export async function POST(request: NextRequest) {
  const client = await adminClient();
  if (!client) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  try {
    if (Number(request.headers.get("content-length")) > 2300000) throw new Error("Logo must be smaller than 2 MB.");
    const form = await request.formData();
    let file = form.get("logo");
    const submissionId = form.get("submissionId");
    if (typeof submissionId === "string" && submissionId) {
      const { data: row } = await client.from("opportunity_submissions").select("logo_path").eq("id", submissionId).single();
      if (!row?.logo_path) throw new Error("The submission has no uploaded logo.");
      const { data, error } = await client.storage.from("submission-logos").download(row.logo_path);
      if (error || !data) throw new Error("Could not load the submitted logo.");
      file = new File([data], "logo", { type: data.type });
    }
    if (!(file instanceof File)) throw new Error("Choose a logo first.");
    const { data, mime, extension } = await readLogo(file);
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from("organization-logos").upload(path, data, { contentType: mime, upsert: false });
    if (error) throw new Error("Could not upload. Check logo storage setup and try again.");
    return NextResponse.json({ url: client.storage.from("organization-logos").getPublicUrl(path).data.publicUrl });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 }); }
}
