import { Page, TestInfo, TestType } from '@playwright/test';
import { SignUpPage } from '../pages/SignUpPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

type SignupTestFixtures = {
    page: Page;
    signupPage: SignUpPage;
    screenshotDir: string;
    testData: any;
};

export async function runSignupTests(
    test: TestType<SignupTestFixtures, any>,
    url: string,
    options?: { excludeTags?: string[] }
) {

    test.describe('Jackpot City Signup - Homepage', () => {

        test.beforeEach(async ({ signupPage }: { signupPage: SignUpPage }) => {
            await signupPage.goto(url);
        });

        test("T1-Verify Sign-Up Button is visible on Homepage.", async ({ page, signupPage, screenshotDir }: SignupTestFixtures, testInfo: TestInfo) => {
            await signupPage.highlightRegisterButton();
            await ScreenshotHelper(page, screenshotDir, 'T1-signup-btn', testInfo);
        });

        test("T2-Verify Login Button is visible on Homepage.", async ({ page, signupPage, screenshotDir }: SignupTestFixtures, testInfo: TestInfo) => {
            await signupPage.highlightLoginButton();
            await ScreenshotHelper(page, screenshotDir, 'T2-login-btn', testInfo);
        });
    });

    test.describe('Jackpot City Signup - Form Validation', () => {

        test.beforeEach(async ({ signupPage }: { signupPage: SignUpPage }) => {
            await signupPage.goto(url);
            await signupPage.clickHomepageRegister();
        });

        test("T3-Click Register Button on Homepage.", async ({ page, screenshotDir }: SignupTestFixtures, testInfo: TestInfo) => {
            await ScreenshotHelper(page, screenshotDir, 'T3-register-click', testInfo);
        });

        test('T4-Verify Sign Up Form is visible.', async ({ page, signupPage, screenshotDir }: SignupTestFixtures, testInfo: TestInfo) => {
            await signupPage.highlightStep1Form();
            await ScreenshotHelper(page, screenshotDir, 'T4-signup-form', testInfo);
        });

        test('T8-Dialling Code.', async ({ page, signupPage, screenshotDir }: SignupTestFixtures, testInfo: TestInfo) => {
            await signupPage.highlightDiallingCode();
            await ScreenshotHelper(page, screenshotDir, 'T8-dialling-code', testInfo);
        });

        // --- Mobile Validation ---
        test('T9-Valid Mobile Number Format', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
            await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.step1.password);
            await signupPage.highlightMobileInput();
            await ScreenshotHelper(page, screenshotDir, 'T9-valid-mobile', testInfo);
        });

        test('T10-Short Mobile Number Validation', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
            await signupPage.testMobileValidation(testData.mobileValidation.short, testData.step1.password);
            await signupPage.highlightMobileInput();
            await ScreenshotHelper(page, screenshotDir, 'T10-short-mobile', testInfo);
        });

        test('T11-Long Mobile Number Validation', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
            await signupPage.testMobileValidation(testData.mobileValidation.long, testData.step1.password);
            await signupPage.highlightMobileInput();
            await ScreenshotHelper(page, screenshotDir, 'T11-long-mobile', testInfo);
        });

        test('T14-Empty Mobile Number Field', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
            await signupPage.testMobileValidation('', testData.step1.password);
            await signupPage.highlightMobileInput();
            await ScreenshotHelper(page, screenshotDir, 'T14-empty-mobile', testInfo);
        });

        // --- Password Validation ---
        if (!options?.excludeTags?.includes('T15')) {
            test('T15-Strong Password with Mixed Case', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.mixedCase);
                await signupPage.highlightPasswordInput();
                await ScreenshotHelper(page, screenshotDir, 'T15-mixed-case-pass', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T16')) {
            test('T16-Password with Numeric Characters', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.withNumbers);
                await signupPage.highlightPasswordInput();
                await ScreenshotHelper(page, screenshotDir, 'T16-numeric-pass', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T17')) {
            test('T17-Password with Special Characters', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.withSpecial);
                await signupPage.highlightPasswordInput();
                await ScreenshotHelper(page, screenshotDir, 'T17-special-pass', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T18')) {
            test('T18-Password Minimum Length', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.minLen);
                await signupPage.highlightPasswordInput();
                await ScreenshotHelper(page, screenshotDir, 'T18-min-pass', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T19')) {
            test('T19-Password Maximum Length', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.maxLen);
                await signupPage.highlightPasswordInput();
                await ScreenshotHelper(page, screenshotDir, 'T19-max-pass', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T20')) {
            test('T20-Password with All Character Types', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.allTypes);
                await signupPage.highlightPasswordInput();
                await ScreenshotHelper(page, screenshotDir, 'T20-all-types-pass', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T21')) {
            test('T21-Password with Spaces', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.withSpaces);
                await signupPage.highlightPasswordInput();
                await ScreenshotHelper(page, screenshotDir, 'T21-spaces-pass', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T22')) {
            test('T22-Weak Password Rejection', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.weak);
                await signupPage.highlightPasswordInput();
                await ScreenshotHelper(page, screenshotDir, 'T22-weak-pass', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T23')) {
            test('T23-Blank Password Rejection', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testMobileValidation(testData.mobileValidation.valid, '');
                await signupPage.highlightPasswordInput();
                await ScreenshotHelper(page, screenshotDir, 'T23-blank-pass', testInfo);
            });
        }

        // --- Confirm Password (GH only, excluded for TZ/ZA) ---
        if (!options?.excludeTags?.includes('T24')) {
            test('T24-Confirm Password Match Validation', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testConfirmPasswordValidation(testData.mobileValidation.valid, testData.step1.password, testData.step1.password);
                await signupPage.highlightConfirmPasswordInput();
                await ScreenshotHelper(page, screenshotDir, 'T24-confirm-pass-match', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T25')) {
            test('T25-Confirm Password Mismatch Validation', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testConfirmPasswordValidation(testData.mobileValidation.valid, testData.step1.password, 'WrongPass999!');
                await signupPage.highlightConfirmPasswordInput();
                await ScreenshotHelper(page, screenshotDir, 'T25-confirm-pass-mismatch', testInfo);
            });
        }

        // --- Name Validation (ZA only) ---
        if (!options?.excludeTags?.includes('T26')) {
            test('T26-Valid First Name and Surname', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testNameValidation(testData.nameValidation.validFirst, testData.nameValidation.validLast, testData.mobileValidation.valid, testData.step1.password);
                await signupPage.highlightNameInputs();
                await ScreenshotHelper(page, screenshotDir, 'T26-valid-names', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T27')) {
            test('T27-Names with Spaces', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testNameValidation(testData.nameValidation.spacesFirst, testData.nameValidation.spacesLast, testData.mobileValidation.valid, testData.step1.password);
                await signupPage.highlightNameInputs();
                await ScreenshotHelper(page, screenshotDir, 'T27-spaces-names', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T28')) {
            test('T28-Names with Hyphens', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testNameValidation(testData.nameValidation.hyphenFirst, testData.nameValidation.hyphenLast, testData.mobileValidation.valid, testData.step1.password);
                await signupPage.highlightNameInputs();
                await ScreenshotHelper(page, screenshotDir, 'T28-hyphen-names', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T29')) {
            test('T29-Blank First Name Rejection', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testNameValidation('', testData.nameValidation.validLast, testData.mobileValidation.valid, testData.step1.password);
                await signupPage.highlightNameInputs();
                await ScreenshotHelper(page, screenshotDir, 'T29-blank-first-name', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T30')) {
            test('T30-Blank Surname Rejection', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testNameValidation(testData.nameValidation.validFirst, '', testData.mobileValidation.valid, testData.step1.password);
                await signupPage.highlightNameInputs();
                await ScreenshotHelper(page, screenshotDir, 'T30-blank-last-name', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T31')) {
            test('T31-Names with Numeric Characters Rejection', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testNameValidation(testData.nameValidation.numericFirst, testData.nameValidation.numericLast, testData.mobileValidation.valid, testData.step1.password);
                await signupPage.highlightNameInputs();
                await ScreenshotHelper(page, screenshotDir, 'T31-numeric-names', testInfo);
            });
        }

        if (!options?.excludeTags?.includes('T32')) {
            test('T32-Names with Special Characters Rejection', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.testNameValidation(testData.nameValidation.specialFirst, testData.nameValidation.specialLast, testData.mobileValidation.valid, testData.step1.password);
                await signupPage.highlightNameInputs();
                await ScreenshotHelper(page, screenshotDir, 'T32-special-names', testInfo);
            });
        }

        // --- Preferred Language (TZ only) ---
        // if (!options?.excludeTags?.includes('T38')) {
        //     test('T38-Verify Preferred Language Dropdown', async ({ page, signupPage, screenshotDir }: SignupTestFixtures, testInfo: TestInfo) => {
        //         await signupPage.highlightPreferredLanguage();
        //         await ScreenshotHelper(page, screenshotDir, 'T38-preferred-language', testInfo);
        //     });
        // }

        // --- Referral Code (TZ only) ---
        if (!options?.excludeTags?.includes('T39')) {
            test('T39-Verify Referral Code Field', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.expandAndFillReferralCode(testData.step1.referralCode ?? 'TEST123');
                await signupPage.highlightReferralCodeInput();
                await ScreenshotHelper(page, screenshotDir, 'T39-referral-code', testInfo);
            });
        }

        // --- Agree to All Checkbox (TZ only) ---
        if (!options?.excludeTags?.includes('T40')) {
            test('T40-Verify Agree to All Checkbox', async ({ page, signupPage, screenshotDir }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.clickAgreeToAll();
                await signupPage.highlightAgreeToAllCheckbox();
                await ScreenshotHelper(page, screenshotDir, 'T40-agree-to-all', testInfo);
            });
        }

        // --- Terms & Conditions Checkbox ---
        if (!options?.excludeTags?.includes('T41')) {
            test('T41-Verify Terms & Conditions Checkbox', async ({ page, signupPage, screenshotDir }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.clickTermsCheckbox();
                await signupPage.highlightTermsCheckbox();
                await ScreenshotHelper(page, screenshotDir, 'T41-terms-checkbox', testInfo);
            });
        }

        // --- Promotions Checkbox ---
        if (!options?.excludeTags?.includes('T42')) {
            test('T42-Verify Promotions Checkbox', async ({ page, signupPage, screenshotDir }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.clickPromoCheckbox();
                await signupPage.highlightPromoCheckbox();
                await ScreenshotHelper(page, screenshotDir, 'T42-promo-checkbox', testInfo);
            });
        }

        // --- Date of Birth (GH only) ---
        if (!options?.excludeTags?.includes('T43')) {
            test('T43-Verify Date of Birth Picker', async ({ page, signupPage, screenshotDir }: SignupTestFixtures, testInfo: TestInfo) => {
                await signupPage.highlightDOBPicker();
                await ScreenshotHelper(page, screenshotDir, 'T43-dob-picker', testInfo);
            });
        }

        // --- Sign Up Button State ---
        test('T44-Verify Sign Up Button is disabled when form is empty', async ({ page, signupPage, screenshotDir }: SignupTestFixtures, testInfo: TestInfo) => {
            await signupPage.highlightSignUpButton();
            await ScreenshotHelper(page, screenshotDir, 'T44-signup-btn-disabled', testInfo);
        });

        // --- Step 2 Validation (ZA only) ---
        if (!options?.excludeTags?.includes('T33')) {
            test.describe('Step 2 Validation', () => {
                // This hook fills step 1 *before* each test in this sub-group
                test.beforeEach(async ({ signupPage, testData, page }: { signupPage: SignUpPage, testData: any, page: Page }) => {
                    await signupPage.fillStep1({
                        mobile: testData.step1.mobile,
                        pass: testData.step1.password,
                        fName: testData.step1.firstName,
                        lName: testData.step1.lastName,
                        email: testData.step1.email
                    });
                    await page.waitForTimeout(10000);
                    await signupPage.clickNext();
                    await page.waitForTimeout(1000); // Wait for step 2 to load
                });

                test('T33-Valid SA ID', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                    await signupPage.fillStep2SA(testData.step2.validSAId);
                    await signupPage.highlightSAIdInput();
                    await ScreenshotHelper(page, screenshotDir, 'T33-valid-sa-id', testInfo);
                });

                if (!options?.excludeTags?.includes('T34')) {
                    test('T34-Invalid South African ID Validation', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                        await signupPage.fillStep2SA(testData.step2.shortSAId);
                        await signupPage.highlightSAIdInput();
                        await ScreenshotHelper(page, screenshotDir, 'T34-short-id', testInfo);

                        await signupPage.fillStep2SA(testData.step2.lettersSAId);
                        await signupPage.highlightSAIdInput();
                        await ScreenshotHelper(page, screenshotDir, 'T34-letters-id', testInfo);

                        await signupPage.fillStep2SA(testData.step2.specialSAId);
                        await signupPage.highlightSAIdInput();
                        await ScreenshotHelper(page, screenshotDir, 'T34-special-id', testInfo);
                    });
                }

                if (!options?.excludeTags?.includes('T35')) {
                    test('T35-Valid Passport Number Format', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                        await signupPage.fillStep2Passport(testData.step2.validPassport);
                        await signupPage.highlightPassportInput();
                        await ScreenshotHelper(page, screenshotDir, 'T35-valid-passport', testInfo);
                    });
                }

                if (!options?.excludeTags?.includes('T36')) {
                    test('T36-Invalid Passport Number Validation', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                        await signupPage.fillStep2Passport(testData.step2.shortPassport);
                        await signupPage.highlightPassportInput();
                        await ScreenshotHelper(page, screenshotDir, 'T36-short-passport', testInfo);

                        await signupPage.fillStep2Passport(testData.step2.specialPassport);
                        await signupPage.highlightPassportInput();
                        await ScreenshotHelper(page, screenshotDir, 'T36-special-passport', testInfo);

                        await signupPage.fillStep2Passport(testData.step2.numericPassport);
                        await signupPage.highlightPassportInput();
                        await ScreenshotHelper(page, screenshotDir, 'T36-numeric-passport', testInfo);
                    });
                }

                if (!options?.excludeTags?.includes('T37')) {
                    test('T37-Complete Registration', async ({ page, signupPage, screenshotDir, testData }: SignupTestFixtures, testInfo: TestInfo) => {
                        await signupPage.fillStep2SA(testData.step2.validSAId);
                        await signupPage.completeStep2Details();
                        await page.waitForTimeout(1000);
                        await ScreenshotHelper(page, screenshotDir, 'T37-complete-registration', testInfo);
                    });
                }
            });
        }
    });
}
