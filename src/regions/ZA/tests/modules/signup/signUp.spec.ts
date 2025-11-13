// 1. Import 'test' from your new fixture file
import { test } from '../../../fixtures/jackpotCityFixture'; // Adjust path
import { ScreenshotHelper } from '../../../../../regions/Common-Flows/ScreenshotHelper'; // Adjust path
import { Page } from '@playwright/test';

// Note: We no longer need 'beforeAll' or 'browser'/'context' management.
// The test fixture handles all setup and teardown for each test.

test.describe('Jackpot City Signup - Homepage', () => {

    test.beforeEach(async ({ signupPage }) => {
        await signupPage.goto();
    });

    test("T1-Verify Sign-Up Button is visible on Homepage.", async ({ page, signupPage, screenshotDir }, testInfo) => {
        await signupPage.highlightRegisterButton();
        await ScreenshotHelper(page, screenshotDir, 'T1-signup-btn', testInfo);
    });

    test("T2-Verify Login Button is visible on Homepage.", async ({ page, signupPage, screenshotDir }, testInfo) => {
        await signupPage.highlightLoginButton();
        await ScreenshotHelper(page, screenshotDir, 'T2-login-btn', testInfo);
    });
});

test.describe('Jackpot City Signup - Form Validation', () => {

    // This hook navigates AND clicks the register button before EVERY test
    test.beforeEach(async ({ signupPage }) => {
        await signupPage.goto();
        await signupPage.clickHomepageRegister();
    });

    test("T3-Click Register Button on Homepage.", async ({ page, screenshotDir }, testInfo) => {
        // This test is just to show the form is open
        await ScreenshotHelper(page, screenshotDir, 'T3-register-click', testInfo);
    });

    test('T4-Verify Sign Up Form is visible.', async ({ page, signupPage, screenshotDir }, testInfo) => {
        await signupPage.highlightStep1Form();
        await ScreenshotHelper(page, screenshotDir, 'T4-signup-form', testInfo);
    });

    test('T8-Dialling Code.', async ({ page, signupPage, screenshotDir }, testInfo) => {
        await signupPage.highlightDiallingCode();
        await ScreenshotHelper(page, screenshotDir, 'T8-dialling-code', testInfo);
    });

    // --- Mobile Validation ---
    test('T9-Valid Mobile Number Format', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.step1.password, testData.step1.email);
        await signupPage.highlightMobileInput();
        await ScreenshotHelper(page, screenshotDir, 'T9-valid-mobile', testInfo);
    });

    test('T10-Short Mobile Number Validation', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation(testData.mobileValidation.short, testData.step1.password, testData.step1.email);
        await signupPage.highlightMobileInput();
        await ScreenshotHelper(page, screenshotDir, 'T10-short-mobile', testInfo);
    });
    
    test('T11-Long Mobile Number Validation', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation(testData.mobileValidation.long, testData.step1.password, testData.step1.email);
        await signupPage.highlightMobileInput();
        await ScreenshotHelper(page, screenshotDir, 'T11-long-mobile', testInfo);
    });

    test('T14-Empty Mobile Number Field', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation('', testData.step1.password, testData.step1.email);
        await signupPage.highlightMobileInput();
        await ScreenshotHelper(page, screenshotDir, 'T14-empty-mobile', testInfo);
    });
    
    // --- Password Validation ---
    test('T15-Strong Password with Mixed Case', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.mixedCase, testData.step1.email);
        await signupPage.highlightPasswordInput();
        await ScreenshotHelper(page, screenshotDir, 'T15-mixed-case-pass', testInfo);
    });

    test('T16-Password with Numeric Characters', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.withNumbers, testData.step1.email);
        await signupPage.highlightPasswordInput();
        await ScreenshotHelper(page, screenshotDir, 'T16-numeric-pass', testInfo);
    });
    
    test('T17-Password with Special Characters', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.withSpecial, testData.step1.email);
        await signupPage.highlightPasswordInput();
        await ScreenshotHelper(page, screenshotDir, 'T17-special-pass', testInfo);
    });

    test('T18-Password Minimum Length', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.minLen, testData.step1.email);
        await signupPage.highlightPasswordInput();
        await ScreenshotHelper(page, screenshotDir, 'T18-min-pass', testInfo);
    });

    test('T19-Password Maximum Length', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.maxLen, testData.step1.email);
        await signupPage.highlightPasswordInput();
        await ScreenshotHelper(page, screenshotDir, 'T19-max-pass', testInfo);
    });

    test('T20-Password with All Character Types', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.allTypes, testData.step1.email);
        await signupPage.highlightPasswordInput();
        await ScreenshotHelper(page, screenshotDir, 'T20-all-types-pass', testInfo);
    });

    test('T21-Password with Spaces', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.withSpaces, testData.step1.email);
        await signupPage.highlightPasswordInput();
        await ScreenshotHelper(page, screenshotDir, 'T21-spaces-pass', testInfo);
    });

    test('T22-Weak Password Rejection', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation(testData.mobileValidation.valid, testData.passwordValidation.weak, testData.step1.email);
        await signupPage.highlightPasswordInput();
        await ScreenshotHelper(page, screenshotDir, 'T22-weak-pass', testInfo);
    });

    test('T23-Blank Password Rejection', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testMobileValidation(testData.mobileValidation.valid, '', testData.step1.email);
        await signupPage.highlightPasswordInput();
        await ScreenshotHelper(page, screenshotDir, 'T23-blank-pass', testInfo);
    });
    
    // --- Name Validation ---
    test('T26-Valid First Name and Surname', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testNameValidation(testData.nameValidation.validFirst, testData.nameValidation.validLast, testData.mobileValidation.valid, testData.step1.password, testData.step1.email);
        await signupPage.highlightNameInputs();
        await ScreenshotHelper(page, screenshotDir, 'T26-valid-names', testInfo);
    });

    test('T27-Names with Spaces', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testNameValidation(testData.nameValidation.spacesFirst, testData.nameValidation.spacesLast, testData.mobileValidation.valid, testData.step1.password, testData.step1.email);
        await signupPage.highlightNameInputs();
        await ScreenshotHelper(page, screenshotDir, 'T27-spaces-names', testInfo);
    });
    
    test('T28-Names with Hyphens', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testNameValidation(testData.nameValidation.hyphenFirst, testData.nameValidation.hyphenLast, testData.mobileValidation.valid, testData.step1.password, testData.step1.email);
        await signupPage.highlightNameInputs();
        await ScreenshotHelper(page, screenshotDir, 'T28-hyphen-names', testInfo);
    });
    
    test('T29-Blank First Name Rejection', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testNameValidation('', testData.nameValidation.validLast, testData.mobileValidation.valid, testData.step1.password, testData.step1.email);
        await signupPage.highlightNameInputs();
        await ScreenshotHelper(page, screenshotDir, 'T29-blank-first-name', testInfo);
    });

    test('T30-Blank Surname Rejection', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testNameValidation(testData.nameValidation.validFirst, '', testData.mobileValidation.valid, testData.step1.password, testData.step1.email);
        await signupPage.highlightNameInputs();
        await ScreenshotHelper(page, screenshotDir, 'T30-blank-last-name', testInfo);
    });
    
    test('T31-Names with Numeric Characters Rejection', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testNameValidation(testData.nameValidation.numericFirst, testData.nameValidation.numericLast, testData.mobileValidation.valid, testData.step1.password, testData.step1.email);
        await signupPage.highlightNameInputs();
        await ScreenshotHelper(page, screenshotDir, 'T31-numeric-names', testInfo);
    });

    test('T32-Names with Special Characters Rejection', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
        await signupPage.testNameValidation(testData.nameValidation.specialFirst, testData.nameValidation.specialLast, testData.mobileValidation.valid, testData.step1.password, testData.step1.email);
        await signupPage.highlightNameInputs();
        await ScreenshotHelper(page, screenshotDir, 'T32-special-names', testInfo);
    });

    // --- Step 2 Validation ---
    
    test.describe('Step 2 Validation', () => {
        // This hook fills step 1 *before* each test in this sub-group
        test.beforeEach(async ({ signupPage, testData, page }) => {
            await signupPage.fillStep1({
                mobile: testData.step1.mobile,
                pass: testData.step1.password,
                fName: testData.step1.firstName,
                lName: testData.step1.lastName,
                email: testData.step1.email
            });
            await signupPage.clickNext();
            await page.waitForTimeout(1000); // Wait for step 2 to load
        });

        test('T33-Valid SA ID', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
            await signupPage.fillStep2SA(testData.step2.validSAId);
            await signupPage.highlightSAIdInput();
            await ScreenshotHelper(page, screenshotDir, 'T33-valid-sa-id', testInfo);
        });
        
        test('T34-Invalid South African ID Validation', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
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
        
        test('T35-Valid Passport Number Format', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
            await signupPage.fillStep2Passport(testData.step2.validPassport);
            await signupPage.highlightPassportInput();
            await ScreenshotHelper(page, screenshotDir, 'T35-valid-passport', testInfo);
        });

        test('T36-Invalid Passport Number Validation', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
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

        test('T37-Complete Registration', async ({ page, signupPage, screenshotDir, testData }, testInfo) => {
            await signupPage.fillStep2SA(testData.step2.validSAId);
            await signupPage.completeStep2Details();
            await page.waitForTimeout(1000);
            await ScreenshotHelper(page, screenshotDir, 'T37-complete-registration', testInfo);
        });
    });
});