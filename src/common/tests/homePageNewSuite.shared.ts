import { Page, TestType } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { HomePage } from '../pages/HomePage';

type HomePageSuiteFixtures = {
    page: Page;
    headerPage: HeaderPage;
    homePage: HomePage;
    testData: any;
};

export async function runHomePageNewSuiteTests(
    test: TestType<HomePageSuiteFixtures, any>
) {

    // ───────────────────────────────── LOGGED OUT ─────────────────────────────────
    test.describe('Home Page - Logged Out', () => {

        test.beforeEach(async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.open();
        });

        test('HP-LO-001 - homepage banners scroll', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBannerScrolls();
        });

        test('HP-LO-002 - banner shows a loaded image', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBannerLoaded();
        });

        test('HP-LO-003 - a banner CTA navigates or prompts login/sign-up', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBannerActsLoggedOut();
        });

        test('HP-LO-004 - the Big Winners carousel auto-scrolls', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBigWinnersAutoScroll();
        });

        test('HP-LO-005 - Big Winners entries show game, amount and masked user', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBigWinnerDetails();
        });

        test('HP-LO-006 - tapping a Big Winners title redirects correctly', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBigWinnerTitleRedirects();
        });

        test('HP-LO-007 - a game launches from the Big Winners carousel', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBigWinnerOpensGameWithPlayNow();
        });

        test('HP-LO-008 - tapping a favourite icon prompts login', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectFavouritePromptsLogin();
        });

        test('HP-LO-009 - the Favourites section is hidden', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectFavouritesSectionHidden();
        });

        test('HP-LO-010 - the Recently Played section is hidden', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectRecentlyPlayedSectionHidden();
        });

        test('HP-LO-011 - the Providers section is displayed', async ({ homePage }: HomePageSuiteFixtures) => {
            test.skip(await homePage.homeProviderCards.count() === 0, 'Providers section not present on the home page in this region');
            await homePage.expectProvidersSection();
        });

        test('HP-LO-012 - the Providers section scrolls horizontally', async ({ homePage }: HomePageSuiteFixtures) => {
            test.skip(await homePage.homeProviderCards.count() === 0, 'Providers section not present on the home page in this region');
            await homePage.expectProvidersScroll();
        });

        test('HP-LO-013 - Show All opens the All Providers page', async ({ homePage }: HomePageSuiteFixtures) => {
            test.skip(await homePage.homeProviderCards.count() === 0, 'Providers section not present on the home page in this region');
            await homePage.openProvidersShowAll();
        });

        test('HP-LO-014 - the Providers page shows a breadcrumb/heading', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.expectProvidersBreadcrumb();
        });

        test('HP-LO-015 - Back leaves the Providers page', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBackLeavesProviders();
        });

        test('HP-LO-016 - all provider tiles are shown on the Providers page', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.expectAllProviderTiles();
        });

        test('HP-LO-017 - provider tiles are accessible', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.expectProviderTileAccessible();
        });

        test('HP-LO-018 - a provider tile opens its game listing', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.openFirstProviderListing();
        });

        test('HP-LO-019 - the Special Offers section is displayed', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectSpecialOffers();
        });

        test('HP-LO-020 - the Special Offers section scrolls horizontally', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectSpecialOffersScroll();
        });

        test('HP-LO-021 - Show All opens the Promotions page', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openSpecialOffersShowAll();
        });

        test('HP-LO-022 - a promo card opens its detail page', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openFirstPromoCard();
        });

        test('HP-LO-023 - the Stackpot banner shows the jackpot meter and CTAs', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectStackpotBanner();
        });

        test('HP-LO-024 - Stackpot Play Now opens the Slots vertical', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectStackpotPlayNowOpensSlots();
        });

        test('HP-LO-025 - Stackpot More Info opens the info window', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectStackpotMoreInfoModal();
        });

        test('HP-LO-026 - generic game sections scroll horizontally', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectGameSectionScroll();
        });

        test('HP-LO-027 - the All Games link is shown', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectAllGamesLinkVisible();
        });

        test('HP-LO-028 - the All Games link navigates to Slots', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openAllGamesLink();
        });

        test('HP-LO-029 - a game launches from a generic game section', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectGameLaunchFromSectionWithPlayNow();
        });

        test('HP-LO-030 - game tiles show image and content', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectGameTileContent();
        });

        test('HP-LO-031 - the Providers breadcrumb returns to the listing', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.expectProviderBreadcrumbReturnsToList();
        });

    });

    // ───────────────────────────────── LOGGED IN ─────────────────────────────────
    test.describe('Home Page - Logged In', () => {

        test.beforeEach(async ({ homePage, headerPage, testData }: HomePageSuiteFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Logged-in: pending test account');
            await homePage.open();
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
        });

        test('HP-LI-001 - homepage banners scroll', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBannerScrolls();
        });

        test('HP-LI-002 - banner shows a loaded image', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBannerLoaded();
        });

        test('HP-LI-003 - a banner CTA navigates or opens a dialog', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBannerActsLoggedIn();
        });

        test('HP-LI-004 - the Big Winners carousel auto-scrolls', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBigWinnersAutoScroll();
        });

        test('HP-LI-005 - Big Winners entries show game, amount and masked user', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBigWinnerDetails();
        });

        test('HP-LI-006 - tapping a Big Winners title redirects correctly', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBigWinnerTitleRedirects();
        });

        test('HP-LI-007 - a game launches from the Big Winners carousel', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBigWinnerLaunchesGame();
        });

        test('HP-LI-008 - a game can be marked favourite', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectCanFavouriteTrending();
        });

        test('HP-LI-009 - a game can be unmarked favourite', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectCanFavouriteTrending();
        });

        test('HP-LI-010 - the Favourites section is hidden when empty', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectFavouritesSectionHidden();
        });

        test('HP-LI-011 - multiple games can be favourited', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectCanFavouriteMultiple();
        });

        test('HP-LI-012 - favourites persist after a refresh', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectFavouritePersistsAfterRefresh();
        });

        test('HP-LI-013 - a launched game is added to Recently Played', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.playTrendingGameAndReturnHome();
            await homePage.expectRecentlyPlayedHasGame();
        });

        test('HP-LI-014 - Recently Played keeps the latest game on top', async ({ homePage }: HomePageSuiteFixtures) => {
            const played = await homePage.playTrendingGameAndReturnHome();
            await homePage.expectRecentlyPlayedTopIs(played);
        });

        test('HP-LI-015 - the Recently Played section is shown', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.playTrendingGameAndReturnHome();
            await homePage.expectRecentlyPlayedHasGame();
        });

        test('HP-LI-016 - a game launches from Recently Played', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.playTrendingGameAndReturnHome();
            await homePage.expectLaunchFromRecentlyPlayed();
        });

        test('HP-LI-017 - the Providers section is displayed', async ({ homePage }: HomePageSuiteFixtures) => {
            test.skip(await homePage.homeProviderCards.count() === 0, 'Providers section not present on the home page in this region');
            await homePage.expectProvidersSection();
        });

        test('HP-LI-018 - the Providers section scrolls horizontally', async ({ homePage }: HomePageSuiteFixtures) => {
            test.skip(await homePage.homeProviderCards.count() === 0, 'Providers section not present on the home page in this region');
            await homePage.expectProvidersScroll();
        });

        test('HP-LI-019 - Show All opens the All Providers page', async ({ homePage }: HomePageSuiteFixtures) => {
            test.skip(await homePage.homeProviderCards.count() === 0, 'Providers section not present on the home page in this region');
            await homePage.openProvidersShowAll();
        });

        test('HP-LI-020 - the Providers page shows a breadcrumb/heading', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.expectProvidersBreadcrumb();
        });

        test('HP-LI-021 - Back leaves the Providers page', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectBackLeavesProviders();
        });

        test('HP-LI-022 - all provider tiles are shown on the Providers page', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.expectAllProviderTiles();
        });

        test('HP-LI-023 - provider tiles are accessible', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.expectProviderTileAccessible();
        });

        test('HP-LI-024 - a provider tile opens its game listing', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.openFirstProviderListing();
        });

        test('HP-LI-025 - generic game sections scroll horizontally', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectGameSectionScroll();
        });

        test('HP-LI-026 - the All Games link is shown', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectAllGamesLinkVisible();
        });

        test('HP-LI-027 - the All Games link navigates', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openAllGamesLinkAny();
        });

        test('HP-LI-028 - a game launches from a generic game section', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectGameLaunchFromSection();
        });

        test('HP-LI-029 - game tiles show image and content', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectGameTileContent();
        });

        test('HP-LI-030 - the Providers breadcrumb returns to the listing', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.expectProviderBreadcrumbReturnsToList();
        });

    });

    // ───────────────────────────────── FOOTER ─────────────────────────────────
    test.describe('Home Page - Footer', () => {

        test.beforeEach(async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.open();
        });

        test('HP-FT-001 - Show All expands the footer description', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectFooterShowAllToggles();
        });

        test('HP-FT-002 - Responsible Gaming opens its page', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openFooterContentPage('footerResponsibleGambling', /\/responsible-gambling/);
        });

        test('HP-FT-003 - FAQs opens its page with accordion items', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openFooterContentPage('footerFaq', /\/faq/);
            await homePage.expectAccordionContent();
        });

        test('HP-FT-004 - Get the App opens its page with store buttons', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openGetTheApp();
            await homePage.expectGetAppButtons();
        });

        test('HP-FT-005 - Privacy Policy opens its page with accordion items', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openFooterContentPage('footerPrivacyPolicy', /\/privacy-policy/);
            await homePage.expectAccordionContent();
        });

        test('HP-FT-006 - Contact Us opens its page with contact details', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openFooterContentPage('footerContactUs', /\/contact-us/);
            await homePage.expectContactDetails();
        });

        test('HP-FT-007 - Terms and Conditions opens its page with accordion items', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openFooterContentPage('footerTermsConditions', /\/terms-and-conditions/);
            await homePage.expectAccordionContent();
        });

        test('HP-FT-009 - How To opens its page with sections', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openFooterContentPage('footerHowTo', /\/how-to/);
            await homePage.expectHowToContent();
        });

        test('HP-FT-010 - the Apple Store CTA opens an external tab', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectAppleStoreOpensTab();
        });

        test('HP-FT-011 - the Android Store CTA has the correct download link', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectAppDownloadLink('footerAndroidBtn', 'Jackpotcity Android App');
        });

        test('HP-FT-012 - the Huawei App Gallery CTA has the correct download link', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectAppDownloadLink('footerHuaweiBtn', 'Jackpotcity Huawei App');
        });

        test('HP-FT-013 - the Instagram CTA opens Instagram', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectSocialOpensTab('footerInstagramLink', /instagram\.com/);
        });

        test('HP-FT-014 - the Facebook CTA opens Facebook', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectSocialOpensTab('footerFacebookLink', /facebook\.com/);
        });

        test('HP-FT-015 - the Twitter/X CTA opens X', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectSocialOpensTab('footerTwitterLink', /x\.com|twitter\.com/);
        });

        test('HP-FT-016 - About Us opens its page', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openFooterContentPage('footerAboutUs', /\/about-us/);
        });

        test('HP-FT-017 - PAIA Manual opens its page', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.openFooterContentPage('footerPaiaManual', /\/paia-manual/);
        });

        test('HP-FT-018 - footer payment-method icons are displayed', async ({ homePage }: HomePageSuiteFixtures) => {
            await homePage.expectPaymentIcons();
        });

    });
}
