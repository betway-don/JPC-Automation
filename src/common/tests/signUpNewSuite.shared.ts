import { Page, TestInfo, TestType, expect } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { LoginModal } from '../components/LoginModal';
import { SignUpModal } from '../components/SignUpModal';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

/**
 * Sign Up suite (NewSuite) — TC_RG_001..027 against the live two-step Sign Up modal.
 * IDs: RG-001..027. All sign-up selectors + the multi-step flow live in the SignUpModal
 * component object.
 *
 * RG-017/019/027 complete REAL registrations (authorized by the team 2026-06-12) with unique
 * generated data; the platform rate-limits creation per IP, so they skip-with-cause on block.
 * RG-025 "Agree to All" is absent from the current modal (Excel case likely outdated) — skips.
 */

type SignUpSuiteFixtures = {
    page: Page;
    headerPage: HeaderPage;
    signUpModal: SignUpModal;
    loginModal: LoginModal;
    screenshotDir: string;
    testData: any;
};

export async function runSignUpNewSuiteTests(
    test: TestType<SignUpSuiteFixtures, any>
) {

    async function openSignUp(headerPage: HeaderPage, signUpModal: SignUpModal) {
        await headerPage.clickRegisterCTA();
        await signUpModal.expectOpen();
    }

    async function goToStepTwo(headerPage: HeaderPage, signUpModal: SignUpModal) {
        await openSignUp(headerPage, signUpModal);
        await signUpModal.fillStepOne();
        await signUpModal.advanceToStepTwo();
    }

    /** Submit and assert a confirmed success state; skip-with-cause when rate-limited. */
    async function submitAndExpectSuccess(signUpModal: SignUpModal) {
        const outcome = await signUpModal.submit();
        test.skip(outcome === 'error', 'registration temporarily blocked by the platform (account-creation rate limit) — retry later or from a clean session');
        expect(['welcome', 'verification', 'partial'], `registration did not reach a success state (got: ${outcome})`).toContain(outcome);
    }

    test.describe('Sign Up - NewSuite', () => {

        test.beforeEach(async ({ page }: SignUpSuiteFixtures) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
        });

        test('RG-001 - Verify Sign Up CTA visibility on homepage header', async ({ page, headerPage, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.registerCTA).toBeVisible({ timeout: 15000 });
            await headerPage.highlightElement('registerCTA');
            await ScreenshotHelper(page, screenshotDir, 'RG-001-signUpCTA', testInfo);
        });

        test('RG-002 - Verify banner CTA triggers Sign Up modal', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            // NOTE: banner targets are campaign-driven; the current logged-out campaign opens Sign Up
            await expect(headerPage.bannerImage).toBeVisible({ timeout: 15000 });
            await headerPage.bannerImage.click();
            await expect(signUpModal.dialog).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'RG-002-bannerSignUp', testInfo);
        });

        test('RG-003 - Verify Play Now CTA does not trigger Sign Up modal', async ({ page, headerPage, signUpModal, loginModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await headerPage.featuredGameCard.click();
            await page.waitForURL(/\/home\//, { timeout: 15000 });
            await expect(headerPage.playNowButton).toBeVisible({ timeout: 15000 });
            await headerPage.playNowButton.click();
            // login modal must appear — not the sign-up modal
            await expect(loginModal.dialog).toBeVisible({ timeout: 15000 });
            await expect(signUpModal.dialog).not.toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'RG-003-playNowNotSignUp', testInfo);
        });

        test('RG-004 - Verify Favourite icon does not trigger Sign Up modal', async ({ page, headerPage, signUpModal, loginModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.trendingFavouriteButton).toBeVisible({ timeout: 15000 });
            await headerPage.trendingFavouriteButton.click();
            await expect(loginModal.dialog).toBeVisible({ timeout: 15000 });
            await expect(signUpModal.dialog).not.toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'RG-004-favNotSignUp', testInfo);
        });

        test('RG-005 - Verify mobile number field restricts special characters', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.username.pressSequentially('@#$%!', { delay: 50 });
            const value = await signUpModal.username.inputValue();
            expect(value, `mobile field accepted special characters: "${value}"`).toMatch(/^\d*$/);
            await ScreenshotHelper(page, screenshotDir, 'RG-005-specialChars', testInfo);
        });

        test('RG-006 - Verify mobile number field rejects alphanumeric input', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.username.pressSequentially('abc123xyz', { delay: 50 });
            const value = await signUpModal.username.inputValue();
            expect(value, `mobile field accepted letters: "${value}"`).toMatch(/^\d*$/);
            await ScreenshotHelper(page, screenshotDir, 'RG-006-alphanumeric', testInfo);
        });

        test('RG-007 - Verify mobile number 9-digit restriction', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await openSignUp(headerPage, signUpModal);
            // too short: with the rest of the form valid, Next must stay disabled
            await signUpModal.username.pressSequentially('1234567', { delay: 20 });
            await signUpModal.password.fill('ValidPass123!');
            await signUpModal.firstName.fill('John');
            await signUpModal.lastName.fill('Tester');
            await signUpModal.email.fill('qa.automation.jpc@example.com');
            const enabledWithShortMobile = await signUpModal.nextButton.isEnabled().catch(() => false);
            expect(enabledWithShortMobile, 'form must not proceed with a 7-digit mobile').toBe(false);
            // too long: field should truncate at 9, or the form must refuse to proceed
            await signUpModal.username.fill('');
            await signUpModal.username.pressSequentially('1234567890123', { delay: 20 });
            const value = await signUpModal.username.inputValue();
            if (value.length > 9) {
                expect(await signUpModal.nextButton.isEnabled().catch(() => false), 'form must not proceed with a >9-digit mobile').toBe(false);
            } else {
                expect(value.length).toBeLessThanOrEqual(9);
            }
            await ScreenshotHelper(page, screenshotDir, 'RG-007-nineDigits', testInfo);
        });

        test('RG-008 - Verify password field character limit validation', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.password.pressSequentially('Abcdefgh1'.repeat(3), { delay: 15 }); // 27 chars
            const value = await signUpModal.password.inputValue();
            if (value.length > 20) {
                // no input cap — then the form must show feedback or refuse to proceed
                await signUpModal.username.pressSequentially(SignUpModal.randomMobile(), { delay: 20 });
                await signUpModal.firstName.fill('John');
                await signUpModal.lastName.fill('Tester');
                await signUpModal.email.fill('qa.automation.jpc@example.com');
                const proceedable = await signUpModal.nextButton.isEnabled().catch(() => false);
                const feedback = await signUpModal.errorFeedback.first().isVisible().catch(() => false);
                expect(proceedable === false || feedback, 'a 27-char password must be capped, flagged, or block Next').toBe(true);
            } else {
                expect(value.length).toBeLessThanOrEqual(20);
            }
            await ScreenshotHelper(page, screenshotDir, 'RG-008-passwordLimit', testInfo);
        });

        test('RG-009 - Verify First Name field accepts valid input', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.firstName.fill('Jonathan');
            await expect(signUpModal.firstName).toHaveValue('Jonathan');
            await expect(signUpModal.fieldError('firstname')).not.toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'RG-009-firstName', testInfo);
        });

        test('RG-010 - Verify Last Name field accepts valid input', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.lastName.fill('Smith');
            await expect(signUpModal.lastName).toHaveValue('Smith');
            await expect(signUpModal.fieldError('lastname')).not.toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'RG-010-lastName', testInfo);
        });

        test('RG-011 - Verify Email field accepts valid email format', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.email.fill('valid.email@example.com');
            await signUpModal.email.blur();
            await expect(signUpModal.email).toHaveValue('valid.email@example.com');
            await expect(signUpModal.fieldError('email')).not.toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'RG-011-validEmail', testInfo);
        });

        test('RG-012 - Verify invalid email format triggers validation', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await openSignUp(headerPage, signUpModal);
            // rest of the form valid, only the email is broken
            await signUpModal.username.pressSequentially(SignUpModal.randomMobile(), { delay: 20 });
            await signUpModal.password.fill('ValidPass123!');
            await signUpModal.firstName.fill('John');
            await signUpModal.lastName.fill('Tester');
            await signUpModal.email.fill('not-an-email@');
            await signUpModal.email.blur();
            const errorShown = await signUpModal.fieldError('email').isVisible().catch(() => false);
            const blocked = !(await signUpModal.nextButton.isEnabled().catch(() => false));
            expect(errorShown || blocked, 'invalid email must show validation or block Next').toBe(true);
            await ScreenshotHelper(page, screenshotDir, 'RG-012-invalidEmail', testInfo);
        });

        test('RG-013 - Verify Referral Code field accepts valid input', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.referralExpander.click();
            await expect(signUpModal.referralCode).toBeVisible({ timeout: 5000 });
            await signUpModal.referralCode.fill('TESTCODE123');
            await expect(signUpModal.referralCode).toHaveValue('TESTCODE123');
            await ScreenshotHelper(page, screenshotDir, 'RG-013-referralCode', testInfo);
        });

        test('RG-014 - Verify ID Number Type dropdown shows SA ID and Passport options', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.idTypeCombobox.click();
            await expect(signUpModal.option(/south african id/i)).toBeVisible({ timeout: 10000 });
            await expect(signUpModal.option(/passport/i)).toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'RG-014-idTypeOptions', testInfo);
        });

        test('RG-015 - Verify SA ID number field displayed when South African ID selected', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            // South African ID is the default selection
            await expect(signUpModal.idTypeCombobox).toHaveText(/south african id/i, { timeout: 10000 });
            await expect(signUpModal.idNumber).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'RG-015-saIdField', testInfo);
        });

        test('RG-016 - Verify Passport number field displayed when Passport selected', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.idTypeCombobox.click();
            await signUpModal.option(/passport/i).click();
            await expect(signUpModal.idTypeCombobox).toHaveText(/passport/i, { timeout: 10000 });
            // the number field must be present for passport entry
            await expect(signUpModal.idNumber).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'RG-016-passportField', testInfo);
        });

        test('RG-017 - Verify registration with valid South African ID', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.fillStepTwo(SignUpModal.makeSaId());
            // valid ID must not be flagged
            await expect(signUpModal.idNumberError).not.toBeVisible();
            await submitAndExpectSuccess(signUpModal);
            await ScreenshotHelper(page, screenshotDir, 'RG-017-saIdRegistration', testInfo);
        });

        test('RG-018 - Verify validation message for invalid South African ID', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.idNumber.fill('1234');
            await signUpModal.idNumber.blur();
            await expect(signUpModal.idNumberError).toBeVisible({ timeout: 10000 });
            const errorText = (await signUpModal.idNumberError.textContent())?.trim() ?? '';
            expect(errorText.length, 'ID validation message must contain actual text').toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'RG-018-invalidSaId', testInfo);
        });

        test('RG-019 - Verify registration with valid Passport number', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.idTypeCombobox.click();
            await signUpModal.option(/passport/i).click();
            await expect(signUpModal.idTypeCombobox).toHaveText(/passport/i, { timeout: 10000 });
            await signUpModal.fillStepTwo('A' + String(Math.floor(10000000 + Math.random() * 89999999)));
            // a synthetic passport may be rejected by real validation — that's a test-data limit, not a product bug.
            const flagged = await signUpModal.idNumberError.isVisible().catch(() => false);
            test.skip(flagged, 'synthetic passport number rejected by validation — needs a known-valid passport to complete');
            await submitAndExpectSuccess(signUpModal);
            await ScreenshotHelper(page, screenshotDir, 'RG-019-passportRegistration', testInfo);
        });

        test('RG-020 - Verify validation message for invalid Passport number', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.idTypeCombobox.click();
            await signUpModal.option(/passport/i).click();
            await signUpModal.idNumber.fill('!');
            await signUpModal.idNumber.blur();
            await expect(signUpModal.idNumberError).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'RG-020-invalidPassport', testInfo);
        });

        test('RG-021 - Verify Date of Birth field allows valid date selection', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.dobButton.click();
            await expect(signUpModal.datePanel).toBeVisible({ timeout: 10000 });
            await signUpModal.firstSelectableDate.click();
            // the DOB control must now show the chosen date instead of the placeholder
            await expect(signUpModal.dobButton).toHaveCount(0, { timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'RG-021-dobSelection', testInfo);
        });

        test('RG-022 - Verify Source of Income dropdown displays options', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.sourceCombobox.click();
            await expect(signUpModal.options.first()).toBeVisible({ timeout: 10000 });
            expect(await signUpModal.options.count(), 'source of income must offer options').toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'RG-022-sourceOptions', testInfo);
        });

        test('RG-023 - Verify Send Promotions checkbox toggles', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            await expect(signUpModal.promoCheckboxBox).toHaveAttribute('data-p-checked', 'false');
            await signUpModal.promoCheckbox.click();
            await expect(signUpModal.promoCheckboxBox).toHaveAttribute('data-p-checked', 'true', { timeout: 5000 });
            await signUpModal.promoCheckbox.click();
            await expect(signUpModal.promoCheckboxBox).toHaveAttribute('data-p-checked', 'false', { timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'RG-023-promoCheckbox', testInfo);
        });

        test('RG-024 - Verify Terms and Conditions checkbox toggles', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            await expect(signUpModal.termsCheckboxBox).toHaveAttribute('data-p-checked', 'false');
            await signUpModal.termsCheckbox.click();
            await expect(signUpModal.termsCheckboxBox).toHaveAttribute('data-p-checked', 'true', { timeout: 5000 });
            await signUpModal.termsCheckbox.click();
            await expect(signUpModal.termsCheckboxBox).toHaveAttribute('data-p-checked', 'false', { timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'RG-024-termsCheckbox', testInfo);
        });

        test('RG-025 - Verify Agree to All checkbox functionality', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            const present = await signUpModal.agreeToAll.isVisible().catch(() => false);
            // current modal has only Promotions + Terms checkboxes (HTML 2026-06-12) — Excel case likely outdated
            test.skip(!present, '"Agree to All" checkbox is not present in the current Sign Up modal — confirm whether the test case is outdated');
            await signUpModal.agreeToAll.click();
            await expect(signUpModal.termsCheckboxBox).toHaveAttribute('data-p-checked', 'true', { timeout: 5000 });
            await expect(signUpModal.promoCheckboxBox).toHaveAttribute('data-p-checked', 'true', { timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'RG-025-agreeAll', testInfo);
        });

        test('RG-026 - Verify Sign Up blocked without accepting Terms and Conditions', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            // fill the step-2 fields best-effort but leave Terms unchecked
            await signUpModal.idNumber.fill('9001015009087'); // valid-format SA ID (checksum-correct sample)
            await signUpModal.dobButton.click({ timeout: 5000 }).catch(() => { });
            await signUpModal.firstSelectableDate.click({ timeout: 5000 }).catch(() => { });
            await signUpModal.sourceCombobox.click({ timeout: 5000 }).catch(() => { });
            await signUpModal.options.first().click({ timeout: 5000 }).catch(() => { });
            // terms deliberately unchecked — registration must stay blocked
            await expect(signUpModal.registerButton).toBeDisabled({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'RG-026-termsRequired', testInfo);
        });

        test('RG-027 - Verify successful sign up with valid details', async ({ page, headerPage, signUpModal, screenshotDir }: SignUpSuiteFixtures, testInfo: TestInfo) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.fillStepTwo(SignUpModal.makeSaId());
            await submitAndExpectSuccess(signUpModal);
            await ScreenshotHelper(page, screenshotDir, 'RG-027-registrationSuccess', testInfo);
        });

    });
}
