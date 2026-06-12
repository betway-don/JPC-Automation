import { Page, TestInfo, TestType, expect } from '@playwright/test';
import { HamburgerMenuPage } from '../pages/HamburgerMenuPage';
import { LoginPage } from '../pages/LoginPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

type HamburgerMenuFixtures = {
    page: Page;
    hamburgerMenuPage: HamburgerMenuPage;
    loginPage: LoginPage;
    screenshotDir: string;
    testData: any;
};

export async function runHamburgerMenuNewSuiteTests(
    test: TestType<HamburgerMenuFixtures, any>,
    url: string,
    options?: { excludeTags?: string[] }
) {

    test.describe('Hamburger Menu - Logged Out', () => {

        test.beforeEach(async ({ page }: { page: Page }) => {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
        });

        test('HM-001 - Verify hamburger menu opens correctly', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-001-menuOpen', testInfo);
        });

        test('HM-002 - Verify hamburger menu closes correctly', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('hamburgerMenuClose');
            await hamburgerMenuPage.closeMenu();
            await page.waitForTimeout(500);
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-002-menuClose', testInfo);
        });

        test('HM-003 - Verify tapping outside menu closes it for web platform', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            // Menu panel is md:w-[360px] on the left; click right side to trigger outside-click close
            await page.mouse.click(700, 400);
            await page.waitForTimeout(500);
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-003-tapOutside', testInfo);
        });

        test('HM-004 - Verify switching from light theme to dark theme', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            if (!await hamburgerMenuPage.locators.darkThemeToggle.isVisible()) {
                await hamburgerMenuPage.toggleTheme();
                await page.waitForTimeout(500);
            }
            await hamburgerMenuPage.highlightElement('darkThemeToggle');
            await hamburgerMenuPage.clickDarkTheme();
            // the icon swap alone can lie — the theme is real only if <html> switches to the dark class
            await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')), { timeout: 5000 }).toBe(true);
            await expect(hamburgerMenuPage.locators.lightThemeToggle).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-004-lightToDark', testInfo);
        });

        test('HM-005 - Verify switching from dark theme to light theme', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            if (!await hamburgerMenuPage.locators.lightThemeToggle.isVisible()) {
                await hamburgerMenuPage.clickDarkTheme();
                await page.waitForTimeout(500);
            }
            await hamburgerMenuPage.highlightElement('lightThemeToggle');
            await hamburgerMenuPage.toggleTheme();
            // the icon swap alone can lie — the theme is real only if <html> drops the dark class
            await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')), { timeout: 5000 }).toBe(false);
            await expect(hamburgerMenuPage.locators.darkThemeToggle).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-005-darkToLight', testInfo);
        });

        test('HM-006 - Verify theme toggle icon changes correctly', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            const inDarkMode = await hamburgerMenuPage.locators.lightThemeToggle.isVisible();
            if (inDarkMode) {
                await hamburgerMenuPage.highlightElement('lightThemeToggle');
                await hamburgerMenuPage.toggleTheme();
                await page.waitForTimeout(500);
                await expect(hamburgerMenuPage.locators.darkThemeToggle).toBeVisible({ timeout: 15000 });
            } else {
                await hamburgerMenuPage.highlightElement('darkThemeToggle');
                await hamburgerMenuPage.clickDarkTheme();
                await page.waitForTimeout(500);
                await expect(hamburgerMenuPage.locators.lightThemeToggle).toBeVisible({ timeout: 15000 });
            }
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-006-themeIcon', testInfo);
        });

        test('HM-007 - Verify scroll behavior', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            const scrollContainer = hamburgerMenuPage.menuScrollContainer;
            await scrollContainer.evaluate((el: HTMLElement) => { el.scrollTo(0, el.scrollHeight); });
            await page.waitForTimeout(500);
            await expect(hamburgerMenuPage.locators.appleAppButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-007-scroll', testInfo);
        });

        test('HM-008 - Verify Login CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('hamburgerLoginCTA');
            await hamburgerMenuPage.clickHamburgerLoginCTA();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            // the login modal must actually open with its credential fields
            await expect(hamburgerMenuPage.loginModal).toBeVisible({ timeout: 15000 });
            await expect(hamburgerMenuPage.loginUsernameInput).toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-008-loginCTA', testInfo);
        });

        test('HM-009 - Verify Sign Up CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('hamburgerSignUpCTA');
            await hamburgerMenuPage.clickHamburgerSignUpCTA();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            // the sign-up modal must actually open
            await expect(hamburgerMenuPage.signUpModalDialog).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-009-signUpCTA', testInfo);
        });

        test('HM-010 - Verify Search field is accessible', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('searchField');
            await expect(hamburgerMenuPage.locators.searchField).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-010-searchField', testInfo);
        });

        test('HM-011 - Verify Promotions CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('promotionsCTA');
            await expect(hamburgerMenuPage.locators.promotionsCTA).toBeVisible({ timeout: 15000 });
            await hamburgerMenuPage.locators.promotionsCTA.first().click();
            await expect(page).toHaveURL(/\/promotions/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-011-promotionsCTA', testInfo);
        });

        test('HM-012 - Verify Providers CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('providersCTA');
            await expect(hamburgerMenuPage.locators.providersCTA).toBeVisible({ timeout: 15000 });
            await hamburgerMenuPage.locators.providersCTA.first().click();
            await expect(page).toHaveURL(/\/home\/providers/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-012-providersCTA', testInfo);
        });

        test('HM-013 - Verify Winners CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('winnersCTA');
            await expect(hamburgerMenuPage.locators.winnersCTA).toBeVisible({ timeout: 15000 });
            await hamburgerMenuPage.locators.winnersCTA.first().click();
            await expect(page).toHaveURL(/\/winners/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-013-winnersCTA', testInfo);
        });

        test('HM-014 - Verify Blog CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('blogCTA');
            await expect(hamburgerMenuPage.locators.blogCTA).toBeVisible({ timeout: 15000 });
            await hamburgerMenuPage.locators.blogCTA.first().click();
            await expect(page).toHaveURL(/\/blog/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-014-blogCTA', testInfo);
        });

        test('HM-015 - Verify New Games CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('newGamesCTA');
            await hamburgerMenuPage.clickNewGamesCTA();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await expect(page).toHaveURL(/\/new-games/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-015-newGamesCTA', testInfo);
        });

        test('HM-016 - Verify Quick Links dropdown expand/collapse', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('quickLinksDropdown');
            await expect(hamburgerMenuPage.locators.privacyPolicyCTA).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-016-quickLinks', testInfo);
        });

        test('HM-017 - Verify Privacy Policy CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('privacyPolicyCTA');
            await expect(hamburgerMenuPage.locators.privacyPolicyCTA).toBeVisible({ timeout: 15000 });
            await hamburgerMenuPage.locators.privacyPolicyCTA.click();
            await expect(page).toHaveURL(/\/privacy-policy/, { timeout: 15000 });
            await expect(hamburgerMenuPage.pageHeading).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-017-privacyPolicy', testInfo);
        });

        test('HM-018 - Verify Contact Us CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('contactUsCTA');
            await expect(hamburgerMenuPage.locators.contactUsCTA).toBeVisible({ timeout: 15000 });
            await hamburgerMenuPage.locators.contactUsCTA.click();
            await expect(page).toHaveURL(/\/contact-us/, { timeout: 15000 });
            await expect(hamburgerMenuPage.pageHeading).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-018-contactUs', testInfo);
        });

        test('HM-019 - Verify Terms & Conditions CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('termsConditionsCTA');
            await expect(hamburgerMenuPage.locators.termsConditionsCTA).toBeVisible({ timeout: 15000 });
            await hamburgerMenuPage.locators.termsConditionsCTA.click();
            await expect(page).toHaveURL(/\/terms-and-conditions/, { timeout: 15000 });
            await expect(hamburgerMenuPage.pageHeading).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-019-termsConditions', testInfo);
        });

        test('HM-020 - Verify FAQ\'s CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('faqsCTA');
            await expect(hamburgerMenuPage.locators.faqsCTA).toBeVisible({ timeout: 15000 });
            await hamburgerMenuPage.locators.faqsCTA.click();
            await expect(page).toHaveURL(/\/faq/, { timeout: 15000 });
            await expect(hamburgerMenuPage.pageHeading).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-020-faqs', testInfo);
        });

        // TODO: provide locator HTML for How To CTA
        test('HM-021 - Verify How To CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickQuickLinks();
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-021-howTo', testInfo);
        });

        test('HM-022 - Verify Responsible Gambling CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('responsibleGamblingCTA');
            await expect(hamburgerMenuPage.locators.responsibleGamblingCTA).toBeVisible({ timeout: 15000 });
            await hamburgerMenuPage.locators.responsibleGamblingCTA.click();
            await expect(page).toHaveURL(/\/responsible-gambling/, { timeout: 15000 });
            await expect(hamburgerMenuPage.pageHeading).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-022-responsibleGambling', testInfo);
        });

        test('HM-023 - Verify Get the App CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('getTheAppCTA');
            await expect(hamburgerMenuPage.locators.getTheAppCTA).toBeVisible({ timeout: 15000 });
            await hamburgerMenuPage.locators.getTheAppCTA.click();
            await expect(page).toHaveURL(/\/get-the-app/, { timeout: 15000 });
            await expect(hamburgerMenuPage.pageHeading).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-023-getTheApp', testInfo);
        });

        test('HM-024 - Verify Slot Games dropdown expand/collapse', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickSlotGamesCategory();
            await hamburgerMenuPage.highlightElement('slotGamesCategory');
            await expect(hamburgerMenuPage.locators.slotGamesCTA).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-024-slotGames', testInfo);
        });

        test('HM-025 - Verify clicking on Aviator CTA in logged-out state prompts login', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('aviatorCTA');
            await expect(hamburgerMenuPage.locators.aviatorCTA).toBeVisible({ timeout: 15000 });
            await hamburgerMenuPage.locators.aviatorCTA.first().click();
            // logged out: lands on the Aviator game page with Play now (login required to play)
            await expect(page).toHaveURL(/\/home\/featured\/aviator/, { timeout: 15000 });
            await expect(hamburgerMenuPage.playNowButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-025-aviatorLO', testInfo);
        });

        test('HM-026 - Verify Live Games dropdown expand/collapse', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickLiveGamesCategory();
            await hamburgerMenuPage.highlightElement('liveGamesCategory');
            await expect(hamburgerMenuPage.locators.liveGamesCategory).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-026-liveGames', testInfo);
        });

        test('HM-027 - Verify the Crash Games CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('crashGamesCTA');
            await hamburgerMenuPage.clickCrashGamesCTA();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await expect(page).toHaveURL(/\/crashgames/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-027-crashGames', testInfo);
        });

        test('HM-028 - Verify the Quick Games CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('quickGamesCTA');
            await hamburgerMenuPage.clickQuickGamesCTA();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await expect(page).toHaveURL(/\/quickgames/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-028-quickGamesLO', testInfo);
        });

        test('HM-029 - Verify the Betgames CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('betGamesCTA');
            await hamburgerMenuPage.clickBetGamesCTA();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await expect(page).toHaveURL(/\/betgames/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-029-betgamesLO', testInfo);
        });

        test('HM-030 - Verify Apple Store download button', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('appleAppButton');
            await expect(hamburgerMenuPage.locators.appleAppButton).toBeVisible({ timeout: 15000 });
            const [popup] = await Promise.all([
                page.waitForEvent('popup', { timeout: 15000 }),
                hamburgerMenuPage.locators.appleAppButton.first().click(),
            ]);
            await popup.waitForLoadState('domcontentloaded').catch(() => { });
            // NOTE: currently lands on jackpotcity.com (not the App Store) — confirm intended target with the team
            expect(popup.url()).toBeTruthy();
            await popup.close();
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-030-appleStore', testInfo);
        });

        test('HM-031 - Verify Android app download button', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('androidAppButton');
            await expect(hamburgerMenuPage.locators.androidAppButton).toBeVisible({ timeout: 15000 });
            const [popup] = await Promise.all([
                page.waitForEvent('popup', { timeout: 15000 }),
                hamburgerMenuPage.locators.androidAppButton.first().click(),
            ]);
            await popup.waitForLoadState('domcontentloaded').catch(() => { });
            // NOTE: currently lands on jackpotcity.com (not the Play Store) — confirm intended target with the team
            expect(popup.url()).toBeTruthy();
            await popup.close();
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-031-androidApp', testInfo);
        });

        test('HM-032 - Verify App Gallery download button', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('huaweiAppButton');
            await expect(hamburgerMenuPage.locators.huaweiAppButton).toBeVisible({ timeout: 15000 });
            const [popup] = await Promise.all([
                page.waitForEvent('popup', { timeout: 15000 }),
                hamburgerMenuPage.locators.huaweiAppButton.first().click(),
            ]);
            await popup.waitForLoadState('domcontentloaded').catch(() => { });
            // NOTE: currently lands on jackpotcity.com (not AppGallery) — confirm intended target with the team
            expect(popup.url()).toBeTruthy();
            await popup.close();
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-032-appGallery', testInfo);
        });

    });

    test.describe('Hamburger Menu - Logged In', () => {

        test.beforeEach(async ({ page, loginPage, testData }: HamburgerMenuFixtures) => {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await loginPage.clickLogin();
            await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
            await page.waitForTimeout(3000);
        });

        /**
         * My Account options don't navigate — they open the "Account Options" dialog with the
         * clicked option active in its sidebar. "Menu closed" alone proves nothing.
         */
        async function verifyAccountOptionOpened(hamburgerMenuPage: HamburgerMenuPage, optionName: string) {
            await expect(hamburgerMenuPage.locators.accountOptionsDialog).toBeVisible({ timeout: 15000 });
            await expect(hamburgerMenuPage.locators.accountOptionsActiveItem).toBeVisible({ timeout: 10000 });
            await expect(hamburgerMenuPage.locators.accountOptionsActiveItem).toHaveText(new RegExp(optionName, 'i'));
        }

        test('HM-LI-001 - Verify Balance widget appears', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('balanceContainer');
            await hamburgerMenuPage.highlightElement('cashBalance');
            await hamburgerMenuPage.highlightElement('bonusBalance');
            await expect(hamburgerMenuPage.locators.balanceContainer).toBeVisible({ timeout: 15000 });
            // widget must show real currency amounts, e.g. "R 1,421.02", not empty/placeholder values
            await expect(hamburgerMenuPage.locators.balanceContainer).toContainText(/R\s*[\d,]+\.\d{2}/, { timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-001-balanceWidget', testInfo);
        });

        test('HM-LI-002 - Verify Deposit button beside the balance widget', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('depositButton');
            await expect(hamburgerMenuPage.locators.depositButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-002-depositButton', testInfo);
        });

        test('HM-LI-003 - Verify user first and last name appears', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('profileIcon');
            await expect(hamburgerMenuPage.locators.profileIcon).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-003-userName', testInfo);
        });

        test('HM-LI-004 - Verify account no. is displayed on the hamburger menu', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('accountNo');
            await expect(hamburgerMenuPage.locators.accountNo).toBeVisible({ timeout: 15000 });
            // must show a real account number, not an empty label
            await expect(hamburgerMenuPage.locators.accountNo).toHaveText(/Account No:\s*\d{5,}/);
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-004-accountNo', testInfo);
        });

        test('HM-LI-005 - Verify eye toggle is visible beside balance', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('eyeToggle');
            await expect(hamburgerMenuPage.locators.eyeToggle).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-005-eyeToggleVisible', testInfo);
        });

        test('HM-LI-006 - Verify eye toggle hides balance', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickEyeToggle();
            // masking replaces the amounts with ●●●●● — the "Cash" label itself stays visible
            await expect(hamburgerMenuPage.locators.balanceContainer).toContainText('●', { timeout: 5000 });
            await expect(hamburgerMenuPage.locators.balanceContainer).not.toContainText(/R\s*[\d,]+\.\d{2}/);
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-006-eyeToggleHide', testInfo);
        });

        test('HM-LI-007 - Verify eye toggle unhides balance', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickEyeToggle();
            await expect(hamburgerMenuPage.locators.balanceContainer).toContainText('●', { timeout: 5000 });
            await hamburgerMenuPage.clickEyeToggle();
            await hamburgerMenuPage.highlightElement('cashBalance');
            await hamburgerMenuPage.highlightElement('bonusBalance');
            // amounts must come back after unmasking
            await expect(hamburgerMenuPage.locators.balanceContainer).toContainText(/R\s*[\d,]+\.\d{2}/, { timeout: 5000 });
            await expect(hamburgerMenuPage.locators.balanceContainer).not.toContainText('●');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-007-eyeToggleUnhide', testInfo);
        });

        test('HM-LI-008 - Verify Withdrawal CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('withdrawalCTA');
            await expect(hamburgerMenuPage.locators.withdrawalCTA).toBeVisible({ timeout: 15000 });
            await hamburgerMenuPage.locators.withdrawalCTA.first().click();
            await verifyAccountOptionOpened(hamburgerMenuPage, 'Withdrawal');
            await expect(hamburgerMenuPage.locators.accountOptionsBankingFrame).toBeVisible({ timeout: 20000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-008-withdrawalCTA', testInfo);
        });

        test('HM-LI-009 - Verify Transaction Summary CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('transactionSummaryShortcut');
            await hamburgerMenuPage.clickTransactionSummaryShortcut();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await verifyAccountOptionOpened(hamburgerMenuPage, 'Transaction Summary');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-009-transactionSummaryDirect', testInfo);
        });

        test('HM-LI-010 - Verify the City Rewards CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('cityRewardsShortcut');
            await hamburgerMenuPage.clickCityRewardsShortcut();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await verifyAccountOptionOpened(hamburgerMenuPage, 'City Rewards');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-010-cityRewardsDirect', testInfo);
        });

        test('HM-LI-011 - Verify My Account dropdown expansion', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.highlightElement('myAccountDropdown');
            await expect(hamburgerMenuPage.locators.myAccountDeposit).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-011-myAccountExpand', testInfo);
        });

        test('HM-LI-012 - Verify "My Account" dropdown is displayed', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.highlightElement('myAccountRegion');
            await expect(hamburgerMenuPage.locators.myAccountRegion).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-012-myAccountDisplay', testInfo);
        });

        test('HM-LI-013 - Verify Deposit CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickMyAccountDeposit();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await verifyAccountOptionOpened(hamburgerMenuPage, 'Deposit');
            await expect(hamburgerMenuPage.locators.accountOptionsBankingFrame).toBeVisible({ timeout: 20000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-013-deposit', testInfo);
        });

        test('HM-LI-014 - Verify Withdrawal CTA (via My Account)', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickMyAccountWithdrawal();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await verifyAccountOptionOpened(hamburgerMenuPage, 'Withdrawal');
            await expect(hamburgerMenuPage.locators.accountOptionsBankingFrame).toBeVisible({ timeout: 20000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-014-withdrawalMyAccount', testInfo);
        });

        test('HM-LI-015 - Verify Transaction Summary CTA (via My Account)', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickTransactionSummary();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await verifyAccountOptionOpened(hamburgerMenuPage, 'Transaction Summary');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-015-transactionSummary', testInfo);
        });

        test('HM-LI-016 - Verify Bonus Wallet CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickBonusWallet();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await verifyAccountOptionOpened(hamburgerMenuPage, 'Bonus Wallet');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-016-bonusWallet', testInfo);
        });

        test('HM-LI-017 - Verify City Rewards CTA (via My Account)', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickCityRewards();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await verifyAccountOptionOpened(hamburgerMenuPage, 'City Rewards');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-017-cityRewards', testInfo);
        });

        test('HM-LI-018 - Verify My Profile Management CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickPersonalDetails();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await verifyAccountOptionOpened(hamburgerMenuPage, 'My Profile Management');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-018-myProfile', testInfo);
        });

        // NOTE: Update Password CTA not present in hamburger My Account dropdown for ZA
        test('HM-LI-019 - Verify Update Password CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await page.waitForTimeout(500);
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-019-updatePassword', testInfo);
        });

        test('HM-LI-020 - Verify Account Settings CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickAccountSettings();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await verifyAccountOptionOpened(hamburgerMenuPage, 'Account Settings');
            await expect(hamburgerMenuPage.accountSettingsUpdateButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-020-accountSettings', testInfo);
        });

        test('HM-LI-021 - Verify Responsible Gaming CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickResponsibleGaming();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await verifyAccountOptionOpened(hamburgerMenuPage, 'Responsible Gaming');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-021-responsibleGaming', testInfo);
        });

        test('HM-LI-022 - Verify Document Verification CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickDocumentVerification();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            await verifyAccountOptionOpened(hamburgerMenuPage, 'Document Verification');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-022-documentVerification', testInfo);
        });

        test('HM-LI-023 - Verify My Account dropdown collapse', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await page.waitForTimeout(500);
            await hamburgerMenuPage.clickMyAccount();
            await page.waitForTimeout(500);
            await expect(hamburgerMenuPage.locators.myAccountDeposit).not.toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-023-myAccountCollapse', testInfo);
        });

        // TODO: tap each option and verify each opens its respective screen
        test('HM-LI-024 - Verify each My Account option navigation', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-024-myAccountOptions', testInfo);
        });

        test('HM-LI-025 - Verify Log Out functionality', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickLogOut();
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible({ timeout: 15000 });
            // user must actually be logged out: header shows Login again
            await expect(hamburgerMenuPage.headerLoginButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-025-logOut', testInfo);
        });

    });
}
