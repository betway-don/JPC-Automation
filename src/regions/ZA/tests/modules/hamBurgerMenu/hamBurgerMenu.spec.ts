import path from 'path';
import { test } from '@playwright/test';
import { highlightElements } from '../../../../Common-Flows/HighlightElements';
import { ScreenshotHelper } from '../../../../Common-Flows/ScreenshotHelper';
import { Browser, chromium } from '@playwright/test';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/footer');

import { Page } from '@playwright/test';

async function login(page: Page, mobile: string, password: string) {
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'username' }).fill(mobile);
    await page.getByRole('textbox', { name: 'password' }).fill(password);
    await page.getByRole('textbox', { name: 'password' }).press('Enter');
    await page.waitForLoadState('domcontentloaded');
}

test.describe('Build A Bet Section Tests', () => {
    let browser: Browser;
    let context: any;
    let page: any;

    test.beforeAll(async () => {
        // Manually create a single browser instance, context, and page
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();

        // Navigate to new.betway.co.za, log in, and perform setup steps to reach the "Build A Bet" page
        await page.goto('https://jackpotcity.co.za/');
        // await login(page, '713533467', '12345'); 
        // await login(page, '713533467', '12345'); 


    });

    test.afterAll(async () => {
        // Clean up browser resources
        await page.close();
        await context.close();
        await browser.close();
    });


    // logged out state tests

    test('T1. Verify hamburger menu opens correctly', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T1-hamburgerMenu', testInfo);
    });

    test('T4. Verify switching from dark theme to light theme and vice-versa', async ({ }, testInfo) => {
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.page.locator('svg path[d^="M12 2.25a.75.75"]').click();
        await ScreenshotHelper(page, screenshotDir, 'T4-lightTheme', testInfo);

        await page.locator('svg path[d^="M12 2.25a.75.75"]').click();   
        await ScreenshotHelper(page, screenshotDir, 'T4-darkTheme', testInfo);
    });


    test('T10.  Verify Search field is accessible', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await highlightElements(page.locator('div').filter({ hasText: /^Search games$/ }).nth(2));
        await ScreenshotHelper(page, screenshotDir, 'T10-searchField', testInfo);
    });

    test('T11. Verify Promotions CTA', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await highlightElements(page.getByText('promotions').nth(2));
        await ScreenshotHelper(page, screenshotDir, 'T11-promotionsCTA', testInfo);
    });

    test('T12. Verify Providers CTA', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await highlightElements(page.getByRole('paragraph').filter({ hasText: 'Providers' }));
        await ScreenshotHelper(page, screenshotDir, 'T11-providersCTA', testInfo);
    });

    test('T13. Verify Winners CTA', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await highlightElements(page.getByText('winners', { exact: true }));
        await ScreenshotHelper(page, screenshotDir, 'T11-winnersCTA', testInfo);
    });

    test('T14. Verify Blog CTA', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await highlightElements(page.getByText('blog'));
        await ScreenshotHelper(page, screenshotDir, 'T11-blogCTA', testInfo);
    });

    test('T15. Verify Quick Links dropdown expand/collapse', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await highlightElements(page.getByRole('button', { name: 'Quick Links' }));
        await ScreenshotHelper(page, screenshotDir, 'T11-quickLinksCTA', testInfo);
    });

    test('T16.  Verify Privacy Policy CTA', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await page.getByRole('button', { name: 'Privacy Policy' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-privacyPolicyPage', testInfo);
    });

    test('T17. Verify Contact Us CTA', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await page.getByRole('button', { name: 'Contact Us' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T14-contactUsPage', testInfo);
    });

    test('T18. Verify Terms & Conditions CTA', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await page.getByRole('button', { name: 'Terms & Conditions' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-termsNconditions', testInfo);
    });

    test('T19. Verify FAQ’s CTA', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await page.getByRole('button', { name: 'FAQ\'s' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-FAQS', testInfo);
    });

    test('T21. Verify Responsible Gambling CTA', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await page.getByRole('button', { name: 'Responsible Gambling' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-responsibleGambling', testInfo);
    });

    test('T22. Verify Get the App CTA', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await page.getByRole('button', { name: 'Get the app' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-responsibleGambling', testInfo);
    });

    test('T23. Verify Slot Game Categories expand/collapse', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.locator('div:has-text("Game Categories")').locator('text="Slot Games"').click();
        await highlightElements(page.locator('div:has-text("Game Categories")').locator('text="Slot Games"'));

        await ScreenshotHelper(page, screenshotDir, 'T23-slotGameCategories', testInfo);
    });

    test('T24. Verify Live Game Categories expand/collapsee', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.locator('div:has-text("Game Categories")').locator('text="Live Games"').click();
        await highlightElements(page.locator('div:has-text("Game Categories")').locator('text="Live Games"'));
        await ScreenshotHelper(page, screenshotDir, 'T24-liveGameCategories', testInfo);
    });

    test('T25. Verify clicking on Aviator CTA in logged-out state prompts login', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.locator('div:has-text("Game Categories")').locator('text="Aviator"').click();
        await highlightElements(page.locator('div:has-text("Game Categories")').locator('text="Aviator"'));
        await ScreenshotHelper(page, screenshotDir, 'T25-aviator', testInfo);
    });

    test('T26. Verify Apple Store download button', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await highlightElements(page.getByRole('button', { name: 'Jackpotcity Apple App' }).nth(1));
        await ScreenshotHelper(page, screenshotDir, 'T26-jackpotCityAppCTA', testInfo);

    });

    test('T27. Verify Android app download button', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await highlightElements(page.getByRole('button', { name: 'Jackpotcity Android App' }).nth(1));
        await ScreenshotHelper(page, screenshotDir, 'T26-jackpotCityAppCTA', testInfo);

    });


    test('T28. Verify App Gallery download button', async ({ }, testInfo) => {
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await highlightElements(page.getByRole('button', { name: 'Jackpotcity Huawei App' }).nth(1));
        await ScreenshotHelper(page, screenshotDir, 'T26-jackpotCityAppCTA', testInfo);
    });


    // logged ins tate tests


    test('T29. Verify the Profile icon on header.', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        const topBar = page.locator('.bg-primary-layer').nth(2);
        await highlightElements(topBar);
        await ScreenshotHelper(page, screenshotDir, 'T99-profileHamBurgerMenu', testInfo);
    });

    test('T30.  Verify Balance widget appears', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        const balancesContainer = page.locator('div:has-text("Cash"):has-text("Bonus Balance")');

        await highlightElements(balancesContainer.getByText('Cash'));
        await highlightElements(balancesContainer.getByText('Bonus Balance'));

        await highlightElements(page.getByRole('button', { name: 'Deposit' }).nth(1));
        await ScreenshotHelper(page, screenshotDir, 'T99-profileHamBurgerMenu', testInfo);
    });


    test('T31. Verify name and account no. is displayed on the hamburger menu.', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        const accountBlock = page.locator('.bg-primary-layer').locator('text=Account No:').locator('..');
        await highlightElements(accountBlock);
        await ScreenshotHelper(page, screenshotDir, 'T99-accountNo', testInfo);
    });

    test('T32. Verify eye toggle is visible beside balance', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await highlightElements(page.locator('.design-system-button.flex.items-center.font-bold.hover\\:cursor-pointer.hover\\:shadow-md.text-base-priority.p-0'));
        await ScreenshotHelper(page, screenshotDir, 'T99-eyeToggle', testInfo);
    });

    test('T33. Verify eye toggle hides balance', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.locator('.design-system-button.flex.items-center.font-bold.hover\\:cursor-pointer.hover\\:shadow-md.text-base-priority.p-0').click();
        await ScreenshotHelper(page, screenshotDir, 'T99-eyeToggle', testInfo);
    });

    test('T34.  Verify Withdrawal CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('paragraph').filter({ hasText: /^Withdrawal$/ }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T99-withdrawalPage', testInfo);
    });

    test('T35. Verify My Account dropdown expansion', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'My Account' }).click();
        await highlightElements(page.getByRole('button', { name: 'My Account' }));
        await highlightElements(page.getByRole('region', { name: 'My Account' }));
        await ScreenshotHelper(page, screenshotDir, 'T99-myAccountDropdown', testInfo);
    });

    test('T36.  Verify Deposit CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'My Account' }).click();
        await page.getByLabel('My Account').getByRole('button', { name: 'Deposit' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T99-depositPage', testInfo);
    });

    test('T36.  Verify Withdrawl CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'My Account' }).click();
        await page.getByRole('button', { name: 'Withdrawal' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T99-withdrawlPage', testInfo);
    });

    test('T36. Verify Transaction Summary CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'My Account' }).click();
        await page.getByRole('button', { name: 'Transaction Summary' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T99-transactionPage', testInfo);
    });

    test('T37. Verify Bonus Wallet CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'My Account' }).click();
        await page.getByRole('button', { name: 'Bonus Wallet' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T99-bonusWallet', testInfo);
    });

    test('T38. Verify Personal Details CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'My Account' }).click();
        await page.getByRole('button', { name: 'Personal Details' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T99-personalDetailsPage', testInfo);
    });

    test('T39. Verify Account Settings CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'My Account' }).click();
        await page.getByRole('button', { name: 'Account Settings' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T99-updatePassword', testInfo);
    });

    test('T40. Verify Update Password CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'My Account' }).click();
        await page.getByRole('button', { name: 'Update Password' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T99-updatePassword', testInfo);
    });

    test('T40. Verify Responsible Gaming CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'My Account' }).click();
        await page.getByRole('button', { name: 'Responsible Gaming' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T99-responsibleGaming', testInfo);
    });

    test('T41. Verify Document Verification CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'My Account' }).click();
        await page.getByRole('button', { name: 'Document Verification' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T99-documentVerification', testInfo);
    });

    test('T42. Verify LogOut CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'My Account' }).click();
        await page.getByRole('button', { name: 'Log Out' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T99-logOut', testInfo);
    });

    test('T43. Verify Quick Links dropdown expand/collapse', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await highlightElements(page.getByRole('button', { name: 'Quick Links' }));
        await ScreenshotHelper(page, screenshotDir, 'T11-quickLinksCTA', testInfo);
    });

    test('T44. Verify Privacy Policy CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await page.getByRole('button', { name: 'Privacy Policy' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-privacyPolicyPage', testInfo);
    });

    test('T45. Verify Contact Us CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');

        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await page.getByRole('button', { name: 'Contact Us' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T14-contactUsPage', testInfo);
    });

    test('T46. Verify Terms & Conditions CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');

        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await page.getByRole('button', { name: 'Terms & Conditions' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-termsNconditions', testInfo);
    });

    test('T47. Verify FAQ’s CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');

        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await page.getByRole('button', { name: 'FAQ\'s' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-FAQS', testInfo);
    });

    test('T48. Verify Responsible Gambling CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');

        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await page.getByRole('button', { name: 'Responsible Gambling' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-responsibleGambling', testInfo);
    });

    test('T49. Verify Get the App CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');

        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Quick Links' }).click();
        await page.getByRole('button', { name: 'Get the app' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-responsibleGambling', testInfo);
    });

    test('T50. Verify Slot Game Categories expand/collapse', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');

        page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.locator('div:has-text("Game Categories")').locator('text="Slot Games"').click();
        await highlightElements(page.locator('div:has-text("Game Categories")').locator('text="Slot Games"'));

        await ScreenshotHelper(page, screenshotDir, 'T23-slotGameCategories', testInfo);
    });

    test('T51. Verify Live Game Categories expand/collapsee', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.locator('div:has-text("Game Categories")').locator('text="Live Games"').click();
        await highlightElements(page.locator('div:has-text("Game Categories")').locator('text="Live Games"'));
        await ScreenshotHelper(page, screenshotDir, 'T51-liveGameCategories', testInfo);
    });

    test('T52. Verify clicking on Aviator CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.locator('div:has-text("Game Categories")').locator('text="Aviator"').click();
        await ScreenshotHelper(page, screenshotDir, 'T52-aviator', testInfo);
    });

    test('T53. Verify clicking on Slot Games CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.locator('div:has-text("Game Categories")').locator('text="Slot Games"').click();
        await ScreenshotHelper(page, screenshotDir, 'T53-slotGames', testInfo);
    });

    test('T54. Verify clicking on Betgames CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.locator('div:has-text("Game Categories")').locator('text="Betgames"').click();
        await ScreenshotHelper(page, screenshotDir, 'T53-betGames', testInfo);
    });

    test('T55. Verify clicking on Quick Games CTA', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@12345');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.waitForTimeout(2000);
        await page.locator('div:has-text("Game Categories")').locator('text="Quick Games"').click();
        await ScreenshotHelper(page, screenshotDir, 'T53-quickGames', testInfo);
    });
});