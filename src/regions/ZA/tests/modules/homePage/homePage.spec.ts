import path from 'path';
import { test, Browser, chromium, Page, expect } from '@playwright/test';
import { highlightElements } from '../../../../../common/actions/HighlightElements';
import { ScreenshotHelper } from '../../../../../common/actions/ScreenshotHelper';

const projectRoot = path.resolve(__dirname, '../../../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/homepage');

async function login(page: Page, mobile: string, password: string) {
    // Basic check to skip login if already logged in (optional based on your app behavior)
    
        await page.getByRole('button', { name: 'Login' }).click();
        await page.getByRole('textbox', { name: 'username' }).fill(mobile);
        await page.getByRole('textbox', { name: 'password' }).fill(password);
        await page.getByRole('textbox', { name: 'password' }).press('Enter');
        await page.waitForLoadState('domcontentloaded');
    }


test.describe('Home Page Features - Banners', () => {
    let browser: Browser;
    let context: any;
    let page: Page;

    test.beforeAll(async () => {
        // Manually create a single browser instance, context, and page
        browser = await chromium.launch({ headless: false }); // Visible for debugging
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

    test('TC_HOMEPAGE_001 Verify horizontal scrollability of banners', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678'); 
        
        // Target the specific banner image provided
        const banner = page.locator('img[alt="Standard Banner"]').first();
        await banner.waitFor({ state: 'visible' });

        // Highlight the banner before scrolling to confirm selection
        await highlightElements(banner);

        // Locate the scrollable parent container (Traversing up from the image)
        const scrollContainer = banner.locator('xpath=ancestor::div[contains(@class, "swiper") or contains(@class, "scroll") or contains(@class, "banner")][1]');
        
        // Capture initial state
        const initialScroll = await scrollContainer.evaluate(el => el.scrollLeft);

        // Perform Horizontal Scroll
        await scrollContainer.evaluate(el => el.scrollBy({ left: 100, behavior: 'instant' }));
        await page.waitForTimeout(1000); // Wait for scroll animation/update

        // Verify scroll position changed
        const newScroll = await scrollContainer.evaluate(el => el.scrollLeft);
        expect(newScroll).not.toBe(initialScroll);

        await ScreenshotHelper(page, screenshotDir, 'TC001-BannerScroll', testInfo);
    });

    test('TC_HOMEPAGE_002 Verify visibility of CTA buttons (Image Verification)', async ({ }, testInfo) => {
        // Since CTA is part of the image, we verify the image is loaded and visible
        const banner = page.locator('img[alt="Standard Banner"]').first();
        
        // Ensure element is in viewport
        await banner.scrollIntoViewIfNeeded();
        
        // Check if image is genuinely loaded (naturalWidth > 0)
        const isLoaded = await banner.evaluate((img: HTMLImageElement) => img.naturalWidth > 0);
        expect(isLoaded).toBeTruthy();

        // Highlight for visual confirmation in screenshot
        await highlightElements(banner);
        
        await ScreenshotHelper(page, screenshotDir, 'TC002-BannerVisibility', testInfo);
    });

    test('TC_HOMEPAGE_003 Verify CTA redirection from banners', async ({ }, testInfo) => {
        const banner = page.locator('img[alt="Standard Banner"]').first();
        await highlightElements(banner);

        // Capture current URL to verify change later
        const startUrl = page.url();

        // Click the banner (Baked-in CTA)
        await banner.click();
        await page.waitForLoadState('domcontentloaded');

        // Verify URL changed
        const newUrl = page.url();
        expect(newUrl).not.toBe(startUrl);

        // Take screenshot of the destination page
        await ScreenshotHelper(page, screenshotDir, 'TC003-BannerRedirection', testInfo);

        // Cleanup: Return to homepage for any subsequent tests
        await page.goto('https://jackpotcity.co.za/', { waitUntil: 'domcontentloaded' });
    });

});