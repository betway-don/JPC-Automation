import { Page, TestInfo, TestType } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

type HeaderTestFixtures = {
    page: Page;
    headerPage: HeaderPage;
    screenshotDir: string;
    testData: any;
};

export async function runHeaderTests(
    test: TestType<HeaderTestFixtures, any>,
    url: string,
    options?: { excludeTags?: string[] }
) {

    test.beforeEach(async ({ headerPage }: { headerPage: HeaderPage }) => {
        await headerPage.navigateTo(url);
    });

    test.describe('Logged Out Tests', () => {
        test('T1. Verify Hamburger menu visibility and clickability', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.highlightElement('menuButton');
            await headerPage.clickMenu();
            await ScreenshotHelper(page, screenshotDir, 'header-menu', testInfo);
        });

        test('T2. Verify Jackpotcity logo visibility and clickability', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.highlightElement('logoLink');
            await headerPage.clickLogo();
            const currentUrl = page.url();
            console.log('Current URL:', currentUrl);
            await testInfo.attach('Current URL', { body: currentUrl });
            await ScreenshotHelper(page, screenshotDir, 'header-logo', testInfo);
        });

        test('T3. Verify Search bar input functionality', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.searchFor('dimond');
            await page.waitForTimeout(2000);
            await ScreenshotHelper(page, screenshotDir, 'header-search', testInfo);
        });

        test('T4. Verify Login CTA visibility and navigation', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.highlightElement('loginCTA');
            await headerPage.clickLoginCTA();
            await ScreenshotHelper(page, screenshotDir, 'header-login-cta', testInfo);
        });

        test('T5. Verify Register CTA visibility and navigation', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.highlightElement('registerCTA');
            await headerPage.clickRegisterCTA();
            await ScreenshotHelper(page, screenshotDir, 'header-register-cta', testInfo);
        });

        test('T6. Verify Live Chat icon functionality', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.highlightElement('liveChatIcon');
            await headerPage.clickLiveChat();
            await page.waitForTimeout(4000);
            await ScreenshotHelper(page, screenshotDir, 'header-live-chat', testInfo);
        });

        test('T7. Verify Theme Change icon toggles theme', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.highlightElement('themeToggle');
            await headerPage.toggleTheme();
            await page.waitForTimeout(4000);
            await ScreenshotHelper(page, screenshotDir, 'header-theme-toggle', testInfo);
        });
    });

    test.describe('Logged In Tests', () => {
        test.beforeEach(async ({ headerPage, testData }: { headerPage: HeaderPage, testData: any }) => {
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
        });

        test('T8. Verify Hamburger menu visibility and clickability', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.highlightElement('menuButton');
            await headerPage.clickMenu();
            await ScreenshotHelper(page, screenshotDir, 'header-login-menu', testInfo);
        });

        test('T9. Verify Jackpotcity logo visibility and clickability (Logged In)', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.highlightElement('logoLink');
            await headerPage.clickLogo();
            await ScreenshotHelper(page, screenshotDir, 'header-logo-loggedin', testInfo);
        });

        test('T10. Verify Search bar input functionality (Logged In)', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.searchFor('dimond');
            await page.waitForTimeout(2000);
            await ScreenshotHelper(page, screenshotDir, 'header-search-loggedin', testInfo);
        });

        test('T11. Verify Login CTA visibility and navigation (Logged In - Should not be visible?)', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            try {
                await headerPage.highlightElement('loginCTA');
                await headerPage.clickLoginCTA();
            } catch (e) {
                console.log("Login CTA might not be present after login, which is expected.");
            }
            await ScreenshotHelper(page, screenshotDir, 'header-login-cta-loggedin', testInfo);
        });

        test('T12. Verify Register CTA visibility and navigation (Logged In)', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            try {
                await headerPage.highlightElement('registerCTA');
                await headerPage.clickRegisterCTA();
            } catch (e) {
                console.log("Register CTA might not be present after login.");
            }
            await ScreenshotHelper(page, screenshotDir, 'header-register-cta-loggedin', testInfo);
        });

        test('T13. Verify Live Chat icon functionality (Logged In)', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.highlightElement('liveChatIcon');
            await headerPage.clickLiveChat();
            await page.waitForTimeout(4000);
            await ScreenshotHelper(page, screenshotDir, 'header-live-chat-loggedin', testInfo);
        });

        test('T14. Verify Theme Change icon toggles theme (Logged In)', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.highlightElement('themeToggle');
            await headerPage.toggleTheme();
            await ScreenshotHelper(page, screenshotDir, 'header-theme-toggle-loggedin', testInfo);
        });

        test('T15. Verify Profile icon functionality', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.highlightElement('profileIcon');
            await headerPage.clickProfile();
            await ScreenshotHelper(page, screenshotDir, 'header-profile-icon', testInfo);
        });

        test('T16. Verify Notification icon functionality', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await page.waitForTimeout(5000);
            await headerPage.highlightElement('notificationIcon');
            await headerPage.clickNotification();
            await page.waitForTimeout(2000);
            await ScreenshotHelper(page, screenshotDir, 'header-notification', testInfo);
        });

        test('T17. Verify Deposit CTA popup', async ({ page, headerPage, screenshotDir }: HeaderTestFixtures, testInfo: TestInfo) => {
            await headerPage.clickDeposit();
            await headerPage.highlightElement('accountBalancesDialog');
            await ScreenshotHelper(page, screenshotDir, 'header-deposit-popup', testInfo);
        });
    });
}
