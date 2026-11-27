"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight } from "lucide-react";
import {
  budgetOptions,
  contactSchema,
  projectTypeOptions,
  type ContactFormValues,
} from "@/lib/contact-schema";

const CONTACT_ENDPOINT = "/api/contact";

type Status = "idle" | "sending" | "success" | "error";

const fieldClass =
  "w-full border-0 border-b border-carbon-black/40 bg-transparent px-0 py-3 text-lg text-carbon-black outline-none transition-colors placeholder:text-carbon-black/40 focus:border-carbon-black aria-[invalid=true]:border-red-700";

interface ContactFormProps {
  fallbackEmail?: string;
}

export function ContactForm({ fallbackEmail }: ContactFormProps) {
  const baseId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    // Zod 4 + RHF: input/output divergem por causa de `.default()` no honeypot.
    resolver: zodResolver(contactSchema) as never,
    defaultValues: {
      name: "",
      company: "",
      email: "",
      whatsapp: "",
      projectType: "",
      budget: "",
      timeline: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setStatus("sending");
    setErrorMessage("");
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; code?: string }
        | null;

      if (!response.ok) {
        setErrorMessage(
          payload?.error ||
            "Não foi possível enviar sua mensagem agora. Tente novamente.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setErrorMessage(
        "Não foi possível enviar sua mensagem agora. Tente novamente.",
      );
      setStatus("error");
    }
  }

  const id = (name: string) => `${baseId}-${name}`;
  const errorId = (name: string) => `${id(name)}-error`;

  if (status === "success") {
    return (
      <div role="status" className="border-t border-carbon-black py-10">
        <p className="title-md">Mensagem enviada.</p>
        <p className="mt-4 max-w-md text-base leading-relaxed opacity-80">
          Obrigado pelo contato. Retorno assim que possível.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="cta-link mt-8"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative grid gap-x-10 gap-y-8 md:grid-cols-2"
    >
      <Field label="Nome" htmlFor={id("name")} error={errors.name?.message} errorId={errorId("name")}>
        <input
          id={id("name")}
          type="text"
          autoComplete="name"
          placeholder="Seu nome"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? errorId("name") : undefined}
          className={fieldClass}
          {...register("name")}
        />
      </Field>

      <Field
        label="Empresa (opcional)"
        htmlFor={id("company")}
        error={errors.company?.message}
        errorId={errorId("company")}
      >
        <input
          id={id("company")}
          type="text"
          autoComplete="organization"
          placeholder="Nome da empresa"
          aria-invalid={errors.company ? true : undefined}
          aria-describedby={errors.company ? errorId("company") : undefined}
          className={fieldClass}
          {...register("company")}
        />
      </Field>

      <Field label="E-mail" htmlFor={id("email")} error={errors.email?.message} errorId={errorId("email")}>
        <input
          id={id("email")}
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? errorId("email") : undefined}
          className={fieldClass}
          {...register("email")}
        />
      </Field>

      <Field
        label="WhatsApp"
        htmlFor={id("whatsapp")}
        error={errors.whatsapp?.message}
        errorId={errorId("whatsapp")}
      >
        <input
          id={id("whatsapp")}
          type="tel"
          autoComplete="tel"
          placeholder="(00) 00000-0000"
          aria-invalid={errors.whatsapp ? true : undefined}
          aria-describedby={errors.whatsapp ? errorId("whatsapp") : undefined}
          className={fieldClass}
          {...register("whatsapp")}
        />
      </Field>

      <Field
        label="Tipo de projeto"
        htmlFor={id("projectType")}
        error={errors.projectType?.message}
        errorId={errorId("projectType")}
      >
        <select
          id={id("projectType")}
          aria-invalid={errors.projectType ? true : undefined}
          aria-describedby={errors.projectType ? errorId("projectType") : undefined}
          className={fieldClass}
          {...register("projectType")}
        >
          <option value="">Selecione…</option>
          {projectTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Faixa de investimento (opcional)"
        htmlFor={id("budget")}
        error={errors.budget?.message}
        errorId={errorId("budget")}
      >
        <select id={id("budget")} className={fieldClass} {...register("budget")}>
          {budgetOptions.map((option) => (
            <option key={option.value || "none"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Prazo desejado (opcional)"
        htmlFor={id("timeline")}
        error={errors.timeline?.message}
        errorId={errorId("timeline")}
        className="md:col-span-2"
      >
        <input
          id={id("timeline")}
          type="text"
          placeholder="Ex.: 30 dias, até o lançamento de março…"
          className={fieldClass}
          {...register("timeline")}
        />
      </Field>

      <Field
        label="Descrição do projeto"
        htmlFor={id("message")}
        error={errors.message?.message}
        errorId={errorId("message")}
        className="md:col-span-2"
      >
        <textarea
          id={id("message")}
          rows={5}
          placeholder="Conte sobre o projeto, objetivos e contexto."
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId("message") : undefined}
          className={`${fieldClass} resize-y`}
          {...register("message")}
        />
      </Field>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={id("website")}>Não preencha este campo</label>
        <input
          id={id("website")}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="md:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? errorId("consent") : undefined}
            className="mt-1 size-4 shrink-0 accent-carbon-black"
            {...register("consent")}
          />
          <span>
            Li e concordo com a{" "}
            <Link href="/privacidade" className="underline underline-offset-4">
              Política de Privacidade
            </Link>
            , autorizando o uso dos dados informados para retorno sobre este orçamento.
          </span>
        </label>
        {errors.consent && (
          <p id={errorId("consent")} role="alert" className="mt-2 text-sm text-red-700">
            {errors.consent.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 md:col-span-2">
        <div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="pill pill-dark !px-8 !py-4 !text-lg disabled:opacity-60"
          >
            {status === "sending" ? "Enviando…" : "Solicitar orçamento"}
            <ArrowUpRight aria-hidden="true" className="arrow-shift size-5" />
          </button>
        </div>

        {status === "error" && (
          <p role="alert" className="max-w-xl text-sm leading-relaxed text-red-700">
            {errorMessage}
            {fallbackEmail ? (
              <>
                {" "}
                Você também pode escrever para{" "}
                <a href={`mailto:${fallbackEmail}`} className="underline underline-offset-4">
                  {fallbackEmail}
                </a>
                .
              </>
            ) : null}
          </p>
        )}
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  errorId: string;
  className?: string;
  children: React.ReactNode;
}

function Field({ label, htmlFor, error, errorId, className = "", children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="eyebrow block">
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
