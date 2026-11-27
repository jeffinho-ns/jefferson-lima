import { expect, test } from "@playwright/test";

test.describe("Home", () => {
  test("carrega hero e seções principais", async ({ page }) => {
    test.setTimeout(60_000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("jt:preloader-seen", "1");
      } catch {
        /* ignore */
      }
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeAttached();
    await expect(page.locator("#hero")).toBeAttached();
    await expect(page.getByRole("button", { name: /menu/i })).toBeAttached();
    await expect(page.getByText(/DESIGN IS MY LANGUAGE/i).first()).toBeAttached();
    await expect(page.getByText(/SELECTED WORKS/i).first()).toBeAttached();
    await expect(
      page.getByText(/LET.?S BUILD[\s\S]*SOMETHING[\s\S]*DIFFERENT/i).first(),
    ).toBeAttached();

    expect(errors.filter((e) => !/THREE\.Clock/i.test(e))).toEqual([]);
  });

  test("rotas internas respondem", async ({ page }) => {
    for (const path of ["/sobre", "/projetos", "/servicos", "/contato", "/privacidade"]) {
      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();
    }
  });
});
