import { test } from '../../../fixtures/jackpotCityFixture';
import { ScreenshotHelper } from '../../../../Common-Flows/ScreenshotHelper';

test.describe('Build A Bet Section Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.jackpotcitycasino.com.gh/', { waitUntil: 'domcontentloaded' });
    });

    test('T1. Verify hamburger menu opens correctly', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T1-hamburgerMenu', testInfo);
    });

    // test('T4. Verify switching from dark theme to light theme and vice-versa', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
    //     await hamburgerMenuPage.openMenu();
    //     await page.waitForTimeout(2000);
    //     await hamburgerMenuPage.toggleTheme();
    //     await ScreenshotHelper(page, screenshotDir, 'T4-lightTheme', testInfo);

    //     await hamburgerMenuPage.clickDarkTheme();
    //     await ScreenshotHelper(page, screenshotDir, 'T4-darkTheme', testInfo);
    // });

    test('T10. Verify Search field is accessible', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.highlightElement('searchField');
        await ScreenshotHelper(page, screenshotDir, 'T10-searchField', testInfo);
    });

    test('T11. Verify Promotions CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.highlightElement('promotionsCTA');
        await ScreenshotHelper(page, screenshotDir, 'T11-promotionsCTA', testInfo);
    });

    test('T12. Verify Providers CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.highlightElement('providersCTA');
        await ScreenshotHelper(page, screenshotDir, 'T11-providersCTA', testInfo);
    });

    test('T13. Verify Winners CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.highlightElement('winnersCTA');
        await ScreenshotHelper(page, screenshotDir, 'T11-winnersCTA', testInfo);
    });

    test('T14. Verify Blog CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.highlightElement('blogCTA');
        await ScreenshotHelper(page, screenshotDir, 'T11-blogCTA', testInfo);
    });

    test('T15. Verify Quick Links dropdown expand/collapse', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.clickQuickLinks();
        await hamburgerMenuPage.highlightElement('quickLinksDropdown');
        await ScreenshotHelper(page, screenshotDir, 'T11-quickLinksCTA', testInfo);
    });

    test('T16. Verify Privacy Policy CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.clickQuickLinks();
        await hamburgerMenuPage.highlightElement('privacyPolicyCTA');
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-privacyPolicyPage', testInfo);
    });

    test('T17. Verify Contact Us CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.clickQuickLinks();
        await hamburgerMenuPage.highlightElement('contactUsCTA');
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T14-contactUsPage', testInfo);
    });

    test('T18. Verify Terms & Conditions CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.clickQuickLinks();
        await hamburgerMenuPage.highlightElement('termsConditionsCTA');
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-termsNconditions', testInfo);
    });

    test('T19. Verify FAQ’s CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.clickQuickLinks();
        await hamburgerMenuPage.highlightElement('faqsCTA');
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-FAQS', testInfo);
    });

    test('T21. Verify Responsible Gambling CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.clickQuickLinks();
        await hamburgerMenuPage.highlightElement('responsibleGamblingCTA');
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-responsibleGambling', testInfo);
    });

    test('T22. Verify Get the App CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.clickQuickLinks();
        await hamburgerMenuPage.highlightElement('getTheAppCTA');
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T13-responsibleGambling', testInfo);
    });

    test('T23. Verify Slot Game Categories expand/collapse', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.clickSlotGamesCategory();
        await hamburgerMenuPage.highlightElement('slotGamesCategory');
        await ScreenshotHelper(page, screenshotDir, 'T23-slotGameCategories', testInfo);
    });

    test('T24. Verify Live Game Categories expand/collapsee', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.clickLiveGamesCategory();
        await hamburgerMenuPage.highlightElement('liveGamesCategory');
        await ScreenshotHelper(page, screenshotDir, 'T24-liveGameCategories', testInfo);
    });

    test('T25. Verify clicking on Aviator CTA in logged-out state prompts login', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.highlightElement('aviatorCTA');
        await ScreenshotHelper(page, screenshotDir, 'T25-aviator', testInfo);
    });

    test('T26. Verify Apple Store download button', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.highlightElement('appleAppButton');
        await ScreenshotHelper(page, screenshotDir, 'T26-jackpotCityAppCTA', testInfo);
    });

    test('T27. Verify Android app download button', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.highlightElement('androidAppButton');
        await ScreenshotHelper(page, screenshotDir, 'T26-jackpotCityAppCTA', testInfo);
    });

    test('T28. Verify App Gallery download button', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
        await hamburgerMenuPage.openMenu();
        await page.waitForTimeout(2000);
        await hamburgerMenuPage.highlightElement('huaweiAppButton');
        await ScreenshotHelper(page, screenshotDir, 'T26-jackpotCityAppCTA', testInfo);
    });

    test.describe('Logged In Tests', () => {
        test.beforeEach(async ({ page, loginPage, testData }) => {
            // Perform Login
            await loginPage.clickLogin();
            await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
            await page.waitForTimeout(3000); // Wait for login to complete and dashboard to load
        });

        test('T29. Verify the Profile icon on header', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('profileIcon');
            await ScreenshotHelper(page, screenshotDir, 'T29-profileIcon', testInfo);
        });

        test('T30. Verify Balance widget appears', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('balanceContainer');
            await hamburgerMenuPage.highlightElement('cashBalance');
            await hamburgerMenuPage.highlightElement('bonusBalance');
            await hamburgerMenuPage.highlightElement('depositButton');
            await ScreenshotHelper(page, screenshotDir, 'T30-balanceDetails', testInfo);
        });

        test('T31. Verify name and account no. is displayed on the hamburger menu', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('accountNo');
            await ScreenshotHelper(page, screenshotDir, 'T31-accountNumber', testInfo);
        });

        test('T32. Verify eye toggle is visible beside balance', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('eyeToggle');
            await ScreenshotHelper(page, screenshotDir, 'T32-eyeToggle', testInfo);
        });

        test('T33. Verify eye toggle hides balance', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickEyeToggle();
            await ScreenshotHelper(page, screenshotDir, 'T33-eyeToggleHidden', testInfo);
        });

        test('T34. Verify Withdrawal CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.highlightElement('withdrawalCTA');
            await ScreenshotHelper(page, screenshotDir, 'T34-withdrawalCTA', testInfo);
        });

        test('T35. Verify My Account dropdown expansion', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.highlightElement('myAccountDropdown');
            await hamburgerMenuPage.highlightElement('myAccountRegion');
            await ScreenshotHelper(page, screenshotDir, 'T35-myAccountDropdown', testInfo);
        });

        test('T36. Verify Deposit CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickMyAccountDeposit();
            await ScreenshotHelper(page, screenshotDir, 'T36-depositPage', testInfo);
        });

        test('T36_1. Verify Withdrawal CTA (My Account)', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickMyAccountWithdrawal();
            await ScreenshotHelper(page, screenshotDir, 'T36-withdrawalPage', testInfo);
        });

        test('T36_2. Verify Transaction Summary CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickTransactionSummary();
            await ScreenshotHelper(page, screenshotDir, 'T36-transactionSummary', testInfo);
        });

        test('T37. Verify Bonus Wallet CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickBonusWallet();
            await ScreenshotHelper(page, screenshotDir, 'T37-bonusWallet', testInfo);
        });

        test('T38. Verify Personal Details CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickPersonalDetails();
            await ScreenshotHelper(page, screenshotDir, 'T38-personalDetails', testInfo);
        });

        test('T39. Verify Account Settings CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickAccountSettings();
            await ScreenshotHelper(page, screenshotDir, 'T39-accountSettings', testInfo);
        });

        test('T40. Verify Update Password CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickUpdatePassword();
            await ScreenshotHelper(page, screenshotDir, 'T40-updatePassword', testInfo);
        });

        test('T40_1. Verify Responsible Gaming CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickResponsibleGaming();
            await ScreenshotHelper(page, screenshotDir, 'T40-responsibleGaming', testInfo);
        });

        test('T41. Verify Document Verification CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickDocumentVerification();
            await ScreenshotHelper(page, screenshotDir, 'T41-documentVerification', testInfo);
        });

        test('T42. Verify Log Out CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickMyAccount();
            await hamburgerMenuPage.clickLogOut();
            await ScreenshotHelper(page, screenshotDir, 'T42-logOut', testInfo);
        });

        test('T43. Verify Quick Links dropdown expand/collapse', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('quickLinksDropdown');
            await ScreenshotHelper(page, screenshotDir, 'T43-quickLinksCTA', testInfo);
        });

        test('T44. Verify Privacy Policy CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('privacyPolicyCTA');
            await ScreenshotHelper(page, screenshotDir, 'T44-privacyPolicyPage', testInfo);
        });

        test('T45. Verify Contact Us CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('contactUsCTA');
            await ScreenshotHelper(page, screenshotDir, 'T45-contactUsPage', testInfo);
        });

        test('T46. Verify Terms & Conditions CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('termsConditionsCTA');
            await ScreenshotHelper(page, screenshotDir, 'T46-termsNconditions', testInfo);
        });

        test('T47. Verify FAQ’s CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('faqsCTA');
            await ScreenshotHelper(page, screenshotDir, 'T47-FAQS', testInfo);
        });

        test('T48. Verify Responsible Gambling CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('responsibleGamblingCTA');
            await ScreenshotHelper(page, screenshotDir, 'T48-responsibleGambling', testInfo);
        });

        test('T49. Verify Get the App CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickQuickLinks();
            await hamburgerMenuPage.highlightElement('getTheAppCTA');
            await ScreenshotHelper(page, screenshotDir, 'T49-getTheApp', testInfo);
        });

        test('T50. Verify Slot Game Categories expand/collapse', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickSlotGamesCategory();
            await hamburgerMenuPage.highlightElement('slotGamesCategory');
            await ScreenshotHelper(page, screenshotDir, 'T50-slotGameCategories', testInfo);
        });

        test('T51. Verify Live Game Categories expand/collapsee', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickLiveGamesCategory();
            await hamburgerMenuPage.highlightElement('liveGamesCategory');
            await ScreenshotHelper(page, screenshotDir, 'T51-liveGameCategories', testInfo);
        });

        test('T52. Verify clicking on Aviator CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickAviatorCTA();
            await ScreenshotHelper(page, screenshotDir, 'T52-aviator', testInfo);
        });

        test('T53. Verify clicking on Slot Games CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickSlotGamesCTA();
            await ScreenshotHelper(page, screenshotDir, 'T53-slotGames', testInfo);
        });

        test('T54. Verify clicking on Betgames CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickBetGamesCTA();
            await ScreenshotHelper(page, screenshotDir, 'T54-betGames', testInfo);
        });

        test('T55. Verify clicking on Quick Games CTA', async ({ page, hamburgerMenuPage, screenshotDir }, testInfo) => {
            await hamburgerMenuPage.openMenu();
            await page.waitForTimeout(1000);
            await hamburgerMenuPage.clickQuickGamesCTA();
            await ScreenshotHelper(page, screenshotDir, 'T55-quickGames', testInfo);
        });
    });

});