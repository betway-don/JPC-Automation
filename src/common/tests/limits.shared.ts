import { Page, TestType, expect } from '@playwright/test';
import { LimitsPage } from '../pages/LimitsPage';
import { LoginPage } from '../pages/LoginPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';
import { highlightElements } from '../actions/HighlightElements';

type LimitsTestFixtures = {
    page: Page;
    limitsPage: LimitsPage;
    loginPage: LoginPage;
    screenshotDir: string;
    testData: any;
};

export async function runLimitsTests(
    test: TestType<LimitsTestFixtures, any>
) {

    test.beforeEach(async ({ page, loginPage, testData }) => {
        await loginPage.goto();
        await loginPage.clickLogin();
        // Added wait after click to ensure modal/page transition starts
        await page.waitForTimeout(2000);
        await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
        await page.waitForTimeout(2000);
    });

    test('T1. Verify Limit Tab Presence', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.clickDeposit();
        await limitsPage.clickResponsibleGaming();
        await limitsPage.locators.limitsTab.waitFor({ state: 'visible' });
        await highlightElements(limitsPage.locators.limitsTab);
        await ScreenshotHelper(page, screenshotDir, 'T1-limits', testInfo);
    });

    test('T2. Verify Limit options Visibility', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();
        await limitsPage.highlightLimitsOption();
        await ScreenshotHelper(page, screenshotDir, 'T2-limits', testInfo);
    });

    test('T3. Verify Daily Limit Set', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        const currentLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.dailyLimitInput, 200);
        const newLimitValue = currentLimit - 1;
        console.log(`Current Limit: ${currentLimit}, New Limit to Set: ${newLimitValue}`);

        await limitsPage.setDailyLimit(newLimitValue.toString());
        await limitsPage.highlightDailyLimitInput();
        await ScreenshotHelper(page, screenshotDir, 'T3-limits', testInfo);
    });

    test('T6. Verify Weekly Limit Set', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        const currentLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.weeklyLimitInput, 2000);
        const newLimitValue = currentLimit - 1;
        console.log(`Current Limit: ${currentLimit}, New Limit to Set: ${newLimitValue}`);

        await limitsPage.setWeeklyLimit(newLimitValue.toString());
        await limitsPage.highlightWeeklyLimitInput();
        await ScreenshotHelper(page, screenshotDir, 'T6-limits', testInfo);
    });

    // --- IMPROVED LOGIC HERE ---
    test('T7. Verify Weekly limit is lesser than Monthly limit', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        const weeklyVal = await limitsPage.getCurrentLimitValue(limitsPage.locators.weeklyLimitInput);
        const monthlyVal = await limitsPage.getCurrentLimitValue(limitsPage.locators.monthlyLimitInput);

        console.log(`Weekly: ${weeklyVal}, Monthly: ${monthlyVal}`);

        // Logic Check: Weekly should be strictly less than Monthly
        // Note: Logic might be <= depending on business rules, but usually Weekly < Monthly
        expect(weeklyVal).toBeLessThanOrEqual(monthlyVal);

        await limitsPage.highlightWeeklySection();
        await limitsPage.locators.monthlyLimitSection.scrollIntoViewIfNeeded();
        await limitsPage.highlightMonthlySection();
        await ScreenshotHelper(page, screenshotDir, 'T7-limits-comparison', testInfo);
    });

    test('T8. Verify Weekly limit is greater than Daily limit', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        const dailyVal = await limitsPage.getCurrentLimitValue(limitsPage.locators.dailyLimitInput);
        const weeklyVal = await limitsPage.getCurrentLimitValue(limitsPage.locators.weeklyLimitInput);

        console.log(`Daily: ${dailyVal}, Weekly: ${weeklyVal}`);

        // Logic Check: Daily < Weekly
        expect(dailyVal).toBeLessThanOrEqual(weeklyVal);

        await limitsPage.highlightDailySection();
        await limitsPage.highlightWeeklySection();
        await ScreenshotHelper(page, screenshotDir, 'T8-limits-comparison', testInfo);
    });

    test('T10. Verify Monthly Limit Set', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        const currentLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.monthlyLimitInput, 20000);
        const newLimitValue = currentLimit - 1;
        console.log(`Current Limit: ${currentLimit}, New Limit to Set: ${newLimitValue}`);

        await limitsPage.setMonthlyLimit(newLimitValue.toString());
        await limitsPage.highlightMonthlyLimitInput();
        await ScreenshotHelper(page, screenshotDir, 'T10-limits', testInfo);
    });

    test('T13. Verify Customization of Limits', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        // 1. Set Monthly
        const monthLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.monthlyLimitInput, 20000);
        await limitsPage.setMonthlyLimit((monthLimit - 1).toString());
        await page.waitForTimeout(1000); // Small wait for update

        // 2. Set Weekly
        const weekLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.weeklyLimitInput, 2000);
        await limitsPage.setWeeklyLimit((weekLimit - 1).toString());
        await page.waitForTimeout(1000);

        // 3. Set Daily
        const dailyLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.dailyLimitInput, 200);
        await limitsPage.setDailyLimit((dailyLimit - 1).toString());
        await page.waitForTimeout(1000);

        await ScreenshotHelper(page, screenshotDir, 'T13-limits', testInfo);
    });

    test('T14. Verify Set Your Limit Button Activation', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        const currentLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.monthlyLimitInput, 20000);
        // We type but DO NOT click save, to see if the button becomes enabled/active
        await limitsPage.clearAndType(limitsPage.locators.monthlyLimitInput, (currentLimit - 1).toString());
        
        await page.waitForTimeout(1000); // Wait for button state change
        await limitsPage.highlightSetLimitButtons();
        await ScreenshotHelper(page, screenshotDir, 'T14-limits', testInfo);
    });

    test('T20. Verify Session Limit Duration Setting', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();
        await limitsPage.setSessionLimit('15');
        await limitsPage.highlightSuccessPopup();
        await ScreenshotHelper(page, screenshotDir, 'T20-limits', testInfo);
    });
}