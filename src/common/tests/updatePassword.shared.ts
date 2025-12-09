import { Page, TestType, expect } from '@playwright/test';
import { UpdatePasswordPage } from '../pages/UpdatePasswordPage';
import { LoginPage } from '../pages/LoginPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';
import { highlightElements } from '../actions/HighlightElements';

type UpdatePasswordTestFixtures = {
    page: Page;
    updatePasswordPage: UpdatePasswordPage;
    loginPage: LoginPage;
    screenshotDir: string;
    testData: any;
};

export async function runUpdatePasswordTests(
    test: TestType<UpdatePasswordTestFixtures, any>
) {

    test.beforeEach(async ({ page, loginPage, testData }) => {
        await loginPage.goto();
        await loginPage.clickLogin();
        await page.waitForTimeout(2000);
        await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
        await page.waitForLoadState('domcontentloaded');
    });

    test('T1. Verify fields and CTA are present', async ({ page, updatePasswordPage, screenshotDir }, testInfo) => {
        await updatePasswordPage.navigateToUpdatePassword();
        await updatePasswordPage.highlightSectionHeader();
        await ScreenshotHelper(page, screenshotDir, 'T1-updatePassword', testInfo);
    });

    test('T2. Verify password criteria hint visibility', async ({ page, updatePasswordPage, screenshotDir }, testInfo) => {
        await updatePasswordPage.navigateToUpdatePassword();
        await updatePasswordPage.clickPasswordInput();
        await page.waitForTimeout(2000);
        // Using direct text locator from page if not in PO, but PO has it
        // The raw script highlighted 'Password ValidityEnter a'. The PO mock uses 'Password Validity'.
        // Assuming partial match or valid text locator.
        // We'll trust the PO highlight method.
        // But wait, the raw script used `page.getByText('Password ValidityEnter a')`.
        // Let's ensure PO handles this.
        await updatePasswordPage.highlightValidityText();
        await ScreenshotHelper(page, screenshotDir, 'T2-updatePassword', testInfo);
    });

    test('T3. Verify short password validation error', async ({ page, updatePasswordPage, screenshotDir }, testInfo) => {
        await updatePasswordPage.navigateToUpdatePassword();
        await updatePasswordPage.clickPasswordInput();
        await updatePasswordPage.fillPassword('1234');
        await updatePasswordPage.clickValidityText(); // As click target
        await page.waitForTimeout(2000);
        await updatePasswordPage.highlightProvideValidPasswordError();
        await ScreenshotHelper(page, screenshotDir, 'T3-updatePassword', testInfo);
    });

    test('T4. Verify mismatched password validation error', async ({ page, updatePasswordPage, screenshotDir }, testInfo) => {
        await updatePasswordPage.navigateToUpdatePassword();
        await updatePasswordPage.clickPasswordInput();
        await updatePasswordPage.fillPassword('1234567890');
        await updatePasswordPage.clickValidityText();
        await updatePasswordPage.clickConfirmPasswordInput();
        await updatePasswordPage.fillConfirmPassword('123');
        await page.waitForTimeout(2000);
        await updatePasswordPage.highlightMismatchError();
        await ScreenshotHelper(page, screenshotDir, 'T4-updatePassword', testInfo);
    });

    test('T5. Verify successful password update (Check)', async ({ page, updatePasswordPage, screenshotDir }, testInfo) => {
        await updatePasswordPage.navigateToUpdatePassword();
        await updatePasswordPage.clickPasswordInput();
        await updatePasswordPage.fillPassword('12345678');
        await page.waitForTimeout(1000);
        await updatePasswordPage.clickValidityText();
        await updatePasswordPage.clickConfirmPasswordInput();
        await updatePasswordPage.fillConfirmPassword('12345678');
        await page.waitForTimeout(1000);
        await updatePasswordPage.highlightSuccessMatchMessage();
        await ScreenshotHelper(page, screenshotDir, 'T5-updatePassword', testInfo);
    });

    test('T6. Verify CTA is disabled until valid input', async ({ page, updatePasswordPage, screenshotDir }, testInfo) => {
        await updatePasswordPage.navigateToUpdatePassword();
        await updatePasswordPage.clickPasswordInput();
        await updatePasswordPage.fillPassword('1234567890');
        await updatePasswordPage.clickValidityText();
        await updatePasswordPage.clickConfirmPasswordInput();
        await updatePasswordPage.fillConfirmPassword('123');
        await page.waitForTimeout(2000);
        await updatePasswordPage.highlightDisabledButton();
        await ScreenshotHelper(page, screenshotDir, 'T6-updatePassword', testInfo);
    });

    test('T7. Verify CTA is enabled on valid input', async ({ page, updatePasswordPage, screenshotDir }, testInfo) => {
        await updatePasswordPage.navigateToUpdatePassword();
        await updatePasswordPage.clickPasswordInput();
        await updatePasswordPage.fillPassword('12345678');
        await updatePasswordPage.clickValidityText();
        await updatePasswordPage.clickConfirmPasswordInput();
        await updatePasswordPage.fillConfirmPassword('12345678');
        await page.waitForTimeout(2000);
        await updatePasswordPage.highlightSubmitButton();
        await ScreenshotHelper(page, screenshotDir, 'T7-updatePassword', testInfo);
    });

    test('T8. Verify password input is masked', async ({ page, updatePasswordPage, screenshotDir }, testInfo) => {
        await updatePasswordPage.navigateToUpdatePassword();
        await updatePasswordPage.clickPasswordInput();
        await updatePasswordPage.fillPassword('12345678');
        await updatePasswordPage.clickValidityText();
        await updatePasswordPage.toggleEyeIcon();
        await updatePasswordPage.toggleEyeIcon();
        await page.waitForTimeout(2000);
        await updatePasswordPage.highlightPasswordInput();
        await ScreenshotHelper(page, screenshotDir, 'T8-updatePassword', testInfo);
    });

    test('T9. Verify reuse of old password shows error', async ({ page, updatePasswordPage, screenshotDir, testData }, testInfo) => {
        await updatePasswordPage.navigateToUpdatePassword();
        await updatePasswordPage.clickPasswordInput();
        // Use password from testData instead of variable
        await updatePasswordPage.fillPassword(testData.loginValid.password);
        await page.waitForTimeout(1000);
        await updatePasswordPage.clickValidityText();
        await updatePasswordPage.clickConfirmPasswordInput();
        await updatePasswordPage.fillConfirmPassword(testData.loginValid.password);
        await page.waitForTimeout(1000);
        await updatePasswordPage.submitUpdate();
        await updatePasswordPage.highlightOldPasswordError();
        await ScreenshotHelper(page, screenshotDir, 'T9-updatePassword', testInfo);
    });
}
