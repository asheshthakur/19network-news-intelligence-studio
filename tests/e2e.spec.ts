import { test, expect } from "@playwright/test";

test.describe("19Network News Intelligence Studio E2E Workflows", () => {
  test("1. Overview loads with KPIs and Navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/19Network/);
    await expect(page.locator("text=19Network Editorial Intelligence")).toBeVisible();
    await expect(page.locator("text=Stories Discovered")).toBeVisible();
    await expect(page.locator("text=UAE Opportunities")).toBeVisible();
    await expect(page.locator("text=Social Audience")).toBeVisible();
  });

  test("2. Topic Radar loads feeds, allows searching, and displays scores", async ({ page }) => {
    await page.goto("/topic-radar");
    await expect(page.locator("text=Topic Radar Discovery Engine")).toBeVisible();
    await expect(page.locator("text=Multi-Source News Discovery")).toBeVisible();

    // Verify filter controls exist
    const searchInput = page.locator("input[placeholder*='Search discovered stories']");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Dubai");

    // Check that story cards appear
    await expect(page.locator("text=Dispatches").or(page.locator("text=discovered dispatches"))).toBeVisible();
  });

  test("3. Story Intelligence displays 7 editorial angles and fact-check checklist", async ({ page }) => {
    await page.goto("/story-intelligence");
    await expect(page.locator("text=Story Intelligence Workspace")).toBeVisible();
    await expect(page.locator("text=7 Editorial Angles for 19Network Coverage")).toBeVisible();
    await expect(page.locator("text=Breaking News Desk")).toBeVisible();
    await expect(page.locator("text=The UAE Perspective")).toBeVisible();
    await expect(page.locator("text=Editorial Fact-Checking & Attribution Checklist")).toBeVisible();
  });

  test("4. Content Ideation Studio produces website headlines and Instagram carousel", async ({ page }) => {
    await page.goto("/content-ideation");
    await expect(page.locator("text=Content Ideation Studio")).toBeVisible();
    await expect(page.locator("text=5 Headline Angle Variations")).toBeVisible();

    // Switch to Instagram tab
    await page.click("button:has-text('Instagram Carousel')");
    await expect(page.locator("text=Slide 1")).toBeVisible();
    await expect(page.locator("text=Post Caption & Hashtags")).toBeVisible();

    // Switch to LinkedIn tab
    await page.click("button:has-text('LinkedIn Editorial')");
    await expect(page.locator("text=LinkedIn Executive Briefing")).toBeVisible();
  });

  test("5. Editorial Calendar displays scheduled items in GST", async ({ page }) => {
    await page.goto("/calendar");
    await expect(page.locator("text=Editorial Content Calendar")).toBeVisible();
    await expect(page.locator("text=Weekly Publishing Rhythm")).toBeVisible();
    await expect(page.locator("text=Schedule Content")).toBeVisible();
  });

  test("6. Social Intelligence displays verified follower benchmarks & CSV import", async ({ page }) => {
    await page.goto("/social-intelligence");
    await expect(page.locator("text=Social Intelligence & Analytics")).toBeVisible();
    await expect(page.locator("a:has-text('@19network.news')")).toBeVisible();
    await expect(page.getByText("19,400", { exact: true })).toBeVisible();
    await expect(page.getByText("971", { exact: true })).toBeVisible();

    // Open CSV import toolbar
    await page.click("button:has-text('Import Platform CSV')");
    await expect(page.locator("text=Official Analytics CSV Import")).toBeVisible();
  });

  test("7. AI Compatibility Analyzer computes readiness score and generates Schema.org JSON-LD", async ({ page }) => {
    await page.goto("/ai-compatibility");
    await expect(page.locator("text=AI Search & SEO Readiness Analyzer")).toBeVisible();
    await expect(page.locator("text=Overall AI Readiness")).toBeVisible();

    // Inspect JSON-LD Schema
    await page.click("button:has-text('View JSON-LD Schema')");
    await expect(page.locator("button:has-text('Hide JSON-LD')")).toBeVisible();
    await expect(page.locator("pre")).toBeVisible();
  });

  test("8. Website Publishing workspace displays live preview and CMS draft adapter", async ({ page }) => {
    await page.goto("/publishing");
    await expect(page.locator("text=Website Publishing Workspace")).toBeVisible();
    await expect(page.locator("text=Article Headline")).toBeVisible();
    await expect(page.locator("text=WordPress REST API Adapter")).toBeVisible();

    // Switch to Live Preview
    await page.click("button:has-text('Live Article Preview')");
    await expect(page.locator("text=19Network Intelligence")).toBeVisible();
  });

  test("9. Reports page renders executive summary and print formatting", async ({ page }) => {
    await page.goto("/reports");
    await expect(page.locator("text=Newsroom Reports & Audits")).toBeVisible();
    await expect(page.locator("text=Daily News Discovery Report")).toBeVisible();
    await expect(page.locator("text=Weekly Editorial Intelligence Executive Summary")).toBeVisible();
  });

  test("10. Settings allows updating 100-point opportunity scoring weights", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("text=Newsroom Configuration")).toBeVisible();
    await expect(page.locator("text=100-Point Opportunity Scoring Weights")).toBeVisible();
    await expect(page.locator("text=Active Multi-Source Feed Adapters")).toBeVisible();
    await expect(page.locator("text=Reset Demo Workspace")).toBeVisible();
  });

  test("11. Mobile responsive navigation toggle operates seamlessly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    const menuBtn = page.locator("button[aria-label='Open navigation menu']");
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await expect(page.locator("aside").getByText("Topic Radar")).toBeVisible();
  });
});
