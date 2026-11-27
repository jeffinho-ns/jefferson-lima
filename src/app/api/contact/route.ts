import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";

const WINDOW_MS =
  Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 60) * 1000 || 60_000;
const MAX_REQUESTS = Number(process.env.RATE_LIMIT || 5) || 5;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || now > current.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Muitas tentativas. Aguarde um momento e tente novamente." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Dados inválidos.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.website) {
    // Honeypot preenchido: responde sucesso silencioso.
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim() || siteConfig.email;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() || "onboarding@resend.dev";

  if (!apiKey || !toEmail) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "O envio de e-mail ainda não está configurado. Defina RESEND_API_KEY e CONTACT_TO_EMAIL.",
        code: "EMAIL_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const subject = `[Orçamento] ${data.projectType} — ${data.name}`;
  const text = [
    `Nome: ${data.name}`,
    data.company ? `Empresa: ${data.company}` : null,
    `E-mail: ${data.email}`,
    `WhatsApp: ${data.whatsapp}`,
    `Tipo: ${data.projectType}`,
    data.budget ? `Investimento: ${data.budget}` : null,
    data.timeline ? `Prazo: ${data.timeline}` : null,
    "",
    "Descrição:",
    data.message,
    "",
    `Consentimento LGPD: sim`,
    `IP: ${ip}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: data.email,
      subject,
      text,
    });

    if (result.error) {
      return NextResponse.json(
        { ok: false, error: "Falha ao enviar o e-mail. Tente novamente." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Falha ao enviar o e-mail. Tente novamente." },
      { status: 502 },
    );
  }
}
