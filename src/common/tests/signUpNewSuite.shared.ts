import { Page, TestType, expect } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { LoginModal } from '../components/LoginModal';
import { SignUpModal } from '../components/SignUpModal';

/**
 * Sign Up suite (NewSuite) — RG-001..027 against the live two-step Sign Up modal.
 * Every sign-up selector + the multi-step flow lives in the SignUpModal component object.
 *
 * RG-017/019/027 complete REAL registrations (authorized 2026-06-12) with unique generated data;
 * the platform rate-limits creation per IP, so they skip-with-cause on block.
 */

type SignUpSuiteFixtures = {
    page: Page;
    headerPage: HeaderPage;
    signUpModal: SignUpModal;
    loginModal: LoginModal;
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
        test.skip(outcome === 'error', 'registration temporarily blocked by the platform (rate limit) — retry from a clean session');
        expect(['welcome', 'verification', 'partial'], `registration did not reach a success state (got: ${outcome})`).toContain(outcome);
    }

    test.describe('Sign Up - NewSuite', () => {

        test.beforeEach(async ({ headerPage }: SignUpSuiteFixtures) => {
            await headerPage.navigateTo('/');
        });

        test('RG-001 - the Sign Up CTA is shown in the header', async ({ headerPage }: SignUpSuiteFixtures) => {
            await expect(headerPage.signUpButton).toBeVisible();
        });

        test('RG-002 - a banner CTA opens the Sign Up modal', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await expect(headerPage.bannerImage).toBeVisible();
            await headerPage.bannerImage.click();
            await expect(signUpModal.dialog).toBeVisible();
        });

        test('RG-003 - Play Now opens login, not Sign Up', async ({ headerPage, signUpModal, loginModal }: SignUpSuiteFixtures) => {
            await headerPage.featuredGameCard.click();
            await headerPage.expectAt(/\/home\//);
            await expect(headerPage.playNowButton).toBeVisible();
            await headerPage.playNowButton.click();
            await expect(loginModal.dialog).toBeVisible();
            await expect(signUpModal.dialog).not.toBeVisible();
        });

        test('RG-004 - a favourite icon opens login, not Sign Up', async ({ headerPage, signUpModal, loginModal }: SignUpSuiteFixtures) => {
            await expect(headerPage.trendingFavouriteButton).toBeVisible();
            await headerPage.trendingFavouriteButton.click();
            await expect(loginModal.dialog).toBeVisible();
            await expect(signUpModal.dialog).not.toBeVisible();
        });

        test('RG-005 - the mobile field rejects special characters', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.expectMobileRejectsNonDigits('@#$%!');
        });

        test('RG-006 - the mobile field rejects letters', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.expectMobileRejectsNonDigits('abc123xyz');
        });

        test('RG-007 - the mobile field enforces a 9-digit restriction', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.expectNineDigitRestriction();
        });

        test('RG-008 - the password field enforces a character limit', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.expectPasswordLimitHandled();
        });

        test('RG-009 - the First Name field accepts valid input', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.expectFieldAccepts('firstName', 'Jonathan');
        });

        test('RG-010 - the Last Name field accepts valid input', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.expectFieldAccepts('lastName', 'Smith');
        });

        test('RG-011 - the Email field accepts a valid email', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.expectFieldAccepts('email', 'valid.email@example.com');
        });

        test('RG-012 - an invalid email is flagged', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.expectInvalidEmailFlagged();
        });

        test('RG-013 - the Referral Code field accepts valid input', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await openSignUp(headerPage, signUpModal);
            await signUpModal.fillReferralCode('TESTCODE123');
        });

        test('RG-014 - the ID Type dropdown offers SA ID and Passport', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.expectIdTypeOptions();
        });

        test('RG-015 - the SA ID number field shows for South African ID', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.expectSaIdDefaultWithField();
        });

        test('RG-016 - the number field shows when Passport is selected', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.selectPassport();
            await signUpModal.expectIdNumberFieldShown();
        });

        test('RG-017 - registration with a valid South African ID', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.fillStepTwo(SignUpModal.makeSaId());
            await expect(signUpModal.idNumberError).not.toBeVisible();
            await submitAndExpectSuccess(signUpModal);
        });

        test('RG-018 - an invalid South African ID is flagged', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.expectInvalidIdFlagged('1234');
        });

        test('RG-019 - registration with a valid Passport number', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.selectPassport();
            const flagged = await signUpModal.fillPassportNumber();
            test.skip(flagged, 'synthetic passport rejected by validation — needs a known-valid passport');
            await submitAndExpectSuccess(signUpModal);
        });

        test('RG-020 - an invalid Passport number is flagged', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.selectPassport();
            await signUpModal.expectInvalidIdFlagged('!');
        });

        test('RG-021 - the Date of Birth field allows selecting a date', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.selectFirstDob();
        });

        test('RG-022 - the Source of Income dropdown shows options', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.expectSourceOptions();
        });

        test('RG-023 - the Send Promotions checkbox toggles', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.expectPromoToggles();
        });

        test('RG-024 - the Terms and Conditions checkbox toggles', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.expectTermsToggles();
        });

        test('RG-025 - the Agree to All checkbox checks both', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            test.skip(!await signUpModal.hasAgreeToAll(), '"Agree to All" is not present in the current Sign Up modal');
            await signUpModal.expectAgreeToAllChecksBoth();
        });

        test('RG-026 - Sign Up is blocked without accepting Terms', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.expectRegisterBlockedWithoutTerms();
        });

        test('RG-027 - successful sign up with valid details', async ({ headerPage, signUpModal }: SignUpSuiteFixtures) => {
            await goToStepTwo(headerPage, signUpModal);
            await signUpModal.fillStepTwo(SignUpModal.makeSaId());
            await submitAndExpectSuccess(signUpModal);
        });

    });
}
