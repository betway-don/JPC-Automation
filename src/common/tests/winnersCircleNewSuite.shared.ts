import { Page, TestInfo, TestType, expect } from '@playwright/test';
import { WinnersCirclePage } from '../pages/WinnersCirclePage';
import { HeaderPage } from '../pages/HeaderPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

type WinnersCircleSuiteFixtures = {
    page: Page;
    winnersCirclePage: WinnersCirclePage;
    headerPage: HeaderPage;
    screenshotDir: string;
    testData: any;
};

export async function runWinnersCircleNewSuiteTests(
    test: TestType<WinnersCircleSuiteFixtures, any>
) {

    test.describe('Winners Circle - Logged Out', () => {

        test.beforeEach(async ({ page, winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await winnersCirclePage.navigate();
        });

        test('WC-LO-001 - Verify Winners Circle navigation from header', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(page).toHaveURL(/\/winners/, { timeout: 15000 });
            await expect(winnersCirclePage.locators.bigWinnersHeading).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-001-navigation', testInfo);
        });

        test('WC-LO-002 - Verify Winners Circle page UI', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.bigWinnersHeading).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('bigWinnersHeading');
            await expect(winnersCirclePage.locators.bigWinnersCarousel).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('bigWinnersCarousel');
            await expect(winnersCirclePage.locators.allWinnersHeading).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-002-pageUI', testInfo);
        });

        test('WC-LO-003 - Verify Big Winners card structure', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.bigWinnersCard).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('bigWinnersCard');
            // win amount must be a real rand value, e.g. "R 236,580.00"
            const amount = await winnersCirclePage.locators.bigWinnersAmount.textContent({ timeout: 5000 });
            expect(amount?.trim()).toMatch(/R\s*[\d,]+(\.\d{2})?/);
            // masked user must be an actually masked account, e.g. "*******5648"
            const maskedUser = await winnersCirclePage.locators.bigWinnersMaskedUser.textContent({ timeout: 5000 });
            expect(maskedUser?.trim()).toMatch(/^\*+\d+$/);
            const gameName = await winnersCirclePage.locators.bigWinnersGameName.textContent({ timeout: 5000 });
            expect(gameName?.trim().length).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-003-cardStructure', testInfo);
        });

        test('WC-LO-004 - Verify Big Winners carousel horizontal scroll', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.bigWinnersCarousel).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('bigWinnersCarousel');
            const initialScroll = await winnersCirclePage.locators.bigWinnersCarousel.evaluate((el: HTMLElement) => el.scrollLeft);
            await winnersCirclePage.locators.bigWinnersCarousel.hover();
            await page.mouse.wheel(500, 0);
            await page.waitForTimeout(500);
            const finalScroll = await winnersCirclePage.locators.bigWinnersCarousel.evaluate((el: HTMLElement) => el.scrollLeft);
            expect(finalScroll).toBeGreaterThan(initialScroll);
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-004-carouselScroll', testInfo);
        });

        test('WC-LO-005 - Verify All Winners section is displayed', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.allWinnersHeading).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('allWinnersHeading');
            await expect(winnersCirclePage.locators.allWinnersTable).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('allWinnersTable');
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-005-allWinners', testInfo);
        });

        test('WC-LO-006 - Verify All Winners table has data rows', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.allWinnersTable).toBeVisible({ timeout: 15000 });
            const rowCount = await winnersCirclePage.allWinnersRows.count();
            expect(rowCount).toBeGreaterThan(0);
            // rows must carry real winner data: a rand amount somewhere in the first row
            await expect(winnersCirclePage.allWinnersRows.first()).toContainText(/R\s*[\d,]+/, { timeout: 10000 });
            await winnersCirclePage.highlightElement('allWinnersTable');
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-006-allWinnersRows', testInfo);
        });

        test('WC-LO-007 - Verify All Winners vertical scroll', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.allWinnersTableContainer).toBeVisible({ timeout: 15000 });
            const container = winnersCirclePage.locators.allWinnersTableContainer;
            await container.evaluate((el: HTMLElement) => el.scrollIntoView({ block: 'center' }));
            const scrollHeight = await container.evaluate((el: HTMLElement) => el.scrollHeight);
            const clientHeight = await container.evaluate((el: HTMLElement) => el.clientHeight);
            if (scrollHeight > clientHeight) {
                await container.evaluate((el: HTMLElement) => { el.scrollTop = 200; });
                const finalScroll = await container.evaluate((el: HTMLElement) => el.scrollTop);
                expect(finalScroll).toBeGreaterThan(0);
            } else {
                const rowCount = await winnersCirclePage.allWinnersRows.count();
                expect(rowCount).toBeGreaterThan(0);
            }
            await winnersCirclePage.highlightElement('allWinnersTableContainer');
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-007-allWinnersScroll', testInfo);
        });

        test('WC-LO-008 - Verify Hot Games section is displayed', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await winnersCirclePage.activateGameSection('Hot Games');
            const section = winnersCirclePage.getGameSection('Hot Games');
            await expect(section).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightLocator('hotGamesSection', section);
            const cards = winnersCirclePage.getGameCards('Hot Games');
            await expect(cards.first()).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightLocator('hotGamesCard', cards.first());
            const cardCount = await cards.count();
            expect(cardCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-008-hotGames', testInfo);
        });

        test('WC-LO-009 - Verify Most Popular Games section is displayed', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await winnersCirclePage.activateGameSection('Most Popular');
            const section = winnersCirclePage.getGameSection('Most Popular');
            await expect(section).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightLocator('mostPopularSection', section);
            const cards = winnersCirclePage.getGameCards('Most Popular');
            await expect(cards.first()).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightLocator('mostPopularCard', cards.first());
            const cardCount = await cards.count();
            expect(cardCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-009-mostPopular', testInfo);
        });

        test('WC-LO-010 - Verify Most Liked Games section is displayed', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await winnersCirclePage.activateGameSection('Most Liked');
            const section = winnersCirclePage.getGameSection('Most Liked');
            await expect(section).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightLocator('mostLikedSection', section);
            const cards = winnersCirclePage.getGameCards('Most Liked');
            await expect(cards.first()).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightLocator('mostLikedCard', cards.first());
            const cardCount = await cards.count();
            expect(cardCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-010-mostLiked', testInfo);
        });

        test('WC-LO-011 - Verify clicking Big Winners game navigates to game detail page', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.bigWinnersGameLink).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('bigWinnersGameLink');
            await winnersCirclePage.clickBigWinnersGame();
            await expect(page).toHaveURL(/\/home\//, { timeout: 15000 });
            await expect(winnersCirclePage.playNowButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-011-bigWinnersGameClick', testInfo);
        });

        test('WC-LO-012 - Verify clicking Hot Games card navigates to game detail page', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await winnersCirclePage.activateGameSection('Hot Games');
            const hotSection = winnersCirclePage.getGameSection('Hot Games');
            await expect(hotSection).toBeVisible({ timeout: 15000 });
            const firstCard = winnersCirclePage.getGameCards('Hot Games').first();
            await expect(firstCard).toBeVisible({ timeout: 15000 });
            // remember WHICH game we clicked so we can verify the right page opens
            const href = await firstCard.getAttribute('href');
            const gamePath = (href || '').split('?')[0];
            await firstCard.click();
            await expect(page).toHaveURL(new RegExp(gamePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
            await expect(winnersCirclePage.playNowButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-012-hotGamesGameClick', testInfo);
        });

        test('WC-LO-013 - Verify Winners Circle page theme consistency', async ({ page, winnersCirclePage, headerPage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.bigWinnersHeading).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('bigWinnersCarousel');
            // switching theme must flip the html dark class and keep the page rendering
            const wasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
            await headerPage.toggleTheme();
            await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')), { timeout: 5000 }).toBe(!wasDark);
            await expect(winnersCirclePage.locators.bigWinnersHeading).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'WC-LO-013-theme', testInfo);
            // restore the original theme
            await headerPage.toggleTheme();
            await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')), { timeout: 5000 }).toBe(wasDark);
        });

    });

    test.describe('Winners Circle - Logged In', () => {

        test.beforeEach(async ({ page, winnersCirclePage, headerPage, testData }: WinnersCircleSuiteFixtures) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
            await winnersCirclePage.navigate();
        });

        test('WC-LI-001 - Verify Winners Circle page accessibility in logged-in state', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(page).toHaveURL(/\/winners/, { timeout: 15000 });
            await expect(winnersCirclePage.locators.bigWinnersHeading).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('bigWinnersHeading');
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-001-accessLoggedIn', testInfo);
        });

        test('WC-LI-002 - Verify Big Winners section is displayed', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.bigWinnersHeading).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('bigWinnersHeading');
            await expect(winnersCirclePage.locators.bigWinnersCarousel).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('bigWinnersCarousel');
            const cardCount = await winnersCirclePage.getBigWinnersCards().count();
            expect(cardCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-002-bigWinners', testInfo);
        });

        test('WC-LI-003 - Verify Big Winners card structure', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.bigWinnersCard).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('bigWinnersCard');
            // win amount must be a real rand value, e.g. "R 236,580.00"
            const amount = await winnersCirclePage.locators.bigWinnersAmount.textContent({ timeout: 5000 });
            expect(amount?.trim()).toMatch(/R\s*[\d,]+(\.\d{2})?/);
            // masked user must be an actually masked account, e.g. "*******5648"
            const maskedUser = await winnersCirclePage.locators.bigWinnersMaskedUser.textContent({ timeout: 5000 });
            expect(maskedUser?.trim()).toMatch(/^\*+\d+$/);
            const gameName = await winnersCirclePage.locators.bigWinnersGameName.textContent({ timeout: 5000 });
            expect(gameName?.trim().length).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-003-cardStructure', testInfo);
        });

        test('WC-LI-004 - Verify Big Winners carousel horizontal scroll', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.bigWinnersCarousel).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('bigWinnersCarousel');
            const initialScroll = await winnersCirclePage.locators.bigWinnersCarousel.evaluate((el: HTMLElement) => el.scrollLeft);
            await winnersCirclePage.locators.bigWinnersCarousel.hover();
            await page.mouse.wheel(500, 0);
            await page.waitForTimeout(500);
            const finalScroll = await winnersCirclePage.locators.bigWinnersCarousel.evaluate((el: HTMLElement) => el.scrollLeft);
            expect(finalScroll).toBeGreaterThan(initialScroll);
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-004-carouselScroll', testInfo);
        });

        test('WC-LI-005 - Verify All Winners section is displayed', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.allWinnersHeading).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('allWinnersHeading');
            await expect(winnersCirclePage.locators.allWinnersTable).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('allWinnersTable');
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-005-allWinners', testInfo);
        });

        test('WC-LI-006 - Verify All Winners table has data rows', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.allWinnersTable).toBeVisible({ timeout: 15000 });
            const rowCount = await winnersCirclePage.allWinnersRows.count();
            expect(rowCount).toBeGreaterThan(0);
            // rows must carry real winner data: a rand amount somewhere in the first row
            await expect(winnersCirclePage.allWinnersRows.first()).toContainText(/R\s*[\d,]+/, { timeout: 10000 });
            await winnersCirclePage.highlightElement('allWinnersTable');
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-006-allWinnersRows', testInfo);
        });

        test('WC-LI-007 - Verify All Winners vertical scroll', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.allWinnersTableContainer).toBeVisible({ timeout: 15000 });
            const container = winnersCirclePage.locators.allWinnersTableContainer;
            await container.evaluate((el: HTMLElement) => el.scrollIntoView({ block: 'center' }));
            const scrollHeight = await container.evaluate((el: HTMLElement) => el.scrollHeight);
            const clientHeight = await container.evaluate((el: HTMLElement) => el.clientHeight);
            if (scrollHeight > clientHeight) {
                await container.evaluate((el: HTMLElement) => { el.scrollTop = 200; });
                const finalScroll = await container.evaluate((el: HTMLElement) => el.scrollTop);
                expect(finalScroll).toBeGreaterThan(0);
            } else {
                const rowCount = await winnersCirclePage.allWinnersRows.count();
                expect(rowCount).toBeGreaterThan(0);
            }
            await winnersCirclePage.highlightElement('allWinnersTableContainer');
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-007-allWinnersScroll', testInfo);
        });

        test('WC-LI-008 - Verify Hot Games section is displayed', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await winnersCirclePage.activateGameSection('Hot Games');
            const section = winnersCirclePage.getGameSection('Hot Games');
            await expect(section).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightLocator('hotGamesSection', section);
            const cards = winnersCirclePage.getGameCards('Hot Games');
            await expect(cards.first()).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightLocator('hotGamesCard', cards.first());
            const cardCount = await cards.count();
            expect(cardCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-008-hotGames', testInfo);
        });

        test('WC-LI-009 - Verify Most Popular Games section is displayed', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await winnersCirclePage.activateGameSection('Most Popular');
            const section = winnersCirclePage.getGameSection('Most Popular');
            await expect(section).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightLocator('mostPopularSection', section);
            const cards = winnersCirclePage.getGameCards('Most Popular');
            await expect(cards.first()).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightLocator('mostPopularCard', cards.first());
            const cardCount = await cards.count();
            expect(cardCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-009-mostPopular', testInfo);
        });

        test('WC-LI-010 - Verify Most Liked Games section is displayed', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await winnersCirclePage.activateGameSection('Most Liked');
            const section = winnersCirclePage.getGameSection('Most Liked');
            await expect(section).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightLocator('mostLikedSection', section);
            const cards = winnersCirclePage.getGameCards('Most Liked');
            await expect(cards.first()).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightLocator('mostLikedCard', cards.first());
            const cardCount = await cards.count();
            expect(cardCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-010-mostLiked', testInfo);
        });

        test('WC-LI-011 - Verify clicking Big Winners game card launches game', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.bigWinnersGameLink).toBeVisible({ timeout: 15000 });
            await winnersCirclePage.highlightElement('bigWinnersGameLink');
            await winnersCirclePage.clickBigWinnersGame();
            await expect(page).toHaveURL(/\/home\//, { timeout: 15000 });
            await expect(winnersCirclePage.gameFrame).toBeVisible({ timeout: 30000 });
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-011-bigWinnersGameLaunch', testInfo);
        });

        test('WC-LI-012 - Verify clicking Hot Games card launches game', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await winnersCirclePage.activateGameSection('Hot Games');
            const hotSection = winnersCirclePage.getGameSection('Hot Games');
            await expect(hotSection).toBeVisible({ timeout: 15000 });
            const firstCard = winnersCirclePage.getGameCards('Hot Games').first();
            await expect(firstCard).toBeVisible({ timeout: 15000 });
            // remember WHICH game we clicked so we can verify the right game launches
            const href = await firstCard.getAttribute('href');
            const gamePath = (href || '').split('?')[0];
            await firstCard.click();
            await expect(page).toHaveURL(new RegExp(gamePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
            await expect(winnersCirclePage.gameFrame).toBeVisible({ timeout: 30000 });
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-012-hotGamesGameLaunch', testInfo);
        });

        test('WC-LI-013 - Verify favourite icon is visible on Big Winners game cards', async ({ page, winnersCirclePage, screenshotDir }: WinnersCircleSuiteFixtures, testInfo: TestInfo) => {
            await expect(winnersCirclePage.locators.bigWinnersCard).toBeVisible({ timeout: 15000 });
            const favIcons = winnersCirclePage.bigWinnerFavIcons;
            const favCount = await favIcons.count();
            expect(favCount).toBeGreaterThan(0);
            await winnersCirclePage.highlightElement('bigWinnersCard');
            await ScreenshotHelper(page, screenshotDir, 'WC-LI-013-favouriteIcons', testInfo);
        });

    });
}
