const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blogs app", () => {
  beforeEach(async ({ page, request }) => {
    const response = await request.post("/api/testing/reset");
    console.log("rsponse url", response.url());
    await expect(response.status()).toBe(204);
    await request.post("/api/users", {
      data: {
        name: "Teppo Testi",
        username: "testiteuvo",
        password: "salasana",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const loginButton = await page.getByText("login");
    const usernameInput = await page.getByTestId("username");
    const passwordInput = await page.getByTestId("password");
    await expect(loginButton).toBeVisible();
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });
  test("front page can be opened", async ({ page }) => {
    await page.goto("/");

    const locator = await page.getByText("Blogs");
    await expect(locator).toBeVisible();
  });
});
