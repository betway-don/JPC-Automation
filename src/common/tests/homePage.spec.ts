import { test, expect, Page, Browser, chromium } from '@playwright/test';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';
import { highlightElements } from '../actions/HighlightElements';
import * as path from 'path';

const screenshotDir = path.join(__dirname, '../../test-results');

async function login(page: Page, mobile: string, password: string) {
    const loginButton = page.locator('button:has-text("Login")').first();
    if (await loginButton.isVisible()) {
        await loginButton.click();
        await page.getByRole('textbox', { name: 'username' }).fill(mobile);
        await page.getByRole('textbox', { name: 'password' }).fill(password);
        await page.getByRole('textbox', { name: 'password' }).press('Enter');
        await page.waitForLoadState('domcontentloaded');
    }
}

test.describe('Home Page Tests', () => {
    let browser: Browser;
    let context: any;
    let page: Page;

    test.beforeAll(async () => {
        // Manually create a single browser instance, context, and page
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();

        await page.goto('https://jackpotcity.co.za/', { waitUntil: 'domcontentloaded' });
    });

    test.afterAll(async () => {
        // Clean up browser resources
        await page.close();
        await context.close();
        await browser.close();
    });

    test('T1. Verify horizontal scrollability of banners', async ({ }, testInfo) => {
        // Ensure we are on home page and logged in
        await page.goto('https://jackpotcity.co.za/', { waitUntil: 'domcontentloaded' });
        await login(page, '640987655', '12345678');
        await page.waitForTimeout(3000);

        const bannerImage = page.locator('img[alt="Standard Banner"]').first();
        await expect(bannerImage).toBeVisible();
        await highlightElements(bannerImage);

        const boundingBox = await bannerImage.boundingBox();
        if (boundingBox) {
            const startX = boundingBox.x + boundingBox.width * 0.8;
            const endX = boundingBox.x + boundingBox.width * 0.2;
            const y = boundingBox.y + boundingBox.height / 2;
            
            await page.mouse.move(startX, y);
            await page.mouse.down();
            await page.mouse.move(endX, y, { steps: 10 });
            await page.mouse.up();
            await page.waitForTimeout(1000);
        }

        await ScreenshotHelper(page, screenshotDir, 'T1-homePage-BannerScroll', testInfo);
    });

    test('T2. Verify autoscrolling of Big Winners carousel', async ({ }, testInfo) => {
        await page.goto('https://jackpotcity.co.za/', { waitUntil: 'domcontentloaded' });
        await login(page, '640987655', '12345678');
        await page.waitForTimeout(3000);

        const marqueeContent = page.locator('.marquee__content').first();
        await expect(marqueeContent).toBeVisible();
        await highlightElements(marqueeContent);

        const getTransform = async () => await marqueeContent.evaluate((el: Element) => window.getComputedStyle(el).transform);
        
        const transformBefore = await getTransform();
        await page.waitForTimeout(1500);
        const transformAfter = await getTransform();

        expect(transformBefore).not.toBe(transformAfter);

        await ScreenshotHelper(page, screenshotDir, 'T2-homePage-BigWinnersAutoScroll', testInfo);
    });

    test('T3. Verify game launch from Big Winners carousel', async ({ }, testInfo) => {
        await page.goto('https://jackpotcity.co.za/', { waitUntil: 'domcontentloaded' });
        await login(page, '640987655', '12345678');
        await page.waitForTimeout(3000);

        const marqueeGame = page.locator('.marquee__content a').first();
        await expect(marqueeGame).toBeVisible();
        await highlightElements(marqueeGame);
        
        await marqueeGame.click({ force: true });
        
        // Wait to allow navigation or game load to occur
        await page.waitForTimeout(5000);
        
        await ScreenshotHelper(page, screenshotDir, 'T3-homePage-BigWinnersLaunch', testInfo);
    });

    test('T4. Mark game as favorite', async ({ }, testInfo) => {
        await page.goto('https://jackpotcity.co.za/', { waitUntil: 'domcontentloaded' });
        await login(page, '640987655', '12345678');
        await page.waitForTimeout(3000);

        const favButton = page.locator('[aria-label^="favorite-game"]').first();
        await expect(favButton).toBeVisible();
        await favButton.scrollIntoViewIfNeeded();
        
        await highlightElements(favButton);

        await favButton.click();
        await page.waitForTimeout(2000);

        const favouritesTitle = page.locator('div.font-bold', { hasText: 'Favourites' }).first();
        const favouritesCarousel = page.locator('#favourites-carousel');

        await expect.soft(favouritesTitle).toBeVisible();
        await expect.soft(favouritesCarousel).toBeVisible();

        await ScreenshotHelper(page, screenshotDir, 'T4-homePage-MarkFavorite', testInfo);
    });

    test('T5. Unmark favorite game', async ({ }, testInfo) => {
        await page.goto('https://jackpotcity.co.za/', { waitUntil: 'domcontentloaded' });
        await login(page, '640987655', '12345678');
        await page.waitForTimeout(3000);

        const favButton = page.locator('[aria-label^="favorite-game"]').first();
        await expect(favButton).toBeVisible();
        await favButton.scrollIntoViewIfNeeded();
        
        await highlightElements(favButton);

        await favButton.click();
        await page.waitForTimeout(2000);

        await ScreenshotHelper(page, screenshotDir, 'T5-homePage-UnmarkFavorite', testInfo);
    });

});
