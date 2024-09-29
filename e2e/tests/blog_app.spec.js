const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith } = require("./helper");

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

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "testiteuvo", "salasana");
      await expect(page.getByText("Logged in successfully as Teppo Testi")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "testiteuvo", "wronk");
      await expect(page.getByText("wrong username or password")).toBeVisible();
    });
  });
});
