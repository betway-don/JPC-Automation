import { Page, TestType } from '@playwright/test';
import { SignUpPage } from '../pages/SignUpPage';
import { LoginPage } from '../pages/LoginPage';
import { HeaderPage } from '../pages/HeaderPage';
import { HamburgerMenuPage } from '../pages/HamburgerMenuPage';
import { HomePage } from '../pages/HomePage';
import { WinnersCirclePage } from '../pages/WinnersCirclePage';
import { GamePage } from '../pages/GamePage';
import { SearchPage } from '../pages/SearchPage';
import { TransactionHistoryPage, TransactionFilterType } from '../pages/TransactionHistoryPage';
import { SignUpModal } from '../components/SignUpModal';
import { LoginModal } from '../components/LoginModal';

type SmokeFixtures = {
    page: Page;
    signupPage: SignUpPage;
    loginPage: LoginPage;
    headerPage: HeaderPage;
    hamburgerMenuPage: HamburgerMenuPage;
    homePage: HomePage;
    winnersCirclePage: WinnersCirclePage;
    gamePage: GamePage;
    searchPage: SearchPage;
    transactionHistoryPage: TransactionHistoryPage;
    signUpModal: SignUpModal;
    loginModal: LoginModal;
    testData: any;
};

const REGION = (process.env.JPC_REGION || 'ZA').toUpperCase();
/** Skip-reason helper: true when the current region is NOT in the allowed set. */
const notIn = (...regions: string[]) => !regions.includes(REGION);
const ACCOUNT_SKIP = 'Logged-in: pending verified test account (login flow currently blocked)';

/**
 * PRIORITY smoke checks (tagged [smoke][priority]).
 *
 * This is a thin, fast pass over business-critical paths. It does NOT re-implement
 * logic — every step calls an existing Page Object intent method (the same ones the
 * full regression suites use). Region-specific scenarios are gated with test.skip on
 * JPC_REGION; logged-in scenarios are gated on JPC_ACCOUNT_RESTRICTED. Genuinely
 * un-automatable checks (real-money wagers, irreversible RG locks, FICA/Sumsub,
 * real-OTP password reset, restricted-account-only prompts) are quarantined under
 * test.fixme with the reason, so they read as "known manual" rather than missing.
 *
 * Run just these:  npx playwright test --grep "\\[smoke\\]\\[priority\\]"
 */
export function runSmokePriorityNewSuiteTests(test: TestType<SmokeFixtures, any>) {

    // ── Registration ───────────────────────────────────────────────────────────
    test.describe('[smoke][priority] Registration', () => {
        test.beforeEach(async ({ headerPage, signUpModal }: SmokeFixtures) => {
            await headerPage.navigateTo('/');
            await headerPage.clickRegisterCTA();
            await signUpModal.expectOpen();
        });

        test('SP-REG-001 Sign Up prompt is accessible from a registration entry point', async ({ signUpModal }: SmokeFixtures) => {
            await signUpModal.expectOpen();
        });
        test('SP-REG-002 Mobile Number field accepts a valid registered format', async ({ signUpModal }: SmokeFixtures) => {
            await signUpModal.expectValidMobileAccepted();
        });
        test('SP-REG-003 Password field accepts a policy-valid password', async ({ signUpModal }: SmokeFixtures) => {
            await signUpModal.expectValidPasswordAccepted();
        });
        test('SP-REG-004 First Name accepts valid alphabetic characters (ZA & MW)', async ({ signUpModal }: SmokeFixtures) => {
            test.skip(notIn('ZA', 'MW'), 'First Name field is ZA & MW only');
            await signUpModal.expectFieldAccepts('firstName', 'Jonathan');
        });
        test('SP-REG-005 Last Name accepts valid alphabetic characters (ZA & MW)', async ({ signUpModal }: SmokeFixtures) => {
            test.skip(notIn('ZA', 'MW'), 'Last Name field is ZA & MW only');
            await signUpModal.expectFieldAccepts('lastName', 'Smith');
        });
        test('SP-REG-006 Email Address accepts a valid email format (ZA)', async ({ signUpModal }: SmokeFixtures) => {
            test.skip(notIn('ZA'), 'Email field is ZA only');
            await signUpModal.expectFieldAccepts('email', 'valid.email@example.com');
        });
        test('SP-REG-007 Next CTA becomes active after all valid data', async ({ signUpModal }: SmokeFixtures) => {
            await signUpModal.fillStepOne();
            await signUpModal.advanceToStepTwo();
        });
        test('SP-REG-008 ID Number Type dropdown shows SA ID and Passport (ZA)', async ({ signUpModal }: SmokeFixtures) => {
            test.skip(notIn('ZA'), 'ID Number Type dropdown is ZA only');
            await signUpModal.fillStepOne();
            await signUpModal.advanceToStepTwo();
            await signUpModal.expectIdTypeOptions();
        });
        test('SP-REG-009 Date of Birth field accepts a valid date (ZA, MW & GH)', async ({ signUpModal }: SmokeFixtures) => {
            test.skip(notIn('ZA', 'MW', 'GH'), 'DOB selection covered for ZA, MW & GH');
            await signUpModal.fillStepOne();
            await signUpModal.advanceToStepTwo();
            await signUpModal.selectPassport();      // passport path keeps a manual DOB picker
            await signUpModal.selectFirstDob();
        });
        test('SP-REG-010 Source of Income dropdown shows options (ZA)', async ({ signUpModal }: SmokeFixtures) => {
            test.skip(notIn('ZA'), 'Source of Income is ZA only');
            await signUpModal.fillStepOne();
            await signUpModal.advanceToStepTwo();
            await signUpModal.expectSourceOptions();
        });
        test('SP-REG-011 Referral Code field accepts a valid code', async ({ signUpModal }: SmokeFixtures) => {
            await signUpModal.fillReferralCode('TESTCODE123');
        });
        test('SP-REG-012 Send Promotions checkbox toggles', async ({ signUpModal }: SmokeFixtures) => {
            await signUpModal.fillStepOne();
            await signUpModal.advanceToStepTwo();
            await signUpModal.expectPromoToggles();
        });
        test('SP-REG-013 Terms and Conditions checkbox toggles', async ({ signUpModal }: SmokeFixtures) => {
            await signUpModal.fillStepOne();
            await signUpModal.advanceToStepTwo();
            await signUpModal.expectTermsToggles();
        });
        test('SP-REG-014 Agree to All selects all consent options', async ({ signUpModal }: SmokeFixtures) => {
            await signUpModal.fillStepOne();
            await signUpModal.advanceToStepTwo();
            test.skip(!(await signUpModal.hasAgreeToAll()), 'Agree-to-All checkbox not present in current UI');
            await signUpModal.expectAgreeToAllChecksBoth();
        });

        test.fixme('SP-REG-015 Preferred Language dropdown shows supported languages (TZ)', async () => {
            // TZ-only. Locator exists on SignUpPage but the dropdown options are not modelled — needs a TZ intent method.
        });
        test.fixme('SP-REG-016 Terms & Conditions hyperlink opens the T&C page in a new tab', async () => {
            // No PO method for the in-modal T&C hyperlink / new-tab assertion yet.
        });
        test.fixme('SP-REG-017 Privacy Policy hyperlink opens the Privacy page in a new tab', async () => {
            // No PO method for the in-modal Privacy hyperlink / new-tab assertion yet.
        });
        test.fixme('SP-REG-018 Successful registration with a valid SA ID (ZA)', async () => {
            // Creates a REAL account on every run — kept in regression (RG-017), excluded from smoke to avoid account spam.
        });
        test.fixme('SP-REG-019 Successful registration with a valid Passport (ZA)', async () => {
            // Creates a REAL account on every run — kept in regression (RG-019), excluded from smoke.
        });
        test.fixme('SP-REG-020 "Welcome to Jackpot City" prompt after successful registration', async () => {
            // Requires a real registration submit — kept in regression (RG-027), excluded from smoke.
        });
    });

    // ── Login ────────────────────────────────────────────────────────────────────
    test.describe('[smoke][priority] Login', () => {
        test('SP-LOG-001 Login prompt is accessible from the header CTA', async ({ headerPage, loginModal }: SmokeFixtures) => {
            await headerPage.navigateTo('/');
            await headerPage.clickLoginCTA();
            await loginModal.expectOpen();
        });
        test('SP-LOG-002 Login prompt is accessible from the hamburger menu CTA', async ({ loginPage, loginModal }: SmokeFixtures) => {
            await loginPage.goto();
            await loginPage.clickHamburgerMenu();
            await loginPage.clickHamburgerLogin();
            await loginModal.expectOpen();
        });
        test('SP-LOG-003 Login prompt is accessible from the Sign Up modal link', async ({ headerPage, loginPage, loginModal }: SmokeFixtures) => {
            await headerPage.navigateTo('/');
            await headerPage.clickRegisterCTA();
            await loginPage.clickLoginLinkInSignup();
            await loginModal.expectOpen();
        });
        test('SP-LOG-004 Forgot Password CTA opens the Password Reset flow', async ({ headerPage, loginModal }: SmokeFixtures) => {
            await headerPage.navigateTo('/');
            await headerPage.clickLoginCTA();
            await loginModal.expectOpen();
            await loginModal.openPasswordReset();
            await loginModal.expectSwitchedToReset();
        });

        test('SP-LOG-005 Successful login with valid mobile and password', async ({ headerPage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await headerPage.navigateTo('/');
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
        });
        test('SP-LOG-006 Successful login retains the previously accessed page', async ({ page, headerPage, loginModal, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await headerPage.navigateTo('/promotions');
            await headerPage.clickLoginCTA();
            await loginModal.typeUsername(testData.loginValid.mobile);
            await loginModal.fillPassword(testData.loginValid.password);
            await loginModal.submit();
            await headerPage.expectAt(/\/promotions/);
        });
        test('SP-LOG-007 Login from a game page relaunches the selected game', async ({ gamePage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await gamePage.goto('/');
            await gamePage.navigate();
            await gamePage.expectPlayNowPromptsLogin();
            await gamePage.loginFromHamburgerAndExpectGame(testData.loginValid.mobile, testData.loginValid.password);
        });

        test.fixme('SP-LOG-008 Password Reset proceeds with a valid registered account number', async () => {
            // Sends a real OTP SMS / needs the reset-prompt HTML — kept manual (see LOG-019/021).
        });
        test.fixme('SP-LOG-009 Login from a game page with a restricted account shows the Account Restricted prompt', async () => {
            // Requires a dedicated restricted account; the restricted prompt is not modelled.
        });
    });

    // ── Game Launch ──────────────────────────────────────────────────────────────
    test.describe('[smoke][priority] Game Launch', () => {
        test('SP-GL-001 Game launches from a homepage game tile', async ({ homePage }: SmokeFixtures) => {
            await homePage.open();
            await homePage.expectGameLaunchFromSectionWithPlayNow();
        });
        test('SP-GL-002 Game launches from the Winners page', async ({ winnersCirclePage, gamePage }: SmokeFixtures) => {
            await winnersCirclePage.goto('/');
            await winnersCirclePage.open();
            await winnersCirclePage.launchBigWinnersGame();
            await gamePage.expectPlayNowVisible();
        });
        test('SP-GL-003 Game launches from Search results', async ({ searchPage, gamePage }: SmokeFixtures) => {
            await searchPage.goto('/');
            await searchPage.open();
            await searchPage.search('book');
            await searchPage.launchFirstResult();
            await gamePage.expectPlayNowVisible();
        });
        test('SP-GL-004 Game launches from a provider listing', async ({ homePage, gamePage }: SmokeFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.openFirstProviderListing();
            await gamePage.expectPlayNowVisible();
        });
        test('SP-GL-005 Game launches from the Recently Played section', async ({ homePage }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await homePage.open();
            await homePage.expectLaunchFromRecentlyPlayed();
        });
        test('SP-GL-006 Game launches from the Favourites section', async ({ homePage }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await homePage.open();
            await homePage.expectCanFavouriteTrending();
        });

        test.fixme('SP-GL-007 Game launches from the New Games page', async () => {
            // New Games page is not modelled with a Page Object yet.
        });
        test.fixme('SP-GL-008 Game does NOT launch for a non-FICA user — Sumsub appears (ZA & GH)', async () => {
            // Requires a non-FICA account; the Sumsub document-verification flow is not modelled.
        });
        test.fixme('SP-GL-009 Game does NOT launch for a Cooling-Off restricted account', async () => {
            // Requires an account with an active Cooling-Off lock.
        });
        test.fixme('SP-GL-010 Game does NOT launch for a Self-Exclusion restricted account', async () => {
            // Requires an account with an active Self-Exclusion lock.
        });
    });

    // ── Wager (real-money — manual) ───────────────────────────────────────────────
    test.describe('[smoke][priority] Wager', () => {
        test.fixme('SP-WAG-001 User can place a wager with available balance', async () => {
            // Real-money action inside the game canvas — not automatable here.
        });
        test.fixme('SP-WAG-002 Account balance updates after a successful wager', async () => {
            // Depends on a real wager.
        });
        test.fixme('SP-WAG-003 Wager is recorded in transaction history', async () => {
            // Depends on a real wager.
        });
        test.fixme('SP-WAG-004 Wager details are reflected in the Tlog records', async () => {
            // Depends on a real wager.
        });
        test.fixme('SP-WAG-005 Payout details are reflected in the Tlog records', async () => {
            // Depends on a real wager/payout.
        });
    });

    // ── Tlog Summary (logged in) ──────────────────────────────────────────────────
    test.describe('[smoke][priority] Tlog Summary', () => {
        test.beforeEach(async ({ loginPage, transactionHistoryPage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await loginPage.goto();
            await loginPage.clickLogin();
            await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
            await transactionHistoryPage.open();
        });

        test('SP-TLOG-001 Recent transaction list loads on open', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.expectListLoaded();
        });
        test('SP-TLOG-002 Type shows Payout/Wager with provider name', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.expectTypeFormat();
        });
        test('SP-TLOG-003 Tlog icon opens the transaction breakdown', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openDetailView();
            await transactionHistoryPage.expectDetailViewOpen();
        });
        test('SP-TLOG-004 Back button returns to the Transaction Summary', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openDetailView();
            await transactionHistoryPage.backToSummary();
            await transactionHistoryPage.expectOnSummary();
        });
        test('SP-TLOG-005 Refresh reloads the latest transaction data', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.clickRefresh();
            await transactionHistoryPage.expectListLoaded();
        });
        test('SP-TLOG-006 User can page through transactions', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.nextPage();
            await transactionHistoryPage.expectListLoaded();
        });
        test('SP-TLOG-007 User can jump to a specific page number', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.gotoPageViaInput(2);
            await transactionHistoryPage.expectActivePage(2);
        });
        test('SP-TLOG-008 Filter prompt is accessible', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.expectFilterPromptUI();
        });
        test('SP-TLOG-009 Continue applies the selected filters', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('week');
            await transactionHistoryPage.continueFilter();
            await transactionHistoryPage.expectFilterModalClosed();
        });
        test('SP-TLOG-010 Reset clears all filter selections', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.WAGER]);
            await transactionHistoryPage.resetFilter();
            await transactionHistoryPage.expectFiltersReset();
        });
        test('SP-TLOG-011 Close dismisses the filter prompt without applying', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.closeFilter();
            await transactionHistoryPage.expectFilterModalClosed();
        });
        test('SP-TLOG-012 Calendar only allows the last 30 days', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.openStartCalendar();
            await transactionHistoryPage.expectCalendarLimitedToLast30Days();
        });
        test('SP-TLOG-013 "Last week" sets the date range', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('week');
            await transactionHistoryPage.expectDateRangeChosen();
        });
        test('SP-TLOG-014 "Last 2 weeks" sets the date range', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('2weeks');
            await transactionHistoryPage.expectDateRangeChosen();
        });
        test('SP-TLOG-015 "Last 30 days" sets the date range', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('month');
            await transactionHistoryPage.expectDateRangeChosen();
        });
        test('SP-TLOG-016 "Show Only Payout" toggle activates with Payout selected', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT]);
            await transactionHistoryPage.expectPayoutToggle(true);
        });
        test('SP-TLOG-017 Type dropdown allows multiple selections', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.WAGER, TransactionFilterType.PAYOUT]);
            await transactionHistoryPage.expectTypeDropdownCount(2);
        });
    });

    // ── Deposit (logged in) ───────────────────────────────────────────────────────
    test.describe('[smoke][priority] Deposit', () => {
        test('SP-DEP-001 Deposit page is accessible and shows methods', async ({ loginPage, headerPage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await loginPage.goto();
            await loginPage.clickLogin();
            await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
            await headerPage.openDepositFromWallet();
            await headerPage.expectBankingOpen();
        });
        test.fixme('SP-DEP-002 Deposit methods are NOT shown for a restricted account', async () => {
            // Requires a restricted account; the restricted-deposit message is not modelled.
        });
    });

    // ── Responsible Gaming (logged in) ──────────────────────────────────────────────
    test.describe('[smoke][priority] Responsible Gaming', () => {
        test('SP-RG-001 Responsible Gaming page is accessible from the account menu', async ({ loginPage, hamburgerMenuPage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await loginPage.goto();
            await loginPage.clickLogin();
            await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
            await hamburgerMenuPage.openMenu();
            await hamburgerMenuPage.openMyAccountOption('Responsible Gaming');
            await hamburgerMenuPage.expectAccountOptionOpened('Responsible Gaming');
        });
        test.fixme('SP-RG-002 Cooling-Off period can be configured', async () => {
            // Irreversible account lock; only on a throwaway account with teardown.
        });
        test.fixme('SP-RG-003 Self-Exclusion period can be configured', async () => {
            // Irreversible account lock; only on a throwaway account with teardown.
        });
        test.fixme('SP-RG-004 RG section becomes inaccessible after a lock is applied', async () => {
            // Requires an active RG lock (irreversible).
        });
        test.fixme('SP-RG-005 RG lock information is displayed after relogin', async () => {
            // Requires an active RG lock (irreversible).
        });
    });

    // ── City Rewards (ZA only, logged in) ───────────────────────────────────────────
    test.describe('[smoke][priority] City Rewards (ZA)', () => {
        test('SP-CR-001 City Rewards page is accessible from the account menu', async ({ loginPage, hamburgerMenuPage, testData }: SmokeFixtures) => {
            test.skip(notIn('ZA'), 'City Rewards is ZA only');
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await loginPage.goto();
            await loginPage.clickLogin();
            await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
            await hamburgerMenuPage.openMenu();
            await hamburgerMenuPage.openMyAccountOption('City Rewards');
            await hamburgerMenuPage.expectAccountOptionOpened('City Rewards');
        });
        test.fixme('SP-CR-002 Points balance, decimal precision, month bars and "How It Works" (ZA)', async () => {
            // City Rewards internals (balance, 3-dp precision, month selection, progress, "Find Out How It Works")
            // need a dedicated CityRewardsPage object — not modelled yet.
        });
    });
}
