import { Page, TestType } from '@playwright/test';
import { GamePage } from '../pages/GamePage';
import { HeaderPage } from '../pages/HeaderPage';

type GamePageSuiteFixtures = {
    page: Page;
    gamePage: GamePage;
    headerPage: HeaderPage;
    testData: any;
};

export async function runGamePageNewSuiteTests(
    test: TestType<GamePageSuiteFixtures, any>
) {

    test.describe('Game Page - Logged Out', () => {

        test.beforeEach(async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.goto('/');
            await gamePage.navigate();
        });

        test('GP-LO-001 - the game page loads', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectLoaded();
        });

        test('GP-LO-002 - the game thumbnail, title and provider are shown', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectGameInfo();
        });

        test('GP-LO-003 - the Play Now button is shown', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectPlayNowVisible();
        });

        test('GP-LO-004 - clicking Play Now prompts login', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectPlayNowPromptsLogin();
        });

        test('GP-LO-005 - clicking the favourite icon prompts login', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectFavouritePromptsLogin();
        });

        test('GP-LO-006 - the Stackpot banner is shown', async ({ gamePage }: GamePageSuiteFixtures) => {
            test.skip(await gamePage.stackpotBanner.count() === 0, 'No Stackpot banner on game pages in this region (ZA-only feature)');
            await gamePage.expectStackpotBanner();
        });

        test('GP-LO-007 - the share icon opens the share popup', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectShareModalOpens();
        });

        test('GP-LO-008 - the share popup can be closed', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectShareModalCloses();
        });

        test('GP-LO-009 - the user can enter fullscreen', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectEntersFullscreen();
        });

        test('GP-LO-010 - the user can exit fullscreen', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectExitsFullscreen();
        });

        test('GP-LO-011 - recommended game tiles are shown', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectRecommendedTiles();
        });

        test('GP-LO-012 - a recommended tile opens that game page', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectRecommendedTileOpensGame();
        });

        test('GP-LO-013 - the Game Category dropdown is shown', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectCategoryDropdown();
        });

        test('GP-LO-014 - tapping the category dropdown expands the list', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectCategoryExpands();
        });

        test('GP-LO-015 - a category can be selected from the dropdown', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectCategorySelectable();
        });

        test('GP-LO-016 - the dropdown closes after selecting a category', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectCategoryClosesAfterSelect();
        });

        test('GP-LO-017 - the dropdown expand/collapse icon works', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectCategoryToggleIcon();
        });

        test('GP-LO-018 - the in-game hamburger menu opens', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerOpens();
        });

        test('GP-LO-019 - Login and Sign Up CTAs are shown in the hamburger', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerAuthCtas();
        });

        test('GP-LO-020 - the hamburger Login CTA opens the login modal', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerLoginOpens();
        });

        test('GP-LO-021 - logging in from the game page relaunches the same game', async ({ gamePage, testData }: GamePageSuiteFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Requires login: pending test account');
            await gamePage.loginFromHamburgerAndExpectGame(testData.loginValid.mobile, testData.loginValid.password);
        });

        test('GP-LO-022 - the hamburger Sign Up CTA opens the sign-up modal', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerSignUpOpens();
        });

        test('GP-LO-023 - the theme toggle works', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectThemeToggles();
        });

        test('GP-LO-024 - the hamburger close button works', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerCloses();
        });

        test('GP-LO-025 - the game title matches between top bar and hamburger', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerGameTitleMatches();
        });

        test('GP-LO-026 - the hamburger favourite icon prompts login', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerFavouritePromptsLogin();
        });

        test('GP-LO-027 - social share icons are shown in the hamburger', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerSocialIcons();
        });

        test('GP-LO-028 - WhatsApp share opens with this game\'s link', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.openHamburger();
            await gamePage.expectShareOpens(gamePage.hamburgerWhatsApp, /whatsapp/i);
        });

        test('GP-LO-029 - Facebook share opens with this game\'s link', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.openHamburger();
            await gamePage.expectShareOpens(gamePage.hamburgerFacebook, /facebook/i);
        });

        test('GP-LO-030 - Twitter/X share opens with real copy and this game\'s link', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.openHamburger();
            await gamePage.expectShareOpens(gamePage.hamburgerTwitter, /twitter|x\.com/i, { tweet: true });
        });

        test('GP-LO-031 - the Email share icon is enabled', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.openHamburger();
            await gamePage.expectEmailShareEnabled(gamePage.hamburgerEmail);
        });

        test('GP-LO-032 - lobby category options are shown', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectLobbyCategories();
        });

        test('GP-LO-033 - lobby categories navigate', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectLobbyNavigates('/spingames');
        });

        test('GP-LO-034 - the category list is scrollable', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerScrollable();
        });

        test('GP-LO-035 - the back arrow returns to the previous listing', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectBackToListingViaBrowser();
        });

        test('GP-LO-036 - back navigation restores the previous listing', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectBackToListingViaButton();
        });

        test('GP-LO-037 - back navigation works across providers', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectBackAcrossProviders();
        });

        test('GP-LO-038 - the minimum bet amount is shown and formatted', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectMinBetFormatted();
        });

    });

    test.describe('Game Page - Logged In', () => {

        test.beforeEach(async ({ gamePage, headerPage, testData }: GamePageSuiteFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Logged-in: pending test account');
            await gamePage.goto('/');
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
            await gamePage.navigate();
        });

        test('GP-LI-001 - the game page loads when logged in', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectLoadedWithTopBar();
        });

        test('GP-LI-002 - the game title, like and dislike buttons are shown', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectGameInfo();
            await gamePage.expectLikeDislikeButtons();
        });

        test('GP-LI-003 - the game launches in canvas/iframe', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectGameFrame();
        });

        test('GP-LI-004 - the favourite icon toggles the game as favourite', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectTopBarFavToggles();
        });

        test('GP-LI-005 - the Stackpot banner is shown', async ({ gamePage }: GamePageSuiteFixtures) => {
            test.skip(await gamePage.stackpotBanner.count() === 0, 'No Stackpot banner on game pages in this region (ZA-only feature)');
            await gamePage.expectStackpotBanner();
        });

        test('GP-LI-006 - the share icon opens the share popup', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectShareModalOpens();
        });

        test('GP-LI-007 - the share popup can be closed', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectShareModalCloses();
        });

        test('GP-LI-008 - the user can enter fullscreen', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectEntersFullscreen();
        });

        test('GP-LI-009 - the user can exit fullscreen', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectExitsFullscreen();
        });

        test('GP-LI-010 - recommended game tiles are shown', async ({ gamePage }: GamePageSuiteFixtures) => {
            test.skip(await gamePage.featuredCarousel.count() === 0, 'No recommended-games carousel on the logged-in game page');
            await gamePage.expectRecommendedTiles();
        });

        test('GP-LI-011 - a recommended tile opens that game page', async ({ gamePage }: GamePageSuiteFixtures) => {
            test.skip(await gamePage.featuredCarousel.count() === 0, 'No recommended-games carousel on the logged-in game page');
            await gamePage.expectRecommendedTileOpensGame();
        });

        test('GP-LI-012 - the Game Category dropdown is shown', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectCategoryDropdown();
        });

        test('GP-LI-013 - tapping the category dropdown expands the list', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectCategoryExpands();
        });

        test('GP-LI-014 - a category can be selected from the dropdown', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectCategorySelectable();
        });

        test('GP-LI-015 - the dropdown closes after selecting a category', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectCategoryClosesAfterSelect();
        });

        test('GP-LI-016 - the dropdown expand/collapse icon works', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectCategoryToggleIcon();
        });

        test('GP-LI-017 - the in-game hamburger menu opens', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerOpens();
        });

        test('GP-LI-018 - account options are shown in the hamburger', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectAccountOptionsVisible();
        });

        test('GP-LI-019 - the hamburger close button works', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerCloses();
        });

        test('GP-LI-020 - the theme toggle works', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectThemeToggles();
        });

        test('GP-LI-021 - the game title matches between top bar and hamburger', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerGameTitleMatches();
        });

        test('GP-LI-022 - the hamburger favourite icon toggles favourite', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerFavToggles();
        });

        test('GP-LI-023 - social share icons are shown in the hamburger', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerSocialIcons();
        });

        test('GP-LI-024 - WhatsApp share opens with this game\'s link', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.openHamburger();
            await gamePage.expectShareOpens(gamePage.hamburgerWhatsApp, /whatsapp/i);
        });

        test('GP-LI-025 - Facebook share opens with this game\'s link', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.openHamburger();
            await gamePage.expectShareOpens(gamePage.hamburgerFacebook, /facebook/i);
        });

        test('GP-LI-026 - Twitter/X share opens with real copy and this game\'s link', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.openHamburger();
            await gamePage.expectShareOpens(gamePage.hamburgerTwitter, /twitter|x\.com/i, { tweet: true });
        });

        test('GP-LI-027 - the Email share icon is enabled', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.openHamburger();
            await gamePage.expectEmailShareEnabled(gamePage.hamburgerEmail);
        });

        test('GP-LI-028 - lobby category options are shown', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectLobbyCategories();
        });

        test('GP-LI-029 - lobby categories navigate', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectLobbyNavigates('/spingames');
        });

        test('GP-LI-030 - the category list is scrollable', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectHamburgerScrollable();
        });

        test('GP-LI-031 - the back arrow leaves the game', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectBackOpensExitModal();
        });

        test('GP-LI-032 - Continue Playing resumes the game', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectExitModalContinueResumes();
        });

        test('GP-LI-033 - back navigation works across providers', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectExitModalSwitchesProvider();
        });

        test('GP-LI-034 - the close icon dismisses the exit modal', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectExitModalCloseDismisses();
        });

        test('GP-LI-035 - the active game is highlighted in the exit modal', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectExitModalHighlightsActiveGame();
        });

        test('GP-LI-036 - the wallet is reachable from within a game', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectWalletReachableInGame();
        });

        test('GP-LI-037 - a refresh retains the logged-in session', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectSessionRetainedAfterRefresh();
        });

        test('GP-LI-038 - Deposit opens the deposit banking section', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectAccountOptionOpens('Deposit');
            await gamePage.expectBankingFrameLoaded('Deposits');
        });

        test('GP-LI-039 - Withdrawal opens the withdrawal banking section', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectAccountOptionOpens('Withdrawal');
            await gamePage.expectBankingFrameLoaded('Withdrawals');
        });

        test('GP-LI-040 - Transaction Summary opens its pane', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectAccountOptionOpens('Transaction Summary');
        });

        test('GP-LI-041 - Bonus Wallet opens its pane', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectAccountOptionOpens('Bonus Wallet');
        });

        test('GP-LI-042 - City Rewards opens with its content', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectAccountOptionOpens('City Rewards');
            await gamePage.expectCityRewardsContent();
        });

        test('GP-LI-043 - My Profile Management opens its pane', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectAccountOptionOpens('My Profile Management');
        });

        test('GP-LI-044 - Account Settings opens with its form', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectAccountOptionOpens('Account Settings');
            await gamePage.expectAccountSettingsForm();
        });

        test('GP-LI-045 - Responsible Gaming opens its pane', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectAccountOptionOpens('Responsible Gaming');
        });

        test('GP-LI-046 - Document Verification opens its pane', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectAccountOptionOpens('Document Verification');
        });

        test('GP-LI-047 - logout from the in-game hamburger works', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectLogoutShowsPlayNow();
        });

        test('GP-LI-048 - logout retains the same game in logged-out state', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.expectLogoutRetainsGame();
        });

        test('GP-LI-049 - WhatsApp share (share modal) opens with this game\'s link', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.openShareModal();
            await gamePage.expectShareOpens(gamePage.shareWhatsApp, /whatsapp/i);
        });

        test('GP-LI-050 - Facebook share (share modal) opens with this game\'s link', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.openShareModal();
            await gamePage.expectShareOpens(gamePage.shareFacebook, /facebook/i);
        });

        test('GP-LI-051 - Twitter/X share (share modal) opens with real copy and this game\'s link', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.openShareModal();
            await gamePage.expectShareOpens(gamePage.shareTwitter, /twitter|x\.com/i, { tweet: true });
        });

        test('GP-LI-052 - the Email share button in the share modal is enabled', async ({ gamePage }: GamePageSuiteFixtures) => {
            await gamePage.openShareModal();
            await gamePage.expectEmailShareEnabled(gamePage.shareEmail);
        });

    });
}
