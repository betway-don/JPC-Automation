import { Page, TestInfo, TestType, expect } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { LoginModal } from '../components/LoginModal';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

/**
 * Login suite (NewSuite) — TC_LOG_001..023 against the live login modal. IDs: LOG-001..023.
 * All login-modal selectors live in the LoginModal component object.
 *
 * Deliberately skipped (need a policy decision / dedicated account):
 *  - LOG-020 max-attempts: could lock the shared test account's password reset.
 *  - LOG-021/022: trigger real OTP SMS sends to the account's phone.
 */

type LoginSuiteFixtures = {
    page: Page;
    headerPage: HeaderPage;
    loginModal: LoginModal;
    screenshotDir: string;
    testData: any;
};

export async function runLoginNewSuiteTests(
    test: TestType<LoginSuiteFixtures, any>
) {

    /** Open the login modal via the header CTA and confirm it rendered. */
    async function openLogin(headerPage: HeaderPage, loginModal: LoginModal) {
        await headerPage.clickLoginCTA();
        await loginModal.expectOpen();
    }

    test.describe('Login - NewSuite', () => {

        test.beforeEach(async ({ page }: LoginSuiteFixtures) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
        });

        test('LOG-001 - Verify Login button is displayed on homepage header', async ({ page, headerPage, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.loginCTA).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('loginCTA');
            await ScreenshotHelper(page, screenshotDir, 'LOG-001-loginBtnHeader', testInfo);
        });

        test('LOG-002 - Verify Play Now on game page triggers login prompt', async ({ page, headerPage, loginModal, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.featuredGameCard.click();
            await page.waitForURL(/\/home\//, { timeout: 15000 });
            await expect(headerPage.playNowButton).toBeVisible({ timeout: 15000 });
            await headerPage.playNowButton.click();
            await expect(loginModal.dialog).toBeVisible({ timeout: 15000 });
            await expect(loginModal.username).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'LOG-002-playNowLogin', testInfo);
        });

        test('LOG-003 - Verify Login CTA on Sign Up prompt triggers login prompt', async ({ page, headerPage, loginModal, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickRegisterCTA();
            await expect(headerPage.signUpModalDialog).toBeVisible({ timeout: 15000 });
            await headerPage.signUpLoginLink.click();
            await expect(loginModal.dialog).toBeVisible({ timeout: 15000 });
            await expect(loginModal.username).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'LOG-003-signUpToLogin', testInfo);
        });

        test('LOG-004 - Verify Login button is displayed in hamburger menu', async ({ page, headerPage, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.clickMenu();
            await expect(headerPage.hamburgerLoginButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'LOG-004-hamburgerLoginBtn', testInfo);
        });

        test('LOG-005 - Verify tapping Favourite icon triggers login prompt', async ({ page, headerPage, loginModal, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.trendingFavouriteButton).toBeVisible({ timeout: 15000 });
            await headerPage.trendingFavouriteButton.click();
            await expect(loginModal.dialog).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'LOG-005-favLoginPrompt', testInfo);
        });

        test('LOG-006 - Verify special characters are not accepted in mobile number field', async ({ page, headerPage, loginModal, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await loginModal.username.pressSequentially('@#$%!', { delay: 50 });
            const value = await loginModal.username.inputValue();
            expect(value, `mobile field accepted special characters: "${value}"`).toMatch(/^\d*$/);
            await ScreenshotHelper(page, screenshotDir, 'LOG-006-specialChars', testInfo);
        });

        test('LOG-007 - Verify alphanumeric characters are not accepted in mobile number field', async ({ page, headerPage, loginModal, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await loginModal.username.pressSequentially('abc123xyz', { delay: 50 });
            const value = await loginModal.username.inputValue();
            expect(value, `mobile field accepted letters: "${value}"`).toMatch(/^\d*$/);
            await ScreenshotHelper(page, screenshotDir, 'LOG-007-alphanumeric', testInfo);
        });

        test('LOG-008 - Verify login fails with mobile number shorter than 9 digits', async ({ page, headerPage, loginModal, testData, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await loginModal.username.pressSequentially('1234567', { delay: 30 });
            await loginModal.password.fill(testData.loginValid.password);
            await loginModal.expectLoginRejected();
            await ScreenshotHelper(page, screenshotDir, 'LOG-008-shortMobile', testInfo);
        });

        test('LOG-009 - Verify login fails with mobile number longer than 9 digits', async ({ page, headerPage, loginModal, testData, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await loginModal.username.pressSequentially('1234567890123', { delay: 30 });
            const value = await loginModal.username.inputValue();
            if (value.length <= 9) {
                // field truncates excess digits — that IS the restriction working
                expect(value.length).toBeLessThanOrEqual(9);
            } else {
                await loginModal.password.fill(testData.loginValid.password);
                await loginModal.expectLoginRejected();
            }
            await ScreenshotHelper(page, screenshotDir, 'LOG-009-longMobile', testInfo);
        });

        test('LOG-010 - Verify login fails with empty password field', async ({ page, headerPage, loginModal, testData, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await loginModal.username.pressSequentially(testData.loginValid.mobile, { delay: 30 });
            // password left empty — submission must be blocked or rejected
            await loginModal.expectLoginRejected();
            await ScreenshotHelper(page, screenshotDir, 'LOG-010-emptyPassword', testInfo);
        });

        test('LOG-011 - Verify password field is masked by default', async ({ page, headerPage, loginModal, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await loginModal.password.fill('SamplePass123');
            await expect(loginModal.password).toHaveAttribute('type', 'password');
            await ScreenshotHelper(page, screenshotDir, 'LOG-011-passwordMasked', testInfo);
        });

        test('LOG-012 - Verify password visibility eye icon toggles masking', async ({ page, headerPage, loginModal, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await loginModal.password.fill('SamplePass123');
            await loginModal.eyeIcon.click();
            await expect(loginModal.password).toHaveAttribute('type', 'text', { timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'LOG-012-passwordVisible', testInfo);
            await loginModal.eyeIcon.click();
            await expect(loginModal.password).toHaveAttribute('type', 'password', { timeout: 5000 });
        });

        test('LOG-013 - Verify password shorter than 8 characters cannot log in', async ({ page, headerPage, loginModal, testData, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await loginModal.username.pressSequentially(testData.loginValid.mobile, { delay: 30 });
            await loginModal.password.fill('1234');
            await loginModal.expectLoginRejected();
            await ScreenshotHelper(page, screenshotDir, 'LOG-013-shortPassword', testInfo);
        });

        test('LOG-014 - Verify password field restricts input beyond 20 characters', async ({ page, headerPage, loginModal, testData, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            const longPassword = 'Abcdefgh1'.repeat(3); // 27 chars
            await loginModal.password.pressSequentially(longPassword, { delay: 20 });
            const value = await loginModal.password.inputValue();
            if (value.length <= 20) {
                expect(value.length).toBeLessThanOrEqual(20);
            } else {
                // no input cap — then submitting must fail with feedback
                await loginModal.username.pressSequentially(testData.loginValid.mobile, { delay: 30 });
                await loginModal.expectLoginRejected();
            }
            await ScreenshotHelper(page, screenshotDir, 'LOG-014-longPassword', testInfo);
        });

        test('LOG-015 - Verify error message for invalid credentials', async ({ page, headerPage, loginModal, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await loginModal.username.pressSequentially('731234567', { delay: 30 });
            await loginModal.password.fill('WrongPass123!');
            await loginModal.submitButton.click();
            // the exact user-facing error (confirmed live 2026-06-12) must appear, and the user stays logged out
            await expect(loginModal.invalidCredentialsError).toBeVisible({ timeout: 15000 });
            await expect(loginModal.dialog).toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'LOG-015-invalidCredsError', testInfo);
        });

        test('LOG-016 - Verify Submit button is disabled when mandatory fields are empty', async ({ page, headerPage, loginModal, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await expect(loginModal.submitButton).toBeDisabled({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'LOG-016-submitDisabled', testInfo);
        });

        test('LOG-017 - Verify Forgot Password CTA is displayed below Submit button', async ({ page, headerPage, loginModal, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await expect(loginModal.forgotPasswordLink).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'LOG-017-forgotPasswordCTA', testInfo);
        });

        test('LOG-018 - Verify tapping Forgot Password CTA opens Password Reset prompt', async ({ page, headerPage, loginModal, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await loginModal.forgotPasswordLink.click();
            // the login form must give way to the reset prompt
            await expect.poll(async () => {
                const loginFormGone = !(await loginModal.form.isVisible().catch(() => false));
                const titleChanged = !/^login$/i.test(((await loginModal.anyModalTitle.textContent().catch(() => 'Login')) ?? '').trim());
                return loginFormGone || titleChanged;
            }, { timeout: 10000 }).toBe(true);
            await ScreenshotHelper(page, screenshotDir, 'LOG-018-passwordResetPrompt', testInfo);
        });

        test('LOG-019 - Verify only valid account number is accepted on Password Reset prompt', async ({ page, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            test.fixme(true, 'needs the Password Reset prompt HTML to assert its fields/validation — provide markup to implement');
        });

        test('LOG-020 - Verify max attempts error on Password Reset prompt', async ({ page }: LoginSuiteFixtures) => {
            test.fixme(true, 'deliberately NOT automated: triggering max attempts could lock the shared test account\'s reset flow');
        });

        test('LOG-021 - Verify valid account number redirects to Update Password page', async ({ page }: LoginSuiteFixtures) => {
            test.fixme(true, 'deliberately NOT automated: sends a real OTP SMS to the test account\'s number — needs dedicated account/OTP access');
        });

        test('LOG-022 - Verify invalid OTP triggers error on Update Password page', async ({ page }: LoginSuiteFixtures) => {
            test.fixme(true, 'deliberately NOT automated: reaching this page sends a real OTP SMS — needs dedicated account/OTP access');
        });

        test('LOG-023 - Verify Register link navigates to Sign Up prompt', async ({ page, headerPage, loginModal, screenshotDir }: LoginSuiteFixtures, testInfo: TestInfo) => {
            await openLogin(headerPage, loginModal);
            await loginModal.registerLink.click();
            await expect(headerPage.signUpModalDialog).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'LOG-023-registerToSignUp', testInfo);
        });

    });
}
