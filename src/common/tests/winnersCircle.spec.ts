import path from 'path';
import { test, Browser, chromium, Page, expect } from '@playwright/test';
import { highlightElements } from '../actions/HighlightElements';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';
 
const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/winnersCircle');
 
async function login(page: Page, mobile: string, password: string) {
    const loginButton = page.getByRole('button', { name: 'Login' });
    if (await loginButton.isVisible()) {
        await loginButton.click();
        await page.getByRole('textbox', { name: 'username' }).fill(mobile);
        await page.getByRole('textbox', { name: 'password' }).fill(password);
        await page.getByRole('textbox', { name: 'password' }).press('Enter');
        await page.waitForLoadState('domcontentloaded');
    }
}
 
test.describe('Winners Circle Tests', () => {
    let browser: Browser;
    let context: any;
    let page: any;
 
    test.beforeAll(async () => {
        // Manually create a single browser instance, context, and page
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();
 
        await page.goto('https://www.jackpotcitycasino.mw/', { waitUntil: 'domcontentloaded' });
        await login(page, '912163131', 'Test@123');
    });
 
    test.afterAll(async () => {
        // Clean up browser resources
        await page.close();
        await context.close();
        await browser.close();
    });
 
    // test('T1. Verify Display of Big Winners', async ({ }, testInfo) => {
    //     await page.locator('button[element-name="page-link-winners"]').click();
    //     await page.waitForTimeout(2000);
        
    //     const bigWinnersTitle = page.locator('p.font-bold.capitalize:has-text("Big Winners")');
    //     await expect(bigWinnersTitle).toBeVisible();
    //     await highlightElements(bigWinnersTitle);
    //     await ScreenshotHelper(page, screenshotDir, 'T1-winnersCircle-BigWinners', testInfo);
    // });

    // test('T2. Verify Big Winners Horizontal Scroll Functionality', async ({ }, testInfo) => {
    //     await page.locator('button[element-name="page-link-winners"]').click();
    //     await page.waitForTimeout(2000);
        
    //     const carousel = page.locator('#-carousel.scroller-casino');
    //     await expect(carousel).toBeVisible();
    //     await highlightElements(carousel);
        
    //     const initialScroll = await carousel.evaluate((el: any) => el.scrollLeft);
        
    //     // Scroll horizontal using mouse hover and wheel
    //     await carousel.hover();
    //     await page.mouse.wheel(500, 0);
    //     await page.waitForTimeout(1000);
        
    //     const finalScroll = await carousel.evaluate((el: any) => el.scrollLeft);
    //     expect(finalScroll).toBeGreaterThan(initialScroll);
    //     await ScreenshotHelper(page, screenshotDir, 'T2-winnersCircle-BigWinners-Scroll', testInfo);
    // });

    test('T3. Verify Display of All Winners', async ({ }, testInfo) => {
        await page.locator('button[element-name="page-link-winners"]').click();
        await page.waitForTimeout(2000);
        
        const allWinnersTitle = page.locator('p.font-bold.capitalize:has-text("All Winners")');
        await expect(allWinnersTitle).toBeVisible();
        await highlightElements(allWinnersTitle);
        
        const allWinnersTable = page.locator('div.max-h-96.overflow-y-auto table');
        await expect(allWinnersTable).toBeVisible();
        await highlightElements(allWinnersTable);
        
        await ScreenshotHelper(page, screenshotDir, 'T3-winnersCircle-AllWinners', testInfo);
    });

    test('T4. Verify Display of Hot Games', async ({ }, testInfo) => {
        await page.locator('button[element-name="page-link-winners"]').click();
        await page.waitForTimeout(2000);
        
        const hotGamesContainer = page.locator('div.bg-layer.rounded-xl:visible').filter({ has: page.locator('p:has-text("Hot Games")') }).first();
        const hotGamesTitle = hotGamesContainer.locator('p:has-text("Hot Games")');
        
        await expect(hotGamesContainer).toBeVisible();
        await expect(hotGamesTitle).toBeVisible();
        await highlightElements(hotGamesTitle);
        
        const gamesGrid = hotGamesContainer.locator('.grid').first();
        await expect(gamesGrid).toBeVisible();
        await highlightElements(gamesGrid);
        
        await ScreenshotHelper(page, screenshotDir, 'T4-winnersCircle-HotGames', testInfo);
    });

    test('T5. Verify Display of Most Popular Games', async ({ }, testInfo) => {
        await page.locator('button[element-name="page-link-winners"]').click();
        await page.waitForTimeout(2000);
        
        const mostPopularContainer = page.locator('div.bg-layer.rounded-xl:visible').filter({ has: page.locator('p:has-text("Most Popular")') }).first();
        const mostPopularTitle = mostPopularContainer.locator('p:has-text("Most Popular")');
        
        await expect(mostPopularContainer).toBeVisible();
        await expect(mostPopularTitle).toBeVisible();
        await highlightElements(mostPopularTitle);
        
        const gamesGrid = mostPopularContainer.locator('.grid').first();
        await expect(gamesGrid).toBeVisible();
        await highlightElements(gamesGrid);
        
        await ScreenshotHelper(page, screenshotDir, 'T5-winnersCircle-MostPopularGames', testInfo);
    });

    test('T6. Verify Display of Most Liked Games', async ({ }, testInfo) => {
        await page.locator('button[element-name="page-link-winners"]').click();
        await page.waitForTimeout(2000);
        
        const mostLikedContainer = page.locator('div.bg-layer.rounded-xl:visible').filter({ has: page.locator('p:has-text("Most Liked")') }).first();
        const mostLikedTitle = mostLikedContainer.locator('p:has-text("Most Liked")');
        
        await expect(mostLikedContainer).toBeVisible();
        await expect(mostLikedTitle).toBeVisible();
        await highlightElements(mostLikedTitle);
        
        const gamesGrid = mostLikedContainer.locator('.grid').first();
        await expect(gamesGrid).toBeVisible();
        await highlightElements(gamesGrid);
        
        await ScreenshotHelper(page, screenshotDir, 'T6-winnersCircle-MostLikedGames', testInfo);
    });

    test('T7. Verify Game Launch from Big Winners', async ({ }, testInfo) => {
        await page.locator('button[element-name="page-link-winners"]').click();
        await page.waitForTimeout(2000);
        
        const carousel = page.locator('#-carousel.scroller-casino');
        
        // Click the first game
        const firstGame = carousel.locator('a').first();
        await firstGame.click();
        
        await page.waitForTimeout(3000);
        await ScreenshotHelper(page, screenshotDir, 'T7-winnersCircle-BigWinners-Launch', testInfo);
    });

    test('T8. Verify Game Launch from Hot Games', async ({ }, testInfo) => {
        await page.locator('button[element-name="page-link-winners"]').click();
        await page.waitForTimeout(2000);
        
        const hotGamesContainer = page.locator('div.bg-layer.rounded-xl:visible').filter({ has: page.locator('p:has-text("Hot Games")') }).first();
        
        // Click the first game
        const firstGame = hotGamesContainer.locator('a').first();
        await firstGame.click();
        
        await page.waitForTimeout(3000);
        await ScreenshotHelper(page, screenshotDir, 'T8-winnersCircle-HotGames-Launch', testInfo);
    });

    test('T9. Verify Game Launch from Most Popular Games', async ({ }, testInfo) => {
        await page.locator('button[element-name="page-link-winners"]').click();
        await page.waitForTimeout(2000);
        
        const mostPopularContainer = page.locator('div.bg-layer.rounded-xl:visible').filter({ has: page.locator('p:has-text("Most Popular")') }).first();
        
        // Click the first game
        const firstGame = mostPopularContainer.locator('a').first();
        await firstGame.click();
        
        await page.waitForTimeout(3000);
        await ScreenshotHelper(page, screenshotDir, 'T9-winnersCircle-MostPopularGames-Launch', testInfo);
    });

    test('T10. Verify Game Launch from Most Liked Games', async ({ }, testInfo) => {
        await page.locator('button[element-name="page-link-winners"]').click();
        await page.waitForTimeout(2000);
        
        const mostLikedContainer = page.locator('div.bg-layer.rounded-xl:visible').filter({ has: page.locator('p:has-text("Most Liked")') }).first();
        
        // Click the first game
        const firstGame = mostLikedContainer.locator('a').first();
        await firstGame.click();
        
        await page.waitForTimeout(3000);
        await ScreenshotHelper(page, screenshotDir, 'T10-winnersCircle-MostLikedGames-Launch', testInfo);
    });

    test('T11. Verify All Winners Vertical Scroll Functionality', async ({ }, testInfo) => {
        await page.locator('button[element-name="page-link-winners"]').click();
        await page.waitForTimeout(2000);
        
        const allWinnersTableContainer = page.locator('div.max-h-96.overflow-y-auto').first();
        await highlightElements(allWinnersTableContainer);
        
        const getScrollPos = async () => await page.locator('div.max-h-96.overflow-y-auto').last().evaluate((el: any) => el.scrollTop);
        const initialScroll = await getScrollPos();
        
        // Ensure table is in the center of the viewport away from sticky site headers
        await allWinnersTableContainer.evaluate(el => el.scrollIntoView({ block: 'center' }));
        await page.waitForTimeout(500);
        
        // Hover safely inside the tbody area (y: 100 avoids the table's own sticky thead)
        await allWinnersTableContainer.hover({ position: { x: 50, y: 100 }, force: true });
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(1000);
        
        const finalScroll = await getScrollPos();
        expect(finalScroll).toBeGreaterThan(initialScroll);
        
        await ScreenshotHelper(page, screenshotDir, 'T11-winnersCircle-AllWinners-Scroll', testInfo);
    });

});
