import { expect, test } from "@playwright/test";
import { IndexPage } from "../pages/index-page";
import { TestComponentPage } from "../pages/test-component-page";
import { TestDirectivePage } from "../pages/test-directive-page";

test.describe("angular-asp-net48-mvc5 app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  test("Index", async ({ page }) => {
    const indexPage = new IndexPage(page);

    await expect(indexPage.title).toHaveText(
      "XLTS for AngularJS with .NET Framework"
    );
  });

  test("TestComponent", async ({ page }) => {
    const testComponentPage = new TestComponentPage(page);

    await expect(testComponentPage.angularVersion).toHaveText(
      "Angular Version: 21.2.0"
    );
  });

  test("TestDirective", async ({ page }) => {
    const testDirective = new TestDirectivePage(page);

    await expect(testDirective.angularVersion).toHaveText(
      "Angular Version: 21.2.0"
    );
  });
});
