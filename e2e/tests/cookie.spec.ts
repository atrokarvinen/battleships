import { expect, test } from "@playwright/test";
import { post } from "./api-request";
import { config } from "./config";

test.describe.skip("test playwright and cookies interaction", () => {
  test("cookies are not passed with just request", async ({ page }) => {
    const request = page.request;
    await request.get(config.backendUrl + "/cookie");
    const response = await request.post(config.backendUrl + "/cookie");
    const json = await response.json();
    expect(json.cookie).toBeUndefined(); // :(
  });

  test("cookies are manually passed with request", async ({ page }) => {
    const request = page.request;
    await request.get(config.backendUrl + "/cookie");
    const response = await post({ request, url: "/cookie" });
    const json = await response.json();
    expect(json.cookie).toBe("cookieValue");
  });

  test("cookies are passed from requests made by UI", async ({ page }) => {
    await page.goto(config.frontendUrl + "/cookie-test");

    await page.getByText("get cookie").click();
    await page.getByText("post cookie").click();

    await expect(page.getByText("cookieValue")).toBeVisible();
  });

  test("cookies are stored to context from request, used by UI", async ({
    page,
  }) => {
    const request = page.request;
    await request.get(config.backendUrl + "/cookie");

    await page.goto(config.frontendUrl + "/cookie-test");
    await page.getByText("post cookie").click();

    await expect(page.getByText("cookieValue")).toBeVisible();
  });
});
