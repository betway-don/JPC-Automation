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
};

export async function runLimitsTests(
    test: TestType<LimitsTestFixtures, any>,
    userMobile: string,
    userPassword: string
) {

    test.beforeEach(async ({ page, loginPage }) => {
        await loginPage.goto();
        await loginPage.clickLogin();
        await page.waitForTimeout(2000);
        await loginPage.performLogin(userMobile, userPassword);
        await page.waitForTimeout(2000);
    });

    test('T1. Verify Limit Tab Presence', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.clickDeposit();
        await limitsPage.clickResponsibleGaming();
        await limitsPage.locators.limitsTab.waitFor({ state: 'visible' });
        await highlightElements(limitsPage.locators.limitsTab);
        await page.waitForTimeout(2000);
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

    test('T4. Verify Daily Limit Constraints', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        await limitsPage.highlightDailySection();
        await ScreenshotHelper(page, screenshotDir, 'T4a-limits', testInfo);

        await limitsPage.locators.monthlyLimitSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await expect(limitsPage.locators.monthlyLimitSection).toBeInViewport();
        await limitsPage.highlightMonthlySection();
        await ScreenshotHelper(page, screenshotDir, 'T4b-limits', testInfo);
    });

    test('T5. Verify Daily Limit Increase', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        const currentLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.dailyLimitInput, 200);
        const newLimitValue = currentLimit + 1;
        console.log(`Current Limit: ${currentLimit}, New Limit to Set: ${newLimitValue}`);

        await limitsPage.setDailyLimit(newLimitValue.toString());
        await limitsPage.highlightDailyLimitInput();

        await ScreenshotHelper(page, screenshotDir, 'T5-limits', testInfo);
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

    test('T7. Verify Weekly limit is lesser than Monthly limit', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        await limitsPage.highlightWeeklySection();
        await ScreenshotHelper(page, screenshotDir, 'T7a-limits', testInfo);

        await limitsPage.locators.monthlyLimitSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await expect(limitsPage.locators.monthlyLimitSection).toBeInViewport();
        await limitsPage.highlightMonthlySection();
        await ScreenshotHelper(page, screenshotDir, 'T7b-limits', testInfo);
    });

    test('T8. Verify Weekly limit is greater than Daily limit', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        await limitsPage.highlightDailySection();
        await ScreenshotHelper(page, screenshotDir, 'T8a-limits', testInfo);

        await limitsPage.locators.weeklyLimitSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await expect(limitsPage.locators.weeklyLimitSection).toBeInViewport();
        await limitsPage.highlightWeeklySection();
        await ScreenshotHelper(page, screenshotDir, 'T8b-limits', testInfo);
    });

    test('T9. Verify Weekly Limit Increase', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        const currentLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.weeklyLimitInput, 2000);
        const newLimitValue = currentLimit + 1;
        console.log(`Current Limit: ${currentLimit}, New Limit to Set: ${newLimitValue}`);

        await limitsPage.setWeeklyLimit(newLimitValue.toString());
        await limitsPage.highlightWeeklyLimitInput();

        await ScreenshotHelper(page, screenshotDir, 'T9-limits', testInfo);
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

    test('T11. Verify Monthly Limit Constraints', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        await limitsPage.highlightMonthlySection();
        await ScreenshotHelper(page, screenshotDir, 'T11a-limits', testInfo);

        await limitsPage.locators.dailyLimitSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await expect(limitsPage.locators.dailyLimitSection).toBeInViewport();
        await limitsPage.highlightDailySection();
        await ScreenshotHelper(page, screenshotDir, 'T11b-limits', testInfo);
    });

    test('T12. Verify Monthly Limit Increase', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        const currentLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.monthlyLimitInput, 20000);
        const newLimitValue = currentLimit + 1;
        console.log(`Current Limit: ${currentLimit}, New Limit to Set: ${newLimitValue}`);

        await limitsPage.setMonthlyLimit(newLimitValue.toString());
        await limitsPage.highlightMonthlyLimitInput();

        await ScreenshotHelper(page, screenshotDir, 'T12-limits', testInfo);
    });

    test('T13. Verify Customization of Limits', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        // 1. Set Monthly
        const monthLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.monthlyLimitInput, 20000);
        const newMonth = monthLimit - 1;
        await limitsPage.setMonthlyLimit(newMonth.toString());
        await page.waitForTimeout(2000);

        // 2. Set Weekly
        const weekLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.weeklyLimitInput, 2000);
        const newWeek = weekLimit - 1;
        await limitsPage.setWeeklyLimit(newWeek.toString());
        await page.waitForTimeout(2000);

        // 3. Set Daily
        const dailyLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.dailyLimitInput, 200);
        const newDaily = dailyLimit - 1;
        await limitsPage.setDailyLimit(newDaily.toString());
        await page.waitForTimeout(2000);

        await ScreenshotHelper(page, screenshotDir, 'T13-limits', testInfo);
    });

    test('T14. Verify Set Your Limit Button Activation', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        const currentLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.monthlyLimitInput, 20000);
        const newLimitValue = currentLimit - 1;

        await limitsPage.locators.monthlyLimitInput.click();
        await limitsPage.locators.monthlyLimitInput.fill('');
        await limitsPage.locators.monthlyLimitInput.type(newLimitValue.toString());
        await page.waitForTimeout(2000);

        await limitsPage.highlightSetLimitButtons();

        await ScreenshotHelper(page, screenshotDir, 'T14-limits', testInfo);
    });

    test('T15. Verify Button Accessibility After Setting Limit, T16. Verify Time Display on Disabled Button', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        await limitsPage.highlightCoolingOffContainer();
        await ScreenshotHelper(page, screenshotDir, 'T15-limits', testInfo);

        await limitsPage.highlightDisabledCoolingOffButton();
        await ScreenshotHelper(page, screenshotDir, 'T16-limits', testInfo);
    });

    test('T17. Verify Feedback on Limit Change', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        const currentLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.monthlyLimitInput, 20000);
        const newLimitValue = currentLimit - 1;

        await limitsPage.locators.monthlyLimitInput.click();
        await limitsPage.locators.monthlyLimitInput.fill('');
        await limitsPage.locators.monthlyLimitInput.type(newLimitValue.toString());
        await page.waitForTimeout(2000);

        await limitsPage.locators.monthlyLimitSetButton.click();
        await ScreenshotHelper(page, screenshotDir, 'T17-limits', testInfo);
    });

    test('T18. Verify Accrued Value Bar Display', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();
        await limitsPage.highlightAccruedBars();
        await ScreenshotHelper(page, screenshotDir, 'T18-limits', testInfo);
    });

    test('T19. Verify Accrued Value Progression', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        const currentLimit = await limitsPage.getCurrentLimitValue(limitsPage.locators.dailyLimitInput, 200);
        const newLimitValue = currentLimit - 100;
        console.log(`Current Limit: ${currentLimit}, New Limit to Set: ${newLimitValue}`);

        await limitsPage.setDailyLimit(newLimitValue.toString());
        await page.waitForTimeout(2000);

        await limitsPage.highlightFirstAccruedBar();
        await ScreenshotHelper(page, screenshotDir, 'T19-limits', testInfo);
    });

    test('T20. Verify Session Limit Duration Setting, T21- Verify Success Popup After Session Limit Setup', async ({ page, limitsPage, screenshotDir }, testInfo) => {
        await limitsPage.navigateToLimits();

        await limitsPage.setSessionLimit('15');

        await limitsPage.highlightSuccessPopup();
        await ScreenshotHelper(page, screenshotDir, 'T20, T21-limits', testInfo);
    });
}
