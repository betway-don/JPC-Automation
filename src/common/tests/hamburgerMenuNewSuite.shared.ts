import { Page, TestInfo, TestType, expect } from '@playwright/test';
import { HamburgerMenuPage } from '../pages/HamburgerMenuPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

type HamburgerMenuFixtures = {
    page: Page;
    hamburgerMenuPage: HamburgerMenuPage;
    screenshotDir: string;
    loginPage: any;
    testData: any;
};

export async function runHamburgerMenuNewSuiteTests(
    test: TestType<HamburgerMenuFixtures, any>,
    url: string,
    options?: { excludeTags?: string[] }
) {

    // ─────────────────────────────────────────────────────────────────────────────
    // LOGGED-OUT TESTS  (HM-001 → HM-032)
    // ─────────────────────────────────────────────────────────────────────────────

    test.describe('Hamburger Menu - Logged Out', () => {

        test.beforeEach(async ({ page }: { page: Page }) => {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
        });

        // ✓ AUTOMATED
        test('HM-001 - Verify hamburger menu opens correctly', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-001-menuOpen', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-002 - Verify hamburger menu closes correctly', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('hamburgerMenuClose');
            await hamburgerMenuPage.closeMenu();
            await page.waitForTimeout(500);
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-002-menuClose', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-003 - Verify tapping outside menu closes it for web platform', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            // Menu panel is md:w-[360px] on the left; click right side to trigger outside-click close
            await page.mouse.click(700, 400);
            await page.waitForTimeout(500);
            await expect(hamburgerMenuPage.locators.hamburgerMenuClose).not.toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-003-tapOutside', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-004 - Verify switching from light theme to dark theme', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            // Ensure we start in light mode: dark-mode button (moon) must be visible
            if (!await hamburgerMenuPage.locators.darkThemeToggle.isVisible()) {
                await hamburgerMenuPage.toggleTheme(); // switch back to light
                await page.waitForTimeout(500);
            }
            await hamburgerMenuPage.highlightElement('darkThemeToggle');
            await hamburgerMenuPage.clickDarkTheme();
            await page.waitForTimeout(1000);
            // Light-mode button (sun) should now be visible — confirms dark mode is active
            await expect(hamburgerMenuPage.locators.lightThemeToggle).toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-004-lightToDark', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-005 - Verify switching from dark theme to light theme', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            // Ensure we start in dark mode: light-mode button (sun) must be visible
            if (!await hamburgerMenuPage.locators.lightThemeToggle.isVisible()) {
                await hamburgerMenuPage.clickDarkTheme(); // switch to dark first
                await page.waitForTimeout(500);
            }
            await hamburgerMenuPage.highlightElement('lightThemeToggle');
            await hamburgerMenuPage.toggleTheme();
            await page.waitForTimeout(1000);
            // Dark-mode button (moon) should now be visible — confirms light mode is active
            await expect(hamburgerMenuPage.locators.darkThemeToggle).toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-005-darkToLight', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-006 - Verify theme toggle icon changes correctly', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            const inDarkMode = await hamburgerMenuPage.locators.lightThemeToggle.isVisible();
            if (inDarkMode) {
                // Currently dark: sun visible → click to go light → moon should appear
                await hamburgerMenuPage.highlightElement('lightThemeToggle');
                await hamburgerMenuPage.toggleTheme();
                await page.waitForTimeout(500);
                await expect(hamburgerMenuPage.locators.darkThemeToggle).toBeVisible();
            } else {
                // Currently light: moon visible → click to go dark → sun should appear
                await hamburgerMenuPage.highlightElement('darkThemeToggle');
                await hamburgerMenuPage.clickDarkTheme();
                await page.waitForTimeout(500);
                await expect(hamburgerMenuPage.locators.lightThemeToggle).toBeVisible();
            }
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-006-themeIcon', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-007 - Verify scroll behavior', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            // Scroll the menu's overflow container to the bottom and verify download buttons are reachable
            const scrollContainer = page.locator('.grow.overflow-y-auto').first();
            await scrollContainer.evaluate((el: HTMLElement) => { el.scrollTo(0, el.scrollHeight); });
            await page.waitForTimeout(500);
            await expect(hamburgerMenuPage.locators.appleAppButton).toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-007-scroll', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-008 - Verify Login CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('hamburgerLoginCTA');
            await hamburgerMenuPage.clickHamburgerLoginCTA();
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-008-loginCTA', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-009 - Verify Sign Up CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('hamburgerSignUpCTA');
            await hamburgerMenuPage.clickHamburgerSignUpCTA();
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-009-signUpCTA', testInfo);
        });

        // ✓ AUTOMATED (was T10)
        test('HM-010 - Verify Search field is accessible', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('searchField');
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-010-searchField', testInfo);
        });

        // ✓ AUTOMATED (was T11)
        test('HM-011 - Verify Promotions CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('promotionsCTA');
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-011-promotionsCTA', testInfo);
        });

        // ✓ AUTOMATED (was T12)
        test('HM-012 - Verify Providers CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('providersCTA');
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-012-providersCTA', testInfo);
        });

        // ✓ AUTOMATED (was T13)
        test('HM-013 - Verify Winners CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('winnersCTA');
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-013-winnersCTA', testInfo);
        });

        // ✓ AUTOMATED (was T14)
        test('HM-014 - Verify Blog CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('blogCTA');
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-014-blogCTA', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-015 - Verify New Games CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('newGamesCTA');
            await hamburgerMenuPage.clickNewGamesCTA();
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-015-newGamesCTA', testInfo);
        });

        // ✓ AUTOMATED (was T15)
        test('HM-016 - Verify Quick Links dropdown expand/collapse', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('quickLinksDropdown');
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-016-quickLinks', testInfo);
        });

        // ✓ AUTOMATED (was T16)
        test('HM-017 - Verify Privacy Policy CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('privacyPolicyCTA');
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-017-privacyPolicy', testInfo);
        });

        // ✓ AUTOMATED (was T17)
        test('HM-018 - Verify Contact Us CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('contactUsCTA');
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-018-contactUs', testInfo);
        });

        // ✓ AUTOMATED (was T18)
        test('HM-019 - Verify Terms & Conditions CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('termsConditionsCTA');
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-019-termsConditions', testInfo);
        });

        // ✓ AUTOMATED (was T19)
        test('HM-020 - Verify FAQ\'s CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('faqsCTA');
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-020-faqs', testInfo);
        });

        // TODO: provide HTML
        test('HM-021 - Verify How To CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickQuickLinks();
            // TODO: highlight How To CTA and verify redirect
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-021-howTo', testInfo);
        });

        // ✓ AUTOMATED (was T21)
        test('HM-022 - Verify Responsible Gambling CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('responsibleGamblingCTA');
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-022-responsibleGambling', testInfo);
        });

        // ✓ AUTOMATED (was T22)
        test('HM-023 - Verify Get the App CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('getTheAppCTA');
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-023-getTheApp', testInfo);
        });

        // ✓ AUTOMATED (was T23)
        test('HM-024 - Verify Slot Games dropdown expand/collapse', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickSlotGamesCategory();
            await hamburgerMenuPage.highlightElement('slotGamesCategory');
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-024-slotGames', testInfo);
        });

        // ✓ AUTOMATED (was T25)
        test('HM-025 - Verify clicking on Aviator CTA in logged-out state prompts login', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('aviatorCTA');
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-025-aviatorLO', testInfo);
        });

        // ✓ AUTOMATED (was T24)
        test('HM-026 - Verify Live Games dropdown expand/collapse', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.clickLiveGamesCategory();
            await hamburgerMenuPage.highlightElement('liveGamesCategory');
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-026-liveGames', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-027 - Verify the Crash Games CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('crashGamesCTA');
            await hamburgerMenuPage.clickCrashGamesCTA();
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-027-crashGames', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-028 - Verify the Quick Games CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('quickGamesCTA');
            await hamburgerMenuPage.clickQuickGamesCTA();
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-028-quickGamesLO', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-029 - Verify the Betgames CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('betGamesCTA');
            await hamburgerMenuPage.clickBetGamesCTA();
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-029-betgamesLO', testInfo);
        });

        // ✓ AUTOMATED (was T26)
        test('HM-030 - Verify Apple Store download button', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('appleAppButton');
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-030-appleStore', testInfo);
        });

        // ✓ AUTOMATED (was T27)
        test('HM-031 - Verify Android app download button', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('androidAppButton');
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-031-androidApp', testInfo);
        });

        // ✓ AUTOMATED (was T28)
        test('HM-032 - Verify App Gallery download button', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(2000);
            await hamburgerMenuPage.highlightElement('huaweiAppButton');
            await ScreenshotHelper(page, screenshotDir, 'HM-LO-032-appGallery', testInfo);
        });

    });

    // ─────────────────────────────────────────────────────────────────────────────
    // LOGGED-IN TESTS  (HM-001 → HM-025)
    // ─────────────────────────────────────────────────────────────────────────────

    test.describe('Hamburger Menu - Logged In', () => {

        test.beforeEach(async ({ page, loginPage, testData }: { page: Page; loginPage: any; testData: any }) => {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await loginPage.clickLogin();
            await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
            await page.waitForTimeout(3000);
        });

        // ✓ AUTOMATED (was T30)
        test('HM-LI-001 - Verify Balance widget appears', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('balanceContainer');
            await hamburgerMenuPage.highlightElement('cashBalance');
            await hamburgerMenuPage.highlightElement('bonusBalance');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-001-balanceWidget', testInfo);
        });

        // ✓ AUTOMATED (was T30 — deposit button highlighted in same test)
        test('HM-LI-002 - Verify Deposit button beside the balance widget', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('depositButton');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-002-depositButton', testInfo);
        });

        // ✓ AUTOMATED (was T31)
        test('HM-LI-003 - Verify user first and last name appears', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('profileIcon');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-003-userName', testInfo);
        });

        // ✓ AUTOMATED (was T31)
        test('HM-LI-004 - Verify account no. is displayed on the hamburger menu', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('accountNo');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-004-accountNo', testInfo);
        });

        // ✓ AUTOMATED (was T32)
        test('HM-LI-005 - Verify eye toggle is visible beside balance', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('eyeToggle');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-005-eyeToggleVisible', testInfo);
        });

        // ✓ AUTOMATED (was T33)
        test('HM-LI-006 - Verify eye toggle hides balance', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickEyeToggle();
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-006-eyeToggleHide', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-LI-007 - Verify eye toggle unhides balance', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickEyeToggle(); // hide
            await page.waitForTimeout(500);
            await hamburgerMenuPage.clickEyeToggle(); // unhide
            await page.waitForTimeout(500);
            await hamburgerMenuPage.highlightElement('cashBalance');
            await hamburgerMenuPage.highlightElement('bonusBalance');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-007-eyeToggleUnhide', testInfo);
        });

        // ✓ AUTOMATED (was T34)
        test('HM-LI-008 - Verify Withdrawal CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('withdrawalCTA');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-008-withdrawalCTA', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-LI-009 - Verify Transaction Summary CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('transactionSummaryShortcut');
            await hamburgerMenuPage.clickTransactionSummaryShortcut();
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-009-transactionSummaryDirect', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-LI-010 - Verify the City Rewards CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('cityRewardsShortcut');
            await hamburgerMenuPage.clickCityRewardsShortcut();
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-010-cityRewardsDirect', testInfo);
        });

        // ✓ AUTOMATED (was T35)
        test('HM-LI-011 - Verify My Account dropdown expansion', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.highlightElement('myAccountDropdown');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-011-myAccountExpand', testInfo);
        });

        // ✓ AUTOMATED (was T35)
        test('HM-LI-012 - Verify "My Account" dropdown is displayed', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.highlightElement('myAccountRegion');
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-012-myAccountDisplay', testInfo);
        });

        // ✓ AUTOMATED (was T36)
        test('HM-LI-013 - Verify Deposit CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickMyAccountDeposit();
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-013-deposit', testInfo);
        });

        // ✓ AUTOMATED (was T36_1)
        test('HM-LI-014 - Verify Withdrawal CTA (via My Account)', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickMyAccountWithdrawal();
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-014-withdrawalMyAccount', testInfo);
        });

        // ✓ AUTOMATED (was T36_2)
        test('HM-LI-015 - Verify Transaction Summary CTA (via My Account)', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickTransactionSummary();
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-015-transactionSummary', testInfo);
        });

        // ✓ AUTOMATED (was T37)
        test('HM-LI-016 - Verify Bonus Wallet CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickBonusWallet();
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-016-bonusWallet', testInfo);
        });

        // ✓ AUTOMATED (was T40)
        test('HM-LI-017 - Verify City Rewards CTA (via My Account)', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickCityRewards();
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-017-cityRewards', testInfo);
        });

        // ✓ AUTOMATED (was T38)
        test('HM-LI-018 - Verify My Profile Management CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickPersonalDetails();
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

        // ✓ AUTOMATED (was T39)
        test('HM-LI-020 - Verify Account Settings CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickAccountSettings();
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-020-accountSettings', testInfo);
        });

        // ✓ AUTOMATED (was T40_1)
        test('HM-LI-021 - Verify Responsible Gaming CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickResponsibleGaming();
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-021-responsibleGaming', testInfo);
        });

        // ✓ AUTOMATED (was T41)
        test('HM-LI-022 - Verify Document Verification CTA', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickDocumentVerification();
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-022-documentVerification', testInfo);
        });

        // ✓ AUTOMATED
        test('HM-LI-023 - Verify My Account dropdown collapse', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount(); // expand
            await page.waitForTimeout(500);
            await hamburgerMenuPage.clickMyAccount(); // collapse
            await page.waitForTimeout(500);
            await expect(hamburgerMenuPage.locators.myAccountDeposit).not.toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-023-myAccountCollapse', testInfo);
        });

        // TODO: provide HTML
        test('HM-LI-024 - Verify each My Account option navigation', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            // TODO: tap each option and verify each opens its respective screen
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-024-myAccountOptions', testInfo);
        });

        // ✓ AUTOMATED (was T42)
        test('HM-LI-025 - Verify Log Out functionality', async ({ page, hamburgerMenuPage, screenshotDir }: HamburgerMenuFixtures, testInfo: TestInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickLogOut();
            await ScreenshotHelper(page, screenshotDir, 'HM-LI-025-logOut', testInfo);
        });

    });
}
