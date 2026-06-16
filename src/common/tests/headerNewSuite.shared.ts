import { Page, TestType, expect } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';

type HeaderNewSuiteFixtures = {
    page: Page;
    headerPage: HeaderPage;
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

        test('H-LO-001 - hamburger menu is visible and opens', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.menuButton).toBeVisible();
            await headerPage.openMenu();
            await headerPage.expectMenuOpen();
        });

        test('H-LO-002 - logo returns to the home page', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.logo).toBeVisible();
            await headerPage.clickLogo();
            await headerPage.expectAt(url);
        });

        test('H-LO-003 - search returns relevant results', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.search('hot');
            await headerPage.expectSearchResultRelevant(/hot/i);
        });

        test('H-LO-004 - Login CTA opens the login modal', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.loginButton).toBeVisible();
            await headerPage.clickLoginCTA();
            await headerPage.expectLoginModalOpen();
        });

        test('H-LO-005 - Sign Up CTA opens the sign-up modal', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.signUpButton).toBeVisible();
            await headerPage.clickRegisterCTA();
            await headerPage.expectSignUpModalOpen();
        });

        test('H-LO-006 - Live Chat opens the chat window', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.liveChatIcon).toBeVisible();
            await headerPage.clickLiveChat();
            await headerPage.expectLiveChatOpen();
        });

        test('H-LO-007 - theme toggle switches the theme', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.expectThemeToggles();
        });

        test('H-LO-008 - header elements survive a page refresh', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.refresh();
            await expect(headerPage.menuButton).toBeVisible();
            await expect(headerPage.logo).toBeVisible();
            await expect(headerPage.loginButton).toBeVisible();
            await expect(headerPage.signUpButton).toBeVisible();
            await expect(headerPage.searchBar).toBeVisible();
        });

        // ── navigation tabs ──────────────────────────────────────────────────────
        const NAV: { id: string; label: string; tab: string; url: RegExp | string }[] = [
            { id: 'H-LO-009', label: 'Home', tab: 'home', url },
            { id: 'H-LO-010', label: 'Crash Games', tab: 'crashgames', url: /\/crashgames/ },
            { id: 'H-LO-011', label: 'Aviator', tab: 'aviator', url: /\/aviator/ },
            { id: 'H-LO-012', label: 'Quick Games', tab: 'quickgames', url: /\/quickgames/ },
            { id: 'H-LO-013', label: 'Low Data', tab: 'lowdata', url: /\/lowdata/ },
            { id: 'H-LO-014', label: 'Slot Games', tab: 'spingames', url: /\/spingames/ },
            { id: 'H-LO-015', label: 'Live Games', tab: 'livegames', url: /\/livegames/ },
            { id: 'H-LO-016', label: 'Lucky Numbers', tab: 'luckynumbers', url: /\/luckynumbers/ },
            { id: 'H-LO-017', label: 'New Games', tab: 'new-games', url: /\/new-games/ },
            { id: 'H-LO-018', label: 'Promotions', tab: 'Promotions', url: /\/promotions/ },
            { id: 'H-LO-019', label: 'Winners Circle', tab: 'winners', url: /\/winners/ },
        ];
        for (const n of NAV) {
            test(`${n.id} - ${n.label} navigation redirects correctly`, async ({ headerPage }: HeaderNewSuiteFixtures) => {
                test.skip(!await headerPage.hasNavTab(n.tab), `${n.label} tab not present in this region`);
                await headerPage.openNavTab(n.tab);
                await headerPage.expectAt(n.url);
            });
        }

        test('H-LO-020 - the selected navigation tab is highlighted', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.openNavTab('spingames');
            await headerPage.expectAt(/\/spingames/);
            await headerPage.expectActiveNavTab('spingames');
        });
    });

    test.describe('Header - Logged In', () => {

        test.beforeEach(async ({ headerPage, testData }) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Logged-in: pending test account');
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
        });

        test('H-LI-001 - hamburger menu icon is visible', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.menuButton).toBeVisible();
        });

        test('H-LI-002 - logo returns to the home page', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.logo).toBeVisible();
            await headerPage.clickLogo();
            await headerPage.expectAt(url);
        });

        test('H-LI-003 - Promotions navigation redirects correctly', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.openNavTab('Promotions');
            await headerPage.expectAt(/\/promotions/);
        });

        test('H-LI-004 - search returns relevant results', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.search('hot');
            await headerPage.expectSearchResultRelevant(/hot/i);
        });

        test('H-LI-005 - wallet shows the cash balance', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.expectWalletShowsBalance();
        });

        test('H-LI-006 - wallet dropdown shows the balances', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.openWalletDropdown();
            await headerPage.expectBalancesDialog();
        });

        test('H-LI-007 - Deposit opens the banking flow', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.openDepositFromWallet();
            await headerPage.expectBankingOpen();
        });

        test('H-LI-008 - notification icon opens the notifications drawer', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.notificationIcon).toBeVisible();
            await headerPage.expectNotificationsDrawerOpens();
            await expect(headerPage.notificationsMarketingTab).toBeVisible();
        });

        test('H-LI-009 - profile icon opens the account drawer', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.profileIcon).toBeVisible();
            await headerPage.expectProfileDrawerOpens();
            await expect(headerPage.accountNumberText).toBeVisible();
        });

        test('H-LI-010 - Live Chat opens the chat window', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.liveChatIcon).toBeVisible();
            await headerPage.clickLiveChat();
            await headerPage.expectLiveChatOpen();
        });

        test('H-LI-011 - logged-in header survives a page refresh', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.refresh();
            await expect(headerPage.menuButton).toBeVisible();
            await expect(headerPage.depositButton).toBeVisible();
            await expect(headerPage.profileIcon).toBeVisible();
            await expect(headerPage.notificationIcon).toBeVisible();
        });

        test('H-LI-012 - Aviator navigation (logged in)', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.openNavTab('aviator');
            await headerPage.expectAt(/\/aviator/);
        });

        test('H-LI-013 - Lucky Numbers navigation redirects correctly', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            test.skip(!await headerPage.hasNavTab('luckynumbers'), 'Lucky Numbers tab not present in this region');
            await headerPage.openNavTab('luckynumbers');
            await headerPage.expectAt(/\/luckynumbers/);
        });
    });

    test.describe('Header - Partial Account', () => {

        test.beforeEach(async ({ headerPage, testData }) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Partial account: pending test account');
            await headerPage.login(testData.loginPartial.mobile, testData.loginPartial.password);
        });

        test('H-PA-001 - hamburger menu opens', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.menuButton).toBeVisible();
            await headerPage.openMenu();
            await headerPage.expectMenuOpen();
        });

        test('H-PA-002 - logo returns to the home page', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.clickLogo();
            await headerPage.expectAt(url);
        });

        test('H-PA-003 - the full navigation set is shown', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            // Partial accounts get the SAME full header nav as everyone else (confirmed live 2026-06-12).
            await expect(headerPage.navTab('home')).toBeVisible();
            await expect(headerPage.navTab('Promotions')).toBeVisible();
            await expect(headerPage.navTab('winners')).toBeVisible();
            await expect(headerPage.navTab('spingames')).toBeVisible();
        });

        test('H-PA-004 - search returns relevant results', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await headerPage.search('hot');
            await headerPage.expectSearchResultRelevant(/hot/i);
        });

        test('H-PA-005 - Complete Account prompt opens the completion flow', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.completeAccountPrompt).toBeVisible();
            await headerPage.completeAccountPrompt.click();
            await expect(headerPage.verificationOrDialog.first()).toBeVisible();
        });

        test('H-PA-006 - notification icon opens the notifications drawer', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.notificationIcon).toBeVisible();
            await headerPage.expectNotificationsDrawerOpens();
        });

        test('H-PA-007 - profile icon opens the account drawer', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.profileIcon).toBeVisible();
            await headerPage.expectProfileDrawerOpens();
        });

        test('H-PA-008 - Live Chat opens the chat window', async ({ headerPage }: HeaderNewSuiteFixtures) => {
            await expect(headerPage.liveChatIcon).toBeVisible();
            await headerPage.clickLiveChat();
            await headerPage.expectLiveChatOpen();
        });
    });
}
