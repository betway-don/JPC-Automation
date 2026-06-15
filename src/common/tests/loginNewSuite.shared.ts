import { Page, TestType, expect } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { LoginModal } from '../components/LoginModal';

/**
 * Login suite (NewSuite) — LOG-001..023 against the live login modal.
 * Every login-modal selector + flow lives in the LoginModal component object.
 *
 * Deliberately skipped (need a policy decision / dedicated account):
 *  - LOG-020 max-attempts: could lock the shared account's password reset.
 *  - LOG-021/022: trigger real OTP SMS sends.
 */

type LoginSuiteFixtures = {
    page: Page;
    headerPage: HeaderPage;
    loginModal: LoginModal;
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

        test.beforeEach(async ({ headerPage }: LoginSuiteFixtures) => {
            await headerPage.navigateTo('/');
        });

        test('LOG-001 - Login button is shown in the header', async ({ headerPage }: LoginSuiteFixtures) => {
            await expect(headerPage.loginButton).toBeVisible();
        });

        test('LOG-002 - Play Now on a game page prompts login', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await headerPage.featuredGameCard.click();
            await headerPage.expectAt(/\/home\//);
            await expect(headerPage.playNowButton).toBeVisible();
            await headerPage.playNowButton.click();
            await expect(loginModal.dialog).toBeVisible();
            await expect(loginModal.username).toBeVisible();
        });

        test('LOG-003 - the Login link on the Sign Up prompt opens login', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await headerPage.clickRegisterCTA();
            await expect(headerPage.signUpModalDialog).toBeVisible();
            await headerPage.signUpLoginLink.click();
            await expect(loginModal.dialog).toBeVisible();
            await expect(loginModal.username).toBeVisible();
        });

        test('LOG-004 - Login button is shown in the hamburger menu', async ({ headerPage }: LoginSuiteFixtures) => {
            await headerPage.clickMenu();
            await expect(headerPage.hamburgerLoginButton).toBeVisible();
        });

        test('LOG-005 - tapping a favourite icon prompts login', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await expect(headerPage.trendingFavouriteButton).toBeVisible();
            await headerPage.trendingFavouriteButton.click();
            await expect(loginModal.dialog).toBeVisible();
        });

        test('LOG-006 - the mobile field rejects special characters', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.expectMobileRejectsNonDigits('@#$%!');
        });

        test('LOG-007 - the mobile field rejects letters', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.expectMobileRejectsNonDigits('abc123xyz');
        });

        test('LOG-008 - login fails with a mobile shorter than 9 digits', async ({ headerPage, loginModal, testData }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.attemptAndExpectRejected('1234567', testData.loginValid.password);
        });

        test('LOG-009 - a mobile longer than 9 digits is capped or rejected', async ({ headerPage, loginModal, testData }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.expectLongMobileHandled('1234567890123', testData.loginValid.password);
        });

        test('LOG-010 - login fails with an empty password', async ({ headerPage, loginModal, testData }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.attemptAndExpectRejected(testData.loginValid.mobile);
        });

        test('LOG-011 - the password field is masked by default', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.fillPassword('SamplePass123');
            await loginModal.expectPasswordMasked();
        });

        test('LOG-012 - the eye icon toggles password visibility', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.fillPassword('SamplePass123');
            await loginModal.togglePasswordVisibility();
            await loginModal.expectPasswordVisible();
            await loginModal.togglePasswordVisibility();
            await loginModal.expectPasswordMasked();
        });

        test('LOG-013 - login fails with a password shorter than 8 chars', async ({ headerPage, loginModal, testData }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.attemptAndExpectRejected(testData.loginValid.mobile, '1234');
        });

        test('LOG-014 - a password longer than 20 chars is capped or rejected', async ({ headerPage, loginModal, testData }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.expectLongPasswordHandled(testData.loginValid.mobile);
        });

        test('LOG-015 - invalid credentials show an error', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.typeUsername('731234567');
            await loginModal.fillPassword('WrongPass123!');
            await loginModal.submit();
            await loginModal.expectInvalidCredentials();
        });

        test('LOG-016 - Submit is disabled when fields are empty', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.expectSubmitDisabled();
        });

        test('LOG-017 - the Forgot Password link is shown', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.expectForgotPasswordVisible();
        });

        test('LOG-018 - Forgot Password opens the reset prompt', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.openPasswordReset();
            await loginModal.expectSwitchedToReset();
        });

        test('LOG-019 - only a valid account number is accepted on the reset prompt', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.openPasswordReset();
            await loginModal.expectSwitchedToReset();
            await loginModal.expectResetPromptValidatesMobile();   // stops before Continue → no OTP sent
        });

        test('LOG-020 - max attempts error on the reset prompt', async () => {
            test.fixme(true, 'deliberately NOT automated: could lock the shared account\'s reset flow');
        });

        test('LOG-021 - a valid account number redirects to Update Password', async () => {
            test.fixme(true, 'deliberately NOT automated: sends a real OTP SMS — needs a dedicated account');
        });

        test('LOG-022 - invalid OTP shows an error on Update Password', async () => {
            test.fixme(true, 'deliberately NOT automated: reaching this page sends a real OTP SMS');
        });

        test('LOG-023 - the Register link opens the Sign Up prompt', async ({ headerPage, loginModal }: LoginSuiteFixtures) => {
            await openLogin(headerPage, loginModal);
            await loginModal.openRegister();
            await expect(headerPage.signUpModalDialog).toBeVisible();
        });

    });
}
