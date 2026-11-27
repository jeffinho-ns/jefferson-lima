import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

describe("contactSchema", () => {
  it("aceita um payload válido", () => {
    const result = contactSchema.safeParse({
      name: "Jefferson Teixeira",
      company: "JT Studio",
      email: "contato@example.com",
      whatsapp: "11999999999",
      projectType: "landing-page",
      budget: "5k-15k",
      timeline: "30 dias",
      message: "Quero uma landing page premium para lançamento.",
      consent: true,
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita sem consentimento", () => {
    const result = contactSchema.safeParse({
      name: "Jefferson Teixeira",
      email: "contato@example.com",
      whatsapp: "11999999999",
      projectType: "landing-page",
      message: "Quero uma landing page premium para lançamento.",
      consent: false,
      website: "",
    });
    expect(result.success).toBe(false);
  });

  it("aceita honeypot preenchido no schema (silenciamento fica na API)", () => {
    const result = contactSchema.safeParse({
      name: "Bot",
      email: "bot@example.com",
      whatsapp: "11999999999",
      projectType: "outros",
      message: "spam message here",
      consent: true,
      website: "http://spam.test",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.website).toBe("http://spam.test");
    }
  });
});

