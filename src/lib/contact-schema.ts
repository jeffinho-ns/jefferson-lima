import { z } from "zod";

/** Tipos de projeto do brief comercial. */
export const projectTypeOptions = [
  { value: "site-institucional", label: "Site institucional" },
  { value: "landing-page", label: "Landing Page" },
  { value: "e-commerce", label: "E-commerce" },
  { value: "sistema-personalizado", label: "Sistema personalizado" },
  { value: "plataforma-saas", label: "Plataforma SaaS" },
  { value: "inteligencia-artificial", label: "Inteligência Artificial" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "integracao", label: "Integração" },
  { value: "outros", label: "Outros" },
] as const;

export const budgetOptions = [
  { value: "", label: "Prefiro não informar" },
  { value: "ate-5k", label: "Até R$ 5.000" },
  { value: "5k-15k", label: "R$ 5.000 – R$ 15.000" },
  { value: "15k-40k", label: "R$ 15.000 – R$ 40.000" },
  { value: "40k-plus", label: "Acima de R$ 40.000" },
  { value: "a-definir", label: "A definir juntos" },
] as const;

const projectTypeValues = projectTypeOptions.map((option) => option.value);

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome.")
    .max(120, "Nome muito longo."),
  company: z.string().trim().max(160, "Empresa muito longa.").optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .max(160, "E-mail muito longo.")
    .pipe(z.email("Informe um e-mail válido.")),
  whatsapp: z
    .string()
    .trim()
    .min(8, "Informe um WhatsApp válido.")
    .max(30, "WhatsApp muito longo."),
  projectType: z
    .string()
    .refine(
      (value) => projectTypeValues.includes(value as (typeof projectTypeValues)[number]),
      "Selecione o tipo de projeto.",
    ),
  budget: z.string().trim().max(40).optional().or(z.literal("")),
  timeline: z.string().trim().max(120, "Prazo muito longo.").optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Descreva o projeto (mínimo de 10 caracteres).")
    .max(4000, "Descrição muito longa."),
  consent: z
    .boolean()
    .refine((value) => value, "É necessário concordar com a Política de Privacidade."),
  /** Honeypot: deve permanecer vazio no cliente; a API trata preenchimento. */
  website: z.string().max(200),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
