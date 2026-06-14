import { Page, TestType, expect } from '@playwright/test';
import { PromotionsPage } from '../pages/PromotionsPage';
import { HeaderPage } from '../pages/HeaderPage';
import { HamburgerMenuPage } from '../pages/HamburgerMenuPage';

type PromotionsNewSuiteFixtures = {
    page: Page;
    promotionsPage: PromotionsPage;
    headerPage: HeaderPage;
    hamburgerMenuPage: HamburgerMenuPage;
    testData: any;
};

export async function runPromotionsNewSuiteTests(
    test: TestType<PromotionsNewSuiteFixtures, any>,
    url: string
) {

    test.describe('Promotions - Logged Out', () => {

        test.beforeEach(async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.goto('/');
            await promotionsPage.open();
        });

        test('PR-LO-001 - the promotions page is accessible', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectPageReady();
        });

        test('PR-LO-002 - the promotions page shows its UI', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectPageUI();
        });

        test('PR-LO-003 - category tabs filter the promotions', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectCategoryFilters();
        });

        test('PR-LO-004 - "Tell Me More" opens the matching promotion', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectTellMeMoreOpensMatchingDetail();
        });

        test('PR-LO-005 - the promotion details page shows its UI', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.openFirstPromo();
            await promotionsPage.expectDetailUI();
        });

        test('PR-LO-006 - "How to Participate" shows a Login CTA', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.openFirstPromo();
            await expect(promotionsPage.howToParticipate).toBeVisible();
            await expect(promotionsPage.loginCta).toBeVisible();
        });

        test('PR-LO-007 - the Login CTA opens the login modal', async ({ promotionsPage, headerPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.openFirstPromo();
            await expect(promotionsPage.loginCta).toBeVisible();
            await promotionsPage.loginCta.click();
            await expect(headerPage.usernameInput).toBeVisible();
        });

        test('PR-LO-008 - logging in keeps the user on the promotion', async ({ promotionsPage, headerPage, testData }: PromotionsNewSuiteFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Requires login: pending test account');
            await promotionsPage.openFirstPromo();
            const promoUrl = promotionsPage.page.url();
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
            await promotionsPage.expectAt(new RegExp(promoUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        });

        test('PR-LO-009 - the Login CTA becomes Bet Now after login', async ({ promotionsPage, headerPage, testData }: PromotionsNewSuiteFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Requires login: pending test account');
            await promotionsPage.openFirstPromo();
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
            await expect(promotionsPage.betNowCta).toBeVisible();
        });

        test('PR-LO-010 - the Terms & Conditions dropdown expands', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.openFirstPromo();
            await promotionsPage.expectTermsExpand();
        });

        test('PR-LO-011 - the Eligible Games section is shown', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            test.skip(!await promotionsPage.openPromoWithEligibleGames(), 'No promotion with an Eligible Games section in this region');
            await promotionsPage.expectEligibleGamesSection();
        });

        test('PR-LO-012 - selecting an eligible game opens its game page', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            test.skip(!await promotionsPage.openPromoWithEligibleGames(), 'No promotion with an Eligible Games section in this region');
            await expect(promotionsPage.eligibleGameCard).toBeVisible();
            await promotionsPage.selectEligibleGame();
            await promotionsPage.expectAt(/\/home\//);
            await expect(promotionsPage.playNowButton).toBeVisible();
        });

        test('PR-LO-013 - favouriting an eligible game prompts login', async ({ promotionsPage, headerPage }: PromotionsNewSuiteFixtures) => {
            test.skip(!await promotionsPage.openPromoWithEligibleGames(), 'No promotion with an Eligible Games section in this region');
            await expect(promotionsPage.favouriteButton).toBeVisible();
            await promotionsPage.addFavourite();
            await expect(headerPage.usernameInput).toBeVisible();
        });

        test('PR-LO-014 - Eligible Games "Show All" opens the slot lobby', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            test.skip(!await promotionsPage.openPromoWithEligibleGames(), 'No promotion with an Eligible Games section in this region');
            await expect(promotionsPage.showAllButton).toBeVisible();
            await promotionsPage.openShowAll();
            await promotionsPage.expectAt(/\/spingames\//);
        });

        test('PR-LO-015 - back navigation returns to the promotions list', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.openFirstPromo();
            await promotionsPage.expectBackToPromotionsList();
        });

        test('PR-LO-016 - the page scrolls', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectPageScrolls();
        });

        test('PR-LO-017 - promotion cards share a consistent layout', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectCardLayout();
        });

        test('PR-LO-018 - the promotions state persists across navigation', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.clickCityExclusivesTab();
            await promotionsPage.goto('/');
            await promotionsPage.open();
            await promotionsPage.expectPageReady();
        });

        test('PR-LO-019 - logged-out detail shows Login (not Bet Now)', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.openFirstPromo();
            await promotionsPage.expectLoggedOutOnDetail();
        });

        test('PR-LO-020 - the page keeps rendering after a theme switch', async ({ promotionsPage, headerPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectPageReady();
            await headerPage.expectThemeToggles();
            await expect(promotionsPage.cardsGrid).toBeVisible();
        });

    });

    test.describe('Promotions - Logged In', () => {

        test.beforeEach(async ({ promotionsPage, headerPage, testData }: PromotionsNewSuiteFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Logged-in: pending test account');
            await promotionsPage.goto('/');
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
            await promotionsPage.open();
        });

        test('PR-LI-001 - the promotions page is accessible when logged in', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectPageReady();
        });

        test('PR-LI-002 - the promotions page shows its UI', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectPageUI();
        });

        test('PR-LI-003 - category tabs filter the promotions', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectCategoryFilters();
        });

        test('PR-LI-004 - "Tell Me More" opens the matching promotion', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectTellMeMoreOpensMatchingDetail();
        });

        test('PR-LI-005 - the promotion details page shows its UI', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.openFirstPromo();
            await promotionsPage.expectDetailUI();
        });

        test('PR-LI-006 - "How to Participate" shows a Bet Now CTA', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.openFirstPromo();
            await expect(promotionsPage.howToParticipate).toBeVisible();
            await expect(promotionsPage.betNowCta).toBeVisible();
        });

        test('PR-LI-007 - Bet Now leads to a real destination', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.openFirstPromo();
            await expect(promotionsPage.betNowCta).toBeVisible();
            await promotionsPage.betNow();
            await expect(promotionsPage.page).not.toHaveURL(/\/promotions\/[^/]+$/);
            await expect(promotionsPage.pageHeading).toBeVisible();
        });

        test('PR-LI-008 - the Terms & Conditions dropdown expands', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.openFirstPromo();
            await promotionsPage.expectTermsExpand();
        });

        test('PR-LI-009 - the Eligible Games section is shown', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            test.skip(!await promotionsPage.openPromoWithEligibleGames(), 'No promotion with an Eligible Games section in this region');
            await promotionsPage.expectEligibleGamesSection();
        });

        test('PR-LI-010 - Eligible Games "Show All" opens the slot lobby', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            test.skip(!await promotionsPage.openPromoWithEligibleGames(), 'No promotion with an Eligible Games section in this region');
            await expect(promotionsPage.showAllButton).toBeVisible();
            await promotionsPage.openShowAll();
            await promotionsPage.expectAt(/\/spingames\//);
        });

        test('PR-LI-011 - an eligible game launches from the details page', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            test.skip(!await promotionsPage.openPromoWithEligibleGames(), 'No promotion with an Eligible Games section in this region');
            await expect(promotionsPage.eligibleGameCard).toBeVisible();
            await promotionsPage.selectEligibleGame();
            await promotionsPage.expectAt(/\/home\//);
            await expect(promotionsPage.gameFrame).toBeVisible();
        });

        test('PR-LI-012 - an eligible game can be favourited', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            test.skip(!await promotionsPage.openPromoWithEligibleGames(), 'No promotion with an Eligible Games section in this region');
            await expect(promotionsPage.favouriteButton).toBeVisible();
            await promotionsPage.addFavourite();
            await expect(promotionsPage.favouriteActiveButton).toBeVisible();
            await promotionsPage.goto('/');
            await expect(promotionsPage.favouritesCarousel).toBeVisible();
        });

        test('PR-LI-013 - an eligible game can be un-favourited', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            test.skip(!await promotionsPage.openPromoWithEligibleGames(), 'No promotion with an Eligible Games section in this region');
            await expect(promotionsPage.favouriteButton).toBeVisible();
            await promotionsPage.addFavourite();
            await expect(promotionsPage.favouriteActiveButton).toBeVisible();
            await promotionsPage.removeFavourite();
            await expect(promotionsPage.favouriteButton).toBeVisible();
        });

        test('PR-LI-014 - back navigation returns to the promotions list', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.openFirstPromo();
            await promotionsPage.expectBackToPromotionsList();
        });

        test('PR-LI-015 - the page scrolls', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectPageScrolls();
        });

        test('PR-LI-016 - the page keeps rendering after a theme switch', async ({ promotionsPage, hamburgerMenuPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectPageReady();
            await hamburgerMenuPage.expectThemeToggles();
            await expect(promotionsPage.cardsGrid).toBeVisible();
        });

        test('PR-LI-017 - promotion cards share a consistent layout', async ({ promotionsPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.expectCardLayout();
        });

        test('PR-LI-018 - the details page keeps rendering after a theme switch', async ({ promotionsPage, hamburgerMenuPage }: PromotionsNewSuiteFixtures) => {
            await promotionsPage.openFirstPromo();
            await hamburgerMenuPage.expectThemeToggles();
            await expect(promotionsPage.detailTitle).toBeVisible();
        });

    });
}
