// 1. Import 'test' from your fixture file
import { test } from '../../../fixtures/jackpotCityFixture';
import { ScreenshotHelper } from '../../../../Common-Flows/ScreenshotHelper';

test.describe('Login Page Test Cases', () => {

    // 2. Common setup for all tests
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
    });

    test('T1-Verify login Button is visible on Homepage.', async ({ page, loginPage, screenshotDir }, testInfo) => {
        await loginPage.highlightLoginButton();
        await ScreenshotHelper(page, screenshotDir, 'T1-loginPage', testInfo);
    });

    test('T2-Verify that user should able to click on "Login" button', async ({ page, loginPage, screenshotDir }, testInfo) => {
        await loginPage.clickLogin();
        await ScreenshotHelper(page, screenshotDir, 'T2-loginPage', testInfo);
    });

    test('T3 - Verify that user should able to see the "Login" button in Hamburger menu', async ({ page, loginPage, screenshotDir }, testInfo) => {
        await loginPage.clickHamburgerMenu();
        await page.waitForTimeout(2000);
        await loginPage.highlightHamburgerLogin();
        await ScreenshotHelper(page, screenshotDir, 'T3-loginHamburgerMenu', testInfo);
    });

    test('T4 - Verify that user should able to click on "Login" button in Hamburger menu', async ({ page, loginPage, screenshotDir }, testInfo) => {
        await loginPage.clickHamburgerMenu();
        await page.waitForTimeout(2000);
        await loginPage.clickHamburgerLogin();
        await ScreenshotHelper(page, screenshotDir, 'T4-loginHamburgerMenu', testInfo);
    });

    test('T5 - Verify that user should able to see the "Login" button on signup popup window', async ({ page, loginPage, screenshotDir }, testInfo) => {
        await loginPage.clickRegister();
        await loginPage.highlightLoginLinkInSignup();
        await ScreenshotHelper(page, screenshotDir, 'T5-loginSignupPopup', testInfo);
    });

    test('T6 - Verify that user should able to click on "Login" button on signup popup window', async ({ page, loginPage, screenshotDir }, testInfo) => {
        await loginPage.clickRegister();
        await loginPage.clickLoginLinkInSignup();
        await ScreenshotHelper(page, screenshotDir, 'T6-loginSignupPopup', testInfo);
    });

    test('T7 - Verify that user should able to see the "Login" button on login popup window when clicked on aviator', async ({ page, loginPage, screenshotDir }, testInfo) => {
        await loginPage.clickAviator();
        await loginPage.highlightAviatorLogin();
        await ScreenshotHelper(page, screenshotDir, 'T7-loginAviatorPopup', testInfo);
    });

    test('T9 - Verify user is able to login', async ({ page, loginPage, testData, screenshotDir }, testInfo) => {
        await loginPage.clickLogin();
        await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T9-login', testInfo);
    });

    test('T10 - Verify user is able to login from hamburger menu', async ({ page, loginPage, testData, screenshotDir }, testInfo) => {
        await loginPage.clickHamburgerMenu();
        await page.waitForTimeout(2000);
        await loginPage.clickHamburgerLogin();
        await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T10-loginHamburger', testInfo);
    });

    test('T11 - Verify user is able to login from signup popup', async ({ page, loginPage, testData, screenshotDir }, testInfo) => {
        await loginPage.clickRegister();
        await loginPage.clickLoginLinkInSignup();
        await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T11-loginFromSignup', testInfo);
    });

    test('T13 - Verify user is able to login from signup popup window from aviator page', async ({ page, loginPage, testData, screenshotDir }, testInfo) => {
        await loginPage.clickAviator();
        await page.waitForTimeout(2000);
        await loginPage.clickAviatorLogin();
        await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-loginAviatorSignup', testInfo);
    });

    test('T15 - Verify user is not able to login if mobile number has less than 9 digits', async ({ page, loginPage, testData, screenshotDir }, testInfo) => {
        await loginPage.clickLogin();
        await loginPage.triggerValidation(testData.loginInvalid.shortMobile);
        await loginPage.highlightMobileValidation();
        await ScreenshotHelper(page, screenshotDir, 'T15-shortMobile', testInfo);
    });

    test('T16 - Verify user is not able to login if mobile number has more than 9 digits', async ({ page, loginPage, testData, screenshotDir }, testInfo) => {
        await loginPage.clickLogin();
        await loginPage.triggerValidation(testData.loginInvalid.longMobile);
        await loginPage.highlightMobileValidation();
        await ScreenshotHelper(page, screenshotDir, 'T16-longMobile', testInfo);
    });

    test('T17 - Verify user is not able to login if mobile number contains alphanumeric characters', async ({ page, loginPage, testData, screenshotDir }, testInfo) => {
        await loginPage.clickLogin();
        await loginPage.triggerValidation(testData.loginInvalid.alphaMobile);
        await loginPage.highlightMobileValidation();
        await ScreenshotHelper(page, screenshotDir, 'T17-alphanumericMobile', testInfo);
    });

    test('T18 - Verify user is not able to enter special characters in mobile number field', async ({ page, loginPage, testData, screenshotDir }, testInfo) => {
        await loginPage.clickLogin();
        await loginPage.triggerValidation(testData.loginInvalid.specialMobile);
        // Raw spec highlighted the input field here, not the text
        await loginPage.highlightUsername();
        await ScreenshotHelper(page, screenshotDir, 'T18-specialCharsMobile', testInfo);
    });

    test('T19 - Verify that user is not able to login if password field is empty', async ({ page, loginPage, testData, screenshotDir }, testInfo) => {
        await loginPage.clickLogin();
        await loginPage.triggerPasswordValidation(testData.loginValid.mobile, '');
        await ScreenshotHelper(page, screenshotDir, 'T19-emptyPassword', testInfo);
    });

    test('T20 - Verify that user is not able to login if password field has less than 5 characters', async ({ page, loginPage, testData, screenshotDir }, testInfo) => {
        await loginPage.clickLogin();
        await loginPage.triggerPasswordValidation(testData.loginValid.mobile, testData.loginInvalid.shortPass);
        await loginPage.highlightPasswordValidation();
        await ScreenshotHelper(page, screenshotDir, 'T20-shortPassword', testInfo);
    });

    test('T21 - Verify that user is not able to login if password field has more than 20 characters', async ({ page, loginPage, testData, screenshotDir }, testInfo) => {
        await loginPage.clickLogin();
        await loginPage.triggerPasswordValidation(testData.loginValid.mobile, testData.loginInvalid.longPass);
        await loginPage.highlightPasswordValidation();
        await ScreenshotHelper(page, screenshotDir, 'T21-longPassword', testInfo);
    });


});