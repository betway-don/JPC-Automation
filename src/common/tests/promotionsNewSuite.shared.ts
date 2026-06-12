import { Page, TestInfo, TestType, expect } from '@playwright/test';
import { PromotionsPage } from '../pages/PromotionsPage';
import { HeaderPage } from '../pages/HeaderPage';
import { HamburgerMenuPage } from '../pages/HamburgerMenuPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

type PromotionsNewSuiteFixtures = {
    page: Page;
    promotionsPage: PromotionsPage;
    headerPage: HeaderPage;
    hamburgerMenuPage: HamburgerMenuPage;
    screenshotDir: string;
    testData: any;
};

/** Logged in, the theme toggle lives inside the hamburger menu (the header one is logged-out only). */
async function toggleThemeViaHamburger(page: Page, hamburgerMenuPage: HamburgerMenuPage) {
    const wasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    await hamburgerMenuPage.openMenu();
    if (wasDark) {
        await hamburgerMenuPage.toggleTheme();
    } else {
        await hamburgerMenuPage.clickDarkTheme();
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')), { timeout: 5000 }).toBe(!wasDark);
    await hamburgerMenuPage.closeMenu();
}

export async function runPromotionsNewSuiteTests(
    test: TestType<PromotionsNewSuiteFixtures, any>,
    url: string
) {

    test.describe('Promotions - Logged Out', () => {

        test.beforeEach(async ({ page, promotionsPage }: PromotionsNewSuiteFixtures) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await promotionsPage.navigate();
        });

        test('PR-LO-001 - Verify Promotions page accessibility in logged-out state', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.allTab).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('allTab');
            await expect(promotionsPage.locators.promoCardsGrid).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-001-promotionsAccess', testInfo);
        });

        test('PR-LO-002 - Verify Promotions page UI', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.allTab).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.cityExclusivesTab).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.globalFavouritesTab).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoCardsGrid');
            await expect(promotionsPage.locators.promoCardTitle).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.promoCardImage).toBeVisible({ timeout: 15000 });
            // image must have actually loaded, not just have a broken src
            await expect.poll(() => promotionsPage.locators.promoCardImage.first().evaluate((el: any) => el.naturalWidth), { timeout: 10000 }).toBeGreaterThan(0);
            await expect(promotionsPage.locators.tellMeMoreCTA).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-002-promotionsUI', testInfo);
        });

        test('PR-LO-003 - Verify category filtering for promotions', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.allTab).toBeVisible({ timeout: 15000 });
            // all three panels stay mounted in the DOM — only count cards the user can actually see
            const visibleCards = () => promotionsPage.getPromoCards().filter({ visible: true });
            await expect.poll(() => visibleCards().count(), { timeout: 10000 }).toBeGreaterThan(0);
            const allCount = await visibleCards().count();
            await promotionsPage.highlightElement('cityExclusivesTab');
            await promotionsPage.clickCityExclusivesTab();
            await expect(promotionsPage.locators.cityExclusivesTab).toHaveClass(/bg-primary/, { timeout: 15000 });
            // the category must actually filter: fewer cards than All, but not zero
            await expect.poll(() => visibleCards().count(), { timeout: 10000 }).toBeLessThan(allCount);
            expect(await visibleCards().count()).toBeGreaterThan(0);
            await promotionsPage.highlightElement('globalFavouritesTab');
            await promotionsPage.clickGlobalFavouritesTab();
            await expect(promotionsPage.locators.globalFavouritesTab).toHaveClass(/bg-primary/, { timeout: 15000 });
            await expect.poll(() => visibleCards().count(), { timeout: 10000 }).toBeLessThan(allCount);
            expect(await visibleCards().count()).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-003-categoryFilter', testInfo);
        });

        test('PR-LO-004 - Verify "Tell Me More" CTA navigation', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.tellMeMoreCTA).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('tellMeMoreCTA');
            // pick title and CTA from the SAME card so we can verify the right promo opens
            const card = promotionsPage.firstTellMeMoreCard;
            const cardTitle = (await promotionsPage.cardTitleOf(card).innerText()).trim();
            await promotionsPage.tellMeMoreOf(card).click();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.promoDetailTitle).toBeVisible({ timeout: 15000 });
            const detailTitle = (await promotionsPage.locators.promoDetailTitle.innerText()).trim();
            expect(detailTitle.toLowerCase()).toBe(cardTitle.toLowerCase());
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-004-tellMeMore', testInfo);
        });

        test('PR-LO-005 - Verify Promotion Details page UI', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.promoDetailTitle).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoDetailTitle');
            await expect(promotionsPage.locators.howToParticipate).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-005-detailsUI', testInfo);
        });

        test('PR-LO-006 - Verify "How to Participate" section with Login CTA', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.howToParticipate).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('howToParticipate');
            await expect(promotionsPage.locators.promoLoginCTA).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-006-howToParticipateLogin', testInfo);
        });

        test('PR-LO-007 - Verify Login CTA functionality', async ({ page, promotionsPage, headerPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(promotionsPage.locators.promoLoginCTA).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoLoginCTA');
            await promotionsPage.locators.promoLoginCTA.click();
            await expect(headerPage.locators.usernameInput).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-007-loginCTA', testInfo);
        });

        test('PR-LO-008 - Verify redirect after login from Promotion Details page', async ({ page, promotionsPage, headerPage, testData, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            const promoUrl = page.url();
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
            await expect(page).toHaveURL(new RegExp(promoUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-008-redirectAfterLogin', testInfo);
        });

        test('PR-LO-009 - Verify Login CTA is replaced with Bet Now CTA after login', async ({ page, promotionsPage, headerPage, testData, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
            await expect(promotionsPage.locators.betNowCTA).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('betNowCTA');
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-009-betNowAfterLogin', testInfo);
        });

        test('PR-LO-010 - Verify Terms and Conditions dropdown functionality', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.termsToggle).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('termsToggle');
            await promotionsPage.clickTermsToggle();
            await expect(promotionsPage.locators.termsContent).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('termsContent');
            const termsText = await promotionsPage.locators.termsContent.textContent({ timeout: 5000 });
            expect(termsText?.trim().length).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-010-termsDropdown', testInfo);
        });

        test('PR-LO-011 - Verify Eligible Games section visibility', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMoreWithEligibleGames();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.eligibleGamesHeading).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('eligibleGamesHeading');
            await expect(promotionsPage.locators.eligibleGameCard).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('eligibleGameCard');
            const cardCount = await promotionsPage.getEligibleGameCards().count();
            expect(cardCount).toBeGreaterThan(0);
            const imgAlt = await promotionsPage.locators.eligibleGameCardImage.getAttribute('alt');
            expect(imgAlt?.trim().length).toBeGreaterThan(0);
            const imgSrc = await promotionsPage.locators.eligibleGameCardImage.getAttribute('src');
            expect(imgSrc?.trim().length).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-011-eligibleGames', testInfo);
        });

        test('PR-LO-012 - Verify eligible game selection behavior in logged-out state', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMoreWithEligibleGames();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.eligibleGameCard).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('eligibleGameCard');
            await promotionsPage.clickEligibleGameCard();
            await expect(page).toHaveURL(/\/home\//, { timeout: 15000 });
            await expect(promotionsPage.playNowButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-012-gameSelectLoggedOut', testInfo);
        });

        test('PR-LO-013 - Verify favourite icon behavior in logged-out state', async ({ page, promotionsPage, headerPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMoreWithEligibleGames();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.favoriteBtn).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('favoriteBtn');
            await promotionsPage.clickFavoriteAdd();
            // must be the LOGIN modal specifically, not just any dialog
            await expect(headerPage.locators.usernameInput).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-013-favouriteLoggedOut', testInfo);
        });

        test('PR-LO-014 - Verify Eligible Games "Show All" functionality', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMoreWithEligibleGames();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.showAllBtn).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('showAllBtn');
            await promotionsPage.clickShowAll();
            await expect(page).toHaveURL(/\/spingames\//, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-014-showAllGames', testInfo);
        });

        test('PR-LO-015 - Verify back navigation from Promotion Details page', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.promoDetailTitle).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoDetailTitle');
            await page.goBack();
            await expect(page).toHaveURL(/\/promotions$/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-015-backNavigation', testInfo);
        });

        test('PR-LO-016 - Verify page scroll behavior', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.promoCardsGrid).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoCardsGrid');
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            const scrollY = await page.evaluate(() => window.scrollY);
            expect(scrollY).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-016-pageScroll', testInfo);
        });

        test('PR-LO-017 - Verify consistent UI layout across promotion cards', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.promoCardsGrid).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoCardsGrid');
            await expect(promotionsPage.locators.promoCardTitle).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.promoCardImage).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.promoCardTimeLeft).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.tellMeMoreCTA).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-017-cardLayout', testInfo);
        });

        test('PR-LO-018 - Verify session persistence during navigation', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickCityExclusivesTab();
            await expect(promotionsPage.locators.cityExclusivesTab).toHaveClass(/bg-primary/, { timeout: 15000 });
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await promotionsPage.navigate();
            await expect(promotionsPage.locators.allTab).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoCardsGrid');
            await expect(promotionsPage.locators.promoCardsGrid).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-018-sessionPersistence', testInfo);
        });

        test('PR-LO-019 - Verify behavior without login', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.howToParticipate).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoLoginCTA');
            await expect(promotionsPage.locators.promoLoginCTA).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.betNowCTA).not.toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-019-noLoginBehavior', testInfo);
        });

        test('PR-LO-020 - Verify Promotions page theme consistency', async ({ page, promotionsPage, headerPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.promoCardsGrid).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('allTab');
            // switching theme must flip the html dark class and keep the page rendering
            const wasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
            await headerPage.toggleTheme();
            await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')), { timeout: 5000 }).toBe(!wasDark);
            await expect(promotionsPage.locators.promoCardsGrid).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LO-020-themeConsistency', testInfo);
            // restore the original theme
            await headerPage.toggleTheme();
            await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')), { timeout: 5000 }).toBe(wasDark);
        });

    });

    test.describe('Promotions - Logged In', () => {

        test.beforeEach(async ({ page, promotionsPage, headerPage, testData }: PromotionsNewSuiteFixtures) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
            await promotionsPage.navigate();
        });

        test('PR-LI-001 - Verify Promotions page accessibility in logged-in state', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.allTab).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('allTab');
            await expect(promotionsPage.locators.promoCardsGrid).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-001-promotionsAccessLoggedIn', testInfo);
        });

        test('PR-LI-002 - Verify Promotions page UI', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.allTab).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.cityExclusivesTab).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.globalFavouritesTab).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoCardsGrid');
            await expect(promotionsPage.locators.promoCardTitle).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.promoCardImage).toBeVisible({ timeout: 15000 });
            // image must have actually loaded, not just have a broken src
            await expect.poll(() => promotionsPage.locators.promoCardImage.first().evaluate((el: any) => el.naturalWidth), { timeout: 10000 }).toBeGreaterThan(0);
            await expect(promotionsPage.locators.tellMeMoreCTA).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-002-promotionsUI', testInfo);
        });

        test('PR-LI-003 - Verify category filtering for promotions', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.allTab).toBeVisible({ timeout: 15000 });
            // all three panels stay mounted in the DOM — only count cards the user can actually see
            const visibleCards = () => promotionsPage.getPromoCards().filter({ visible: true });
            await expect.poll(() => visibleCards().count(), { timeout: 10000 }).toBeGreaterThan(0);
            const allCount = await visibleCards().count();
            await promotionsPage.highlightElement('cityExclusivesTab');
            await promotionsPage.clickCityExclusivesTab();
            await expect(promotionsPage.locators.cityExclusivesTab).toHaveClass(/bg-primary/, { timeout: 15000 });
            // the category must actually filter: fewer cards than All, but not zero
            await expect.poll(() => visibleCards().count(), { timeout: 10000 }).toBeLessThan(allCount);
            expect(await visibleCards().count()).toBeGreaterThan(0);
            await promotionsPage.highlightElement('globalFavouritesTab');
            await promotionsPage.clickGlobalFavouritesTab();
            await expect(promotionsPage.locators.globalFavouritesTab).toHaveClass(/bg-primary/, { timeout: 15000 });
            await expect.poll(() => visibleCards().count(), { timeout: 10000 }).toBeLessThan(allCount);
            expect(await visibleCards().count()).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-003-categoryFilter', testInfo);
        });

        test('PR-LI-004 - Verify "Tell Me More" CTA navigation', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.tellMeMoreCTA).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('tellMeMoreCTA');
            // pick title and CTA from the SAME card so we can verify the right promo opens
            const card = promotionsPage.firstTellMeMoreCard;
            const cardTitle = (await promotionsPage.cardTitleOf(card).innerText()).trim();
            await promotionsPage.tellMeMoreOf(card).click();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.promoDetailTitle).toBeVisible({ timeout: 15000 });
            const detailTitle = (await promotionsPage.locators.promoDetailTitle.innerText()).trim();
            expect(detailTitle.toLowerCase()).toBe(cardTitle.toLowerCase());
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-004-tellMeMore', testInfo);
        });

        test('PR-LI-005 - Verify Promotion Details page UI', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.promoDetailTitle).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoDetailTitle');
            await expect(promotionsPage.locators.howToParticipate).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-005-detailsUI', testInfo);
        });

        test('PR-LI-006 - Verify "How to Participate" section with Bet Now CTA', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.howToParticipate).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('howToParticipate');
            await expect(promotionsPage.locators.betNowCTA).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-006-howToParticipateBetNow', testInfo);
        });

        test('PR-LI-007 - Verify Bet Now CTA functionality', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.betNowCTA).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('betNowCTA');
            await promotionsPage.clickBetNow();
            // must land on a real destination (game lobby or game page), not an error page
            await expect(page).not.toHaveURL(/\/promotions\/[^/]+$/, { timeout: 15000 });
            await expect(promotionsPage.pageHeading).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-007-betNowCTA', testInfo);
        });

        test('PR-LI-008 - Verify Terms and Conditions dropdown functionality', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.termsToggle).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('termsToggle');
            await promotionsPage.clickTermsToggle();
            await expect(promotionsPage.locators.termsContent).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('termsContent');
            const termsText = await promotionsPage.locators.termsContent.textContent({ timeout: 5000 });
            expect(termsText?.trim().length).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-008-termsDropdown', testInfo);
        });

        test('PR-LI-009 - Verify Eligible Games section visibility', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMoreWithEligibleGames();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.eligibleGamesHeading).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('eligibleGamesHeading');
            await expect(promotionsPage.locators.eligibleGameCard).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('eligibleGameCard');
            const cardCount = await promotionsPage.getEligibleGameCards().count();
            expect(cardCount).toBeGreaterThan(0);
            const imgAlt = await promotionsPage.locators.eligibleGameCardImage.getAttribute('alt');
            expect(imgAlt?.trim().length).toBeGreaterThan(0);
            const imgSrc = await promotionsPage.locators.eligibleGameCardImage.getAttribute('src');
            expect(imgSrc?.trim().length).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-009-eligibleGames', testInfo);
        });

        test('PR-LI-010 - Verify Eligible Games "Show All" functionality', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMoreWithEligibleGames();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.showAllBtn).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('showAllBtn');
            await promotionsPage.clickShowAll();
            await expect(page).toHaveURL(/\/spingames\//, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-010-showAllGames', testInfo);
        });

        test('PR-LI-011 - Verify eligible game launch from Promotion Details page', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMoreWithEligibleGames();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.eligibleGameCard).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('eligibleGameCard');
            await promotionsPage.clickEligibleGameCard();
            await expect(page).toHaveURL(/\/home\//, { timeout: 15000 });
            await expect(promotionsPage.gameFrame).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-011-gameLaunch', testInfo);
        });

        test('PR-LI-012 - Verify favourite icon add functionality for eligible games', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMoreWithEligibleGames();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.favoriteBtn).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('favoriteBtn');
            await promotionsPage.clickFavoriteAdd();
            await expect(promotionsPage.locators.favoriteActiveBtn).toBeVisible({ timeout: 15000 });
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await expect(promotionsPage.locators.favouritesCarousel).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('favouritesCarouselCard');
            await expect(promotionsPage.locators.favouritesCarouselCard).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-012-addFavourite', testInfo);
        });

        test('PR-LI-013 - Verify favourite icon remove functionality for eligible games', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMoreWithEligibleGames();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.favoriteBtn).toBeVisible({ timeout: 15000 });
            await promotionsPage.clickFavoriteAdd();
            await expect(promotionsPage.locators.favoriteActiveBtn).toBeVisible({ timeout: 15000 });
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await expect(promotionsPage.locators.favouritesCarousel).toBeVisible({ timeout: 15000 });
            await page.goBack({ waitUntil: 'domcontentloaded' });
            await expect(promotionsPage.locators.favoriteActiveBtn).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('favoriteActiveBtn');
            await promotionsPage.clickFavoriteRemove();
            await expect(promotionsPage.locators.favoriteBtn).toBeVisible({ timeout: 15000 });
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await expect(promotionsPage.locators.favouritesCarousel).not.toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-013-removeFavourite', testInfo);
        });

        test('PR-LI-014 - Verify back navigation from Promotion Details page', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await expect(promotionsPage.locators.promoDetailTitle).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoDetailTitle');
            await page.goBack();
            await expect(page).toHaveURL(/\/promotions$/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-014-backNavigation', testInfo);
        });

        test('PR-LI-015 - Verify page scroll behavior', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.promoCardsGrid).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoCardsGrid');
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            const scrollY = await page.evaluate(() => window.scrollY);
            expect(scrollY).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-015-pageScroll', testInfo);
        });

        test('PR-LI-016 - Verify Promotions page theme consistency', async ({ page, promotionsPage, hamburgerMenuPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.promoCardsGrid).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('allTab');
            // switching theme must flip the html dark class and keep the page rendering
            await toggleThemeViaHamburger(page, hamburgerMenuPage);
            await expect(promotionsPage.locators.promoCardsGrid).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-016-themeConsistency', testInfo);
            // restore the original theme
            await toggleThemeViaHamburger(page, hamburgerMenuPage);
        });

        test('PR-LI-017 - Verify consistent UI layout across promotion cards', async ({ page, promotionsPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(promotionsPage.locators.promoCardsGrid).toBeVisible({ timeout: 15000 });
            await promotionsPage.highlightElement('promoCardsGrid');
            await expect(promotionsPage.locators.promoCardTitle).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.promoCardImage).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.promoCardTimeLeft).toBeVisible({ timeout: 15000 });
            await expect(promotionsPage.locators.tellMeMoreCTA).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-017-cardLayout', testInfo);
        });

        test('PR-LI-018 - Verify theme consistency for Promotion Details page', async ({ page, promotionsPage, hamburgerMenuPage, screenshotDir }: PromotionsNewSuiteFixtures, testInfo: TestInfo) => {
            await promotionsPage.clickTellMeMore();
            await expect(page).toHaveURL(/\/promotions\//, { timeout: 15000 });
            await promotionsPage.highlightElement('backButton');
            // switching theme must flip the html dark class and keep the detail page rendering
            await toggleThemeViaHamburger(page, hamburgerMenuPage);
            await expect(promotionsPage.locators.promoDetailTitle).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'PR-LI-018-detailsTheme', testInfo);
            // restore the original theme
            await toggleThemeViaHamburger(page, hamburgerMenuPage);
        });

    });
}
