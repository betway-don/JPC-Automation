import { expect, Page, TestInfo, TestType } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

type HeaderNewSuiteFixtures = {
    page: Page;
    headerPage: HeaderPage;
    screenshotDir: string;
    testData: any;
};

export function runHeaderNewSuiteTests(
    test: TestType<HeaderNewSuiteFixtures, any>,
    url: string
) {
    test.beforeEach(async ({ headerPage }) => {
        await headerPage.navigateTo(url);
    });

    test.describe('Header - Logged Out', () => {

        test('H-LO-001 - Verify Hamburger menu visibility and clickability', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.menuButton).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('menuButton');
            await headerPage.clickMenu();
            await ScreenshotHelper(page, screenshotDir, 'H-LO-001-hamburgerMenu', testInfo);
        });

        test('H-LO-002 - Verify JackpotCity logo redirection', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.logoLink).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('logoLink');
            await ScreenshotHelper(page, screenshotDir, 'H-LO-002-logo', testInfo);
            await headerPage.clickLogo();
            await expect(page).toHaveURL(url, { timeout: 15000 });
        });

        test('H-LO-003 - Verify Search bar input functionality', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.searchInput).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('searchInput');
            await headerPage.openSearch();
            await expect(headerPage.locators.searchModal).toBeVisible({ timeout: 15000 });
            await headerPage.typeSearch('hot');
            await expect(headerPage.getSearchResultCard()).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-003-searchResults', testInfo);
        });

        test('H-LO-004 - Verify Login CTA visibility and navigation', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.loginCTA).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('loginCTA');
            await headerPage.clickLoginCTA();
            await expect(headerPage.locators.usernameInput).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-004-loginCTA', testInfo);
        });

        test('H-LO-005 - Verify Sign Up CTA visibility and navigation', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.registerCTA).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('registerCTA');
            await headerPage.clickRegisterCTA();
            await expect(headerPage.locators.signUpModal).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-005-signUpCTA', testInfo);
        });

        test('H-LO-006 - Verify Live Chat icon functionality', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.liveChatIcon).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('liveChatIcon');
            await headerPage.clickLiveChat();
            await page.waitForTimeout(3000);
            await ScreenshotHelper(page, screenshotDir, 'H-LO-006-liveChat', testInfo);
        });

        test('H-LO-007 - Verify Theme Change icon toggles theme', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            // Check html.dark class — Tailwind class-based dark mode; more reliable than button visibility
            const wasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
            await headerPage.toggleTheme();
            if (wasDark) {
                await expect(page.locator('html')).not.toHaveClass(/\bdark\b/, { timeout: 15000 });
            } else {
                await expect(page.locator('html')).toHaveClass(/\bdark\b/, { timeout: 15000 });
            }
            await ScreenshotHelper(page, screenshotDir, 'H-LO-007-themeToggle', testInfo);
        });

        test('H-LO-008 - Verify Header elements remain functional after page refresh', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await page.reload({ waitUntil: 'domcontentloaded' });
            await expect(headerPage.locators.menuButton).toBeVisible({ timeout: 15000 });
            await expect(headerPage.locators.logoLink).toBeVisible({ timeout: 15000 });
            await expect(headerPage.locators.loginCTA).toBeVisible({ timeout: 15000 });
            await expect(headerPage.locators.registerCTA).toBeVisible({ timeout: 15000 });
            await expect(headerPage.locators.searchInput).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-008-afterRefresh', testInfo);
        });

        test('H-LO-009 - Verify Home navigation redirects correctly', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('home');
            await expect(page).toHaveURL(url, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-009-navHome', testInfo);
        });

        test('H-LO-010 - Verify Crash Games navigation redirects correctly', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('crashgames');
            await expect(page).toHaveURL(/\/crashgames/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-010-navCrashGames', testInfo);
        });

        test('H-LO-011 - Verify Aviator navigation in logged out state', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('aviator');
            await expect(page).toHaveURL(/\/aviator/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-011-navAviator', testInfo);
        });

        test('H-LO-012 - Verify Quick Games navigation redirects correctly', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('quickgames');
            await expect(page).toHaveURL(/\/quickgames/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-012-navQuickGames', testInfo);
        });

        test('H-LO-013 - Verify Low Data navigation redirects correctly', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.getNavTab('lowdata')).toBeVisible({ timeout: 15000 });
            await headerPage.clickNavTab('lowdata');
            await expect(page).toHaveURL(/\/lowdata/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-013-navLowData', testInfo);
        });

        test('H-LO-014 - Verify Slot Games navigation redirects correctly', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('spingames');
            await expect(page).toHaveURL(/\/spingames/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-014-navSlotGames', testInfo);
        });

        test('H-LO-015 - Verify Live Games navigation redirects correctly', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('livegames');
            await expect(page).toHaveURL(/\/livegames/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-015-navLiveGames', testInfo);
        });

        test('H-LO-016 - Verify Lucky Numbers navigation redirects correctly', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('luckynumbers');
            await expect(page).toHaveURL(/\/luckynumbers/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-016-navLuckyNumbers', testInfo);
        });

        test('H-LO-017 - Verify New Games navigation redirects correctly', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('new-games');
            await expect(page).toHaveURL(/\/new-games/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-017-navNewGames', testInfo);
        });

        test('H-LO-018 - Verify Promotions navigation redirects correctly', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('Promotions');
            await expect(page).toHaveURL(/\/promotions/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-018-navPromotions', testInfo);
        });

        test('H-LO-019 - Verify Winners Circle navigation redirects correctly', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('winners');
            await expect(page).toHaveURL(/\/winners/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-019-navWinnersCircle', testInfo);
        });

        test('H-LO-020 - Verify selected navigation tab is highlighted', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('spingames');
            await expect(page).toHaveURL(/\/spingames/, { timeout: 15000 });
            // Nuxt router marks the active link with router-link-active on the wrapping <a>
            await expect(page.locator('#spingames-nav-item')).toHaveClass(/router-link-active/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LO-020-activeTabHighlight', testInfo);
        });
    });

    test.describe('Header - Logged In', () => {

        test.beforeEach(async ({ headerPage, testData }) => {
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
        });

        test('H-LI-001 - Verify Hamburger menu icon visibility', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.menuButton).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('menuButton');
            await ScreenshotHelper(page, screenshotDir, 'H-LI-001-hamburgerMenu', testInfo);
        });

        test('H-LI-002 - Verify JackpotCity logo redirection', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.logoLink).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('logoLink');
            await headerPage.clickLogo();
            await expect(page).toHaveURL(url, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LI-002-logo', testInfo);
        });

        test('H-LI-003 - Verify Promotions navigation', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('Promotions');
            await expect(page).toHaveURL(/\/promotions/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LI-003-navPromotions', testInfo);
        });

        test('H-LI-004 - Verify Search bar functionality', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.searchInput).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('searchInput');
            await headerPage.openSearch();
            await expect(headerPage.locators.searchModal).toBeVisible({ timeout: 15000 });
            await headerPage.typeSearch('hot');
            await expect(headerPage.getSearchResultCard()).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LI-004-searchResults', testInfo);
        });

        test('H-LI-005 - Verify Wallet/Cash balance is displayed correctly', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.depositCTA).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('depositCTA');
            await ScreenshotHelper(page, screenshotDir, 'H-LI-005-walletBalance', testInfo);
        });

        test('H-LI-006 - Verify clicking Wallet/Cash dropdown opens options', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.openWalletDropdown();
            await expect(headerPage.locators.accountBalancesDialog).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('accountBalancesDialog');
            await ScreenshotHelper(page, screenshotDir, 'H-LI-006-walletDropdown', testInfo);
        });

        test('H-LI-007 - Verify Deposit CTA popup', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.openWalletDropdown();
            await expect(headerPage.locators.accountBalancesDialog).toBeVisible({ timeout: 15000 });
            await expect(
                headerPage.locators.accountBalancesDialog.getByRole('button', { name: /deposit/i })
            ).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LI-007-depositPopup', testInfo);
        });

        test('H-LI-008 - Verify Notification icon', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.notificationIcon).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('notificationIcon');
            await headerPage.clickNotification();
            await page.waitForTimeout(2000);
            await ScreenshotHelper(page, screenshotDir, 'H-LI-008-notification', testInfo);
        });

        test('H-LI-009 - Verify Profile icon functionality', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.profileIcon).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('profileIcon');
            await headerPage.clickProfile();
            await page.waitForTimeout(2000);
            await ScreenshotHelper(page, screenshotDir, 'H-LI-009-profileIcon', testInfo);
        });

        test('H-LI-010 - Verify Live Chat icon functionality', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.liveChatIcon).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('liveChatIcon');
            await headerPage.clickLiveChat();
            await page.waitForTimeout(3000);
            await ScreenshotHelper(page, screenshotDir, 'H-LI-010-liveChat', testInfo);
        });

        test('H-LI-011 - Verify Header elements remain functional after page refresh', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await page.reload({ waitUntil: 'domcontentloaded' });
            await expect(headerPage.locators.menuButton).toBeVisible({ timeout: 15000 });
            await expect(headerPage.locators.depositCTA).toBeVisible({ timeout: 15000 });
            await expect(headerPage.locators.profileIcon).toBeVisible({ timeout: 15000 });
            await expect(headerPage.locators.notificationIcon).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LI-011-afterRefresh', testInfo);
        });

        test('H-LI-012 - Verify Aviator navigation in logged in state', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('aviator');
            await expect(page).toHaveURL(/\/aviator/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LI-012-navAviator', testInfo);
        });

        test('H-LI-013 - Verify Lucky Numbers navigation redirects correctly', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickNavTab('luckynumbers');
            await expect(page).toHaveURL(/\/luckynumbers/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-LI-013-navLuckyNumbers', testInfo);
        });
    });

    test.describe('Header - Partial Account', () => {

        // NOTE: Fill loginPartial credentials in JackpotCityData.json before running these tests.
        test.beforeEach(async ({ headerPage, testData }) => {
            await headerPage.login(testData.loginPartial.mobile, testData.loginPartial.password);
        });

        test('H-PA-001 - Verify Hamburger menu icon visible and accessible', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.menuButton).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('menuButton');
            await headerPage.clickMenu();
            await ScreenshotHelper(page, screenshotDir, 'H-PA-001-hamburgerMenu', testInfo);
        });

        test('H-PA-002 - Verify JackpotCity logo redirection', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.logoLink).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('logoLink');
            await headerPage.clickLogo();
            await expect(page).toHaveURL(url, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-PA-002-logo', testInfo);
        });

        test('H-PA-003 - Verify sub-header tabs (Home, Promotions, Blog)', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.getNavTab('home')).toBeVisible({ timeout: 15000 });
            await expect(headerPage.getNavTab('Promotions')).toBeVisible({ timeout: 15000 });
            await expect(headerPage.getNavTab('blog')).toBeVisible({ timeout: 15000 });
            await expect(headerPage.getNavTab('spingames')).not.toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-PA-003-subHeaderTabs', testInfo);
        });

        test('H-PA-004 - Verify Search bar functionality', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.searchInput).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('searchInput');
            await headerPage.openSearch();
            await expect(headerPage.locators.searchModal).toBeVisible({ timeout: 15000 });
            await headerPage.typeSearch('hot');
            await expect(headerPage.getSearchResultCard()).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-PA-004-searchResults', testInfo);
        });

        test('H-PA-005 - Verify Complete Your Account prompt visibility and clickability', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.getCompleteAccountPrompt()).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'H-PA-005-completeAccountPrompt', testInfo);
            await headerPage.getCompleteAccountPrompt().click();
            await expect(page).not.toHaveURL(url, { timeout: 15000 });
        });

        test('H-PA-006 - Verify Notification icon functionality', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.notificationIcon).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('notificationIcon');
            await headerPage.clickNotification();
            await page.waitForTimeout(2000);
            await ScreenshotHelper(page, screenshotDir, 'H-PA-006-notification', testInfo);
        });

        test('H-PA-007 - Verify Profile icon functionality', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.profileIcon).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('profileIcon');
            await headerPage.clickProfile();
            await page.waitForTimeout(2000);
            await ScreenshotHelper(page, screenshotDir, 'H-PA-007-profileIcon', testInfo);
        });

        test('H-PA-008 - Verify Live Chat icon functionality', async ({ page, headerPage, screenshotDir }: HeaderNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.liveChatIcon).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('liveChatIcon');
            await headerPage.clickLiveChat();
            await page.waitForTimeout(3000);
            await ScreenshotHelper(page, screenshotDir, 'H-PA-008-liveChat', testInfo);
        });
    });
}
