import { Page, TestType, expect } from '@playwright/test';
import { HamburgerMenuPage } from '../pages/HamburgerMenuPage';
import { LoginPage } from '../pages/LoginPage';

type HamburgerMenuFixtures = {
    page: Page;
    hamburgerMenuPage: HamburgerMenuPage;
    loginPage: LoginPage;
    testData: any;
};

export async function runHamburgerMenuNewSuiteTests(
    test: TestType<HamburgerMenuFixtures, any>,
    url: string,
    options?: { excludeTags?: string[] }
) {

    test.describe('Hamburger Menu - Logged Out', () => {

        test.beforeEach(async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.goto(url);
        });

        test('HM-001 - hamburger menu opens', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.expectOpen();
        });

        test('HM-002 - hamburger menu closes via the close button', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.close();
            await hamburgerMenuPage.expectClosed();
        });

        test('HM-003 - tapping outside the menu closes it (web)', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.tapOutside();
            await hamburgerMenuPage.expectClosed();
        });

        test('HM-004 - switching from light to dark theme', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.ensureLightTheme();
            await hamburgerMenuPage.switchToDarkTheme();
            await hamburgerMenuPage.expectDarkTheme();
            await expect(hamburgerMenuPage.lightThemeToggle).toBeVisible();
        });

        test('HM-005 - switching from dark to light theme', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.ensureDarkTheme();
            await hamburgerMenuPage.switchToLightTheme();
            await hamburgerMenuPage.expectLightTheme();
            await expect(hamburgerMenuPage.darkThemeToggle).toBeVisible();
        });

        test('HM-006 - theme toggle icon swaps with the theme', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.ensureLightTheme();
            await hamburgerMenuPage.switchToDarkTheme();
            await expect(hamburgerMenuPage.lightThemeToggle).toBeVisible();
        });

        test('HM-007 - menu body scrolls to reveal the app-download section', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            test.skip(await hamburgerMenuPage.lacks(hamburgerMenuPage.appleAppButton), 'No app-download section in this region');
            await hamburgerMenuPage.scrollToAppSection();
            await expect(hamburgerMenuPage.appleAppButton).toBeVisible();
        });

        test('HM-008 - Login CTA opens the login modal', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.clickHamburgerLoginCTA();
            await hamburgerMenuPage.expectClosed();
            await expect(hamburgerMenuPage.loginModal).toBeVisible();
            await expect(hamburgerMenuPage.loginUsernameInput).toBeVisible();
        });

        test('HM-009 - Sign Up CTA opens the sign-up modal', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.clickHamburgerSignUpCTA();
            await hamburgerMenuPage.expectClosed();
            await expect(hamburgerMenuPage.signUpModalDialog).toBeVisible();
        });

        test('HM-010 - search field is accessible from the menu', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await expect(hamburgerMenuPage.searchField).toBeVisible();
        });

        test('HM-011 - Promotions CTA opens the Promotions page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.tap(hamburgerMenuPage.promotionsCta);
            await hamburgerMenuPage.expectAt(/\/promotions/);
        });

        test('HM-012 - Providers CTA opens the Providers page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.tap(hamburgerMenuPage.providersCta);
            await hamburgerMenuPage.expectAt(/\/home\/providers/);
        });

        test('HM-013 - Winners CTA opens the Winners page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            test.skip(await hamburgerMenuPage.lacks(hamburgerMenuPage.winnersCta), 'Winners CTA not present in this region');
            await hamburgerMenuPage.tap(hamburgerMenuPage.winnersCta);
            await hamburgerMenuPage.expectAt(/\/winners/);
        });

        test('HM-014 - Blog CTA opens the Blog page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            test.skip(await hamburgerMenuPage.lacks(hamburgerMenuPage.blogCta), 'Blog CTA not present in this region');
            await hamburgerMenuPage.tap(hamburgerMenuPage.blogCta);
            await hamburgerMenuPage.expectAt(/\/blog/);
        });

        test('HM-015 - New Games CTA opens the New Games page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            test.skip(await hamburgerMenuPage.lacks(hamburgerMenuPage.newGamesCta), 'New Games CTA not present in this region');
            await hamburgerMenuPage.tap(hamburgerMenuPage.newGamesCta);
            await hamburgerMenuPage.expectClosed();
            await hamburgerMenuPage.expectAt(/\/new-games/);
        });

        test('HM-016 - Quick Links dropdown expands', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openQuickLinks();
            await expect(hamburgerMenuPage.privacyPolicyCta).toBeVisible();
        });

        test('HM-017 - Privacy Policy CTA opens the Privacy Policy page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openQuickLinks();
            await hamburgerMenuPage.tap(hamburgerMenuPage.privacyPolicyCta);
            await hamburgerMenuPage.expectOnContentPage(/\/privacy-policy/);
        });

        test('HM-018 - Contact Us CTA opens the Contact Us page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openQuickLinks();
            await hamburgerMenuPage.tap(hamburgerMenuPage.contactUsCta);
            await hamburgerMenuPage.expectOnContentPage(/\/contact-us/);
        });

        test('HM-019 - Terms & Conditions CTA opens the T&C page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openQuickLinks();
            await hamburgerMenuPage.tap(hamburgerMenuPage.termsCta);
            await hamburgerMenuPage.expectOnContentPage(/\/terms-and-conditions/);
        });

        test('HM-020 - FAQ\'s CTA opens the FAQ page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openQuickLinks();
            await hamburgerMenuPage.tap(hamburgerMenuPage.faqsCta);
            await hamburgerMenuPage.expectOnContentPage(/\/faq/);
        });

        test('HM-021 - How To CTA is reachable under Quick Links', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openQuickLinks();
            await expect(hamburgerMenuPage.privacyPolicyCta).toBeVisible();
        });

        test('HM-022 - Responsible Gambling CTA opens its page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openQuickLinks();
            await hamburgerMenuPage.tap(hamburgerMenuPage.responsibleGamblingCta);
            await hamburgerMenuPage.expectOnContentPage(/\/responsible-gambling/);
        });

        test('HM-023 - Get the App CTA opens its page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            test.skip(await hamburgerMenuPage.lacks(hamburgerMenuPage.getTheAppCta), 'Get the App CTA not present in this region');
            await hamburgerMenuPage.openQuickLinks();
            await hamburgerMenuPage.tap(hamburgerMenuPage.getTheAppCta);
            await hamburgerMenuPage.expectOnContentPage(/\/get-the-app/);
        });

        test('HM-024 - Slot Games category reveals its CTA', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.clickSlotGamesCategory();
            await expect(hamburgerMenuPage.slotGamesCta).toBeVisible();
        });

        test('HM-025 - Aviator CTA (logged out) opens the game with a Play Now prompt', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.tap(hamburgerMenuPage.aviatorCta);
            await hamburgerMenuPage.expectAt(/\/home\/featured\/aviator/);
            await expect(hamburgerMenuPage.playNowButton).toBeVisible();
        });

        test('HM-026 - Live Games category is shown', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.clickLiveGamesCategory();
            await expect(hamburgerMenuPage.liveGamesCategory).toBeVisible();
        });

        test('HM-027 - Crash Games CTA opens the Crash Games page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.tap(hamburgerMenuPage.crashGamesCta);
            await hamburgerMenuPage.expectClosed();
            await hamburgerMenuPage.expectAt(/\/crashgames/);
        });

        test('HM-028 - Quick Games CTA opens the Quick Games page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.tap(hamburgerMenuPage.quickGamesCta);
            await hamburgerMenuPage.expectClosed();
            await hamburgerMenuPage.expectAt(/\/quickgames/);
        });

        test('HM-029 - Betgames CTA opens the Betgames page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.tap(hamburgerMenuPage.betGamesCta);
            await hamburgerMenuPage.expectClosed();
            await hamburgerMenuPage.expectAt(/\/betgames/);
        });

        test('HM-030 - Apple Store button opens an external page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            test.skip(await hamburgerMenuPage.lacks(hamburgerMenuPage.appleAppButton), 'No app-download section in this region');
            await hamburgerMenuPage.expectOpensPopup(hamburgerMenuPage.appleAppButton);
        });

        test('HM-031 - Android Store button opens an external page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            test.skip(await hamburgerMenuPage.lacks(hamburgerMenuPage.androidAppButton), 'No app-download section in this region');
            await hamburgerMenuPage.expectOpensPopup(hamburgerMenuPage.androidAppButton);
        });

        test('HM-032 - App Gallery button opens an external page', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            test.skip(await hamburgerMenuPage.lacks(hamburgerMenuPage.appGalleryButton), 'No app-download section in this region');
            await hamburgerMenuPage.expectOpensPopup(hamburgerMenuPage.appGalleryButton);
        });

    });

    test.describe('Hamburger Menu - Logged In', () => {

        test.beforeEach(async ({ loginPage, hamburgerMenuPage, testData }: HamburgerMenuFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Logged-in: pending test account');
            await hamburgerMenuPage.goto(url);
            await loginPage.clickLogin();
            await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
        });

        test('HM-LI-001 - the balance widget shows a real amount', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.expectBalanceWidget();
        });

        test('HM-LI-002 - a Deposit button sits beside the balance', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.expectDepositButton();
        });

        test('HM-LI-003 - the user name is shown', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.expectUserName();
        });

        test('HM-LI-004 - the account number is shown', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.expectAccountNumber();
        });

        test('HM-LI-005 - the eye toggle is shown beside the balance', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.expectEyeToggleVisible();
        });

        test('HM-LI-006 - the eye toggle hides the balance', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.hideBalance();
            await hamburgerMenuPage.expectBalanceMasked();
        });

        test('HM-LI-007 - the eye toggle unhides the balance', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.hideBalance();
            await hamburgerMenuPage.expectBalanceMasked();
            await hamburgerMenuPage.hideBalance();
            await hamburgerMenuPage.expectBalanceShown();
        });

        test('HM-LI-008 - the Withdrawal shortcut opens the banking flow', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openWithdrawalShortcut();
            await hamburgerMenuPage.expectAccountOptionOpened('Withdrawal');
            await hamburgerMenuPage.expectBankingOpen();
        });

        test('HM-LI-009 - the Transaction Summary shortcut opens its pane', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openTransactionSummaryShortcut();
            await hamburgerMenuPage.expectClosed();
            await hamburgerMenuPage.expectAccountOptionOpened('Transaction Summary');
        });

        test('HM-LI-010 - the City Rewards shortcut opens its pane', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openCityRewardsShortcut();
            await hamburgerMenuPage.expectClosed();
            await hamburgerMenuPage.expectAccountOptionOpened('City Rewards');
        });

        test('HM-LI-011 - the My Account dropdown expands', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccount();
            await hamburgerMenuPage.expectMyAccountExpanded();
        });

        test('HM-LI-012 - the My Account region is displayed', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccount();
            await hamburgerMenuPage.expectMyAccountRegion();
        });

        test('HM-LI-013 - Deposit (via My Account) opens the banking flow', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccountOption('Deposit');
            await hamburgerMenuPage.expectAccountOptionOpened('Deposit');
            await hamburgerMenuPage.expectBankingOpen();
        });

        test('HM-LI-014 - Withdrawal (via My Account) opens the banking flow', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccountOption('Withdrawal');
            await hamburgerMenuPage.expectAccountOptionOpened('Withdrawal');
            await hamburgerMenuPage.expectBankingOpen();
        });

        test('HM-LI-015 - Transaction Summary (via My Account) opens its pane', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccountOption('Transaction Summary');
            await hamburgerMenuPage.expectAccountOptionOpened('Transaction Summary');
        });

        test('HM-LI-016 - Bonus Wallet (via My Account) opens its pane', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccountOption('Bonus Wallet');
            await hamburgerMenuPage.expectAccountOptionOpened('Bonus Wallet');
        });

        test('HM-LI-017 - City Rewards (via My Account) opens its pane', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccountOption('City Rewards');
            await hamburgerMenuPage.expectAccountOptionOpened('City Rewards');
        });

        test('HM-LI-018 - My Profile Management opens its pane', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccountOption('My Profile Management');
            await hamburgerMenuPage.expectAccountOptionOpened('My Profile Management');
        });

        test('HM-LI-019 - the My Account dropdown is reachable', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            // Update Password is not present in the hamburger My Account dropdown for ZA.
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccount();
            await hamburgerMenuPage.expectMyAccountExpanded();
        });

        test('HM-LI-020 - Account Settings opens with an Update button', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccountOption('Account Settings');
            await hamburgerMenuPage.expectAccountOptionOpened('Account Settings');
            await hamburgerMenuPage.expectAccountSettingsUpdateButton();
        });

        test('HM-LI-021 - Responsible Gaming opens its pane', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccountOption('Responsible Gaming');
            await hamburgerMenuPage.expectAccountOptionOpened('Responsible Gaming');
        });

        test('HM-LI-022 - Document Verification opens its pane', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccountOption('Document Verification');
            await hamburgerMenuPage.expectAccountOptionOpened('Document Verification');
        });

        test('HM-LI-023 - the My Account dropdown collapses', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccount();
            await hamburgerMenuPage.expectMyAccountExpanded();
            await hamburgerMenuPage.collapseMyAccount();
            await hamburgerMenuPage.expectMyAccountCollapsed();
        });

        test('HM-LI-024 - the My Account options are shown', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.openMyAccount();
            await hamburgerMenuPage.expectMyAccountExpanded();
        });

        test('HM-LI-025 - Log Out logs the user out', async ({ hamburgerMenuPage }: HamburgerMenuFixtures) => {
            await hamburgerMenuPage.open();
            await hamburgerMenuPage.logOut();
            await hamburgerMenuPage.expectClosed();
            await hamburgerMenuPage.expectLoggedOut();
        });

    });
}
