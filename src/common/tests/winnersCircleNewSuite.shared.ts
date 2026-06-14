import { Page, TestType, expect } from '@playwright/test';
import { WinnersCirclePage } from '../pages/WinnersCirclePage';
import { HeaderPage } from '../pages/HeaderPage';

type WinnersCircleSuiteFixtures = {
    page: Page;
    winnersCirclePage: WinnersCirclePage;
    headerPage: HeaderPage;
    testData: any;
};

export async function runWinnersCircleNewSuiteTests(
    test: TestType<WinnersCircleSuiteFixtures, any>
) {

    test.describe('Winners Circle - Logged Out', () => {

        test.beforeEach(async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.goto('/');
            await winnersCirclePage.open();
        });

        test('WC-LO-001 - navigates to the Winners Circle from the header', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectOnWinnersPage();
        });

        test('WC-LO-002 - the page shows its key sections', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectPageSections();
        });

        test('WC-LO-003 - a Big Winners card shows amount, masked user and game', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectBigWinnerCardValid();
        });

        test('WC-LO-004 - the Big Winners carousel scrolls horizontally', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectBigWinnersScrolls();
        });

        test('WC-LO-005 - the All Winners section is displayed', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectAllWinnersSection();
        });

        test('WC-LO-006 - the All Winners table has data rows', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectAllWinnersHasRows();
        });

        test('WC-LO-007 - the All Winners list scrolls vertically', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectAllWinnersScrolls();
        });

        test('WC-LO-008 - the Hot Games section is displayed', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectGamesSection('Hot Games');
        });

        test('WC-LO-009 - the Most Popular section is displayed', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectGamesSection('Most Popular');
        });

        test('WC-LO-010 - the Most Liked section is displayed', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectGamesSection('Most Liked');
        });

        test('WC-LO-011 - clicking a Big Winners game opens its game page', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await expect(winnersCirclePage.bigWinnersGameLink).toBeVisible();
            await winnersCirclePage.launchBigWinnersGame();
            await winnersCirclePage.expectAt(/\/home\//);
            await expect(winnersCirclePage.playNowButton).toBeVisible();
        });

        test('WC-LO-012 - clicking a Hot Games card opens its game page', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            const gamePath = await winnersCirclePage.launchSectionGame('Hot Games');
            await winnersCirclePage.expectAt(new RegExp(gamePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
            await expect(winnersCirclePage.playNowButton).toBeVisible();
        });

        test('WC-LO-013 - the page keeps rendering after a theme switch', async ({ winnersCirclePage, headerPage }: WinnersCircleSuiteFixtures) => {
            await headerPage.expectThemeToggles();
            await expect(winnersCirclePage.bigWinnersHeading).toBeVisible();
        });

    });

    test.describe('Winners Circle - Logged In', () => {

        test.beforeEach(async ({ winnersCirclePage, headerPage, testData }: WinnersCircleSuiteFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Logged-in: pending test account');
            await winnersCirclePage.goto('/');
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
            await winnersCirclePage.open();
        });

        test('WC-LI-001 - the page is accessible when logged in', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectOnWinnersPage();
        });

        test('WC-LI-002 - the Big Winners section is displayed', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await expect(winnersCirclePage.bigWinnersHeading).toBeVisible();
            await expect(winnersCirclePage.bigWinnersCarousel).toBeVisible();
            await winnersCirclePage.expectBigWinnersCardCount();
        });

        test('WC-LI-003 - a Big Winners card shows amount, masked user and game', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectBigWinnerCardValid();
        });

        test('WC-LI-004 - the Big Winners carousel scrolls horizontally', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectBigWinnersScrolls();
        });

        test('WC-LI-005 - the All Winners section is displayed', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectAllWinnersSection();
        });

        test('WC-LI-006 - the All Winners table has data rows', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectAllWinnersHasRows();
        });

        test('WC-LI-007 - the All Winners list scrolls vertically', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectAllWinnersScrolls();
        });

        test('WC-LI-008 - the Hot Games section is displayed', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectGamesSection('Hot Games');
        });

        test('WC-LI-009 - the Most Popular section is displayed', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectGamesSection('Most Popular');
        });

        test('WC-LI-010 - the Most Liked section is displayed', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectGamesSection('Most Liked');
        });

        test('WC-LI-011 - clicking a Big Winners card launches the game', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await expect(winnersCirclePage.bigWinnersGameLink).toBeVisible();
            await winnersCirclePage.launchBigWinnersGame();
            await winnersCirclePage.expectAt(/\/home\//);
            await expect(winnersCirclePage.gameFrame).toBeVisible({ timeout: 30000 });
        });

        test('WC-LI-012 - clicking a Hot Games card launches the game', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            const gamePath = await winnersCirclePage.launchSectionGame('Hot Games');
            await winnersCirclePage.expectAt(new RegExp(gamePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
            await expect(winnersCirclePage.gameFrame).toBeVisible({ timeout: 30000 });
        });

        test('WC-LI-013 - Big Winners cards show a favourite icon', async ({ winnersCirclePage }: WinnersCircleSuiteFixtures) => {
            await winnersCirclePage.expectFavIconsOnBigWinners();
        });

    });
}
