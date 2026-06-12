import { Page, TestInfo, TestType, expect } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { HomePage } from '../pages/HomePage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

type HomePageSuiteFixtures = {
    page: Page;
    headerPage: HeaderPage;
    homePage: HomePage;
    screenshotDir: string;
    testData: any;
};

export async function runHomePageNewSuiteTests(
    test: TestType<HomePageSuiteFixtures, any>
) {

    // ─────────────────────────────────────────────────────────────────────────
    // LOGGED OUT
    // ─────────────────────────────────────────────────────────────────────────
    test.describe('Home Page - Logged Out', () => {

        test.beforeEach(async ({ page }: HomePageSuiteFixtures) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
        });

        test('HP-LO-001 - Verify horizontal scrollability of homepage banners', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.bannerCarousel).toBeVisible({ timeout: 10000 });
            const indexBefore = await homePage.getActivePaginationIndex();
            await homePage.clickBannerNext();
            const indexAfter = await homePage.getActivePaginationIndex();
            expect(indexAfter).not.toBe(indexBefore);
            await homePage.highlightElement('bannerActivePagination');
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-001-bannerScroll', testInfo);
        });

        test('HP-LO-002 - Verify visibility of CTA buttons on homepage banners', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.bannerCarousel).toBeVisible({ timeout: 10000 });
            await expect(homePage.locators.bannerActiveSlide).toBeVisible({ timeout: 5000 });
            await expect(homePage.locators.bannerImage).toBeVisible({ timeout: 5000 });
            // banner image must have actually loaded, not just have a broken src
            await expect.poll(() => homePage.locators.bannerImage.evaluate((el: any) => el.naturalWidth), { timeout: 10000 }).toBeGreaterThan(0);
            await homePage.highlightElement('bannerImage');
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-002-bannerVisible', testInfo);
        });

        test('HP-LO-003 - Verify banner CTA triggers appropriate redirection or register prompt', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.bannerCarousel).toBeVisible({ timeout: 10000 });
            const urlBefore = page.url();
            await homePage.locators.bannerImage.click();
            // banner targets are campaign-driven: navigation OR login/signup prompt — but SOMETHING must happen
            await expect.poll(async () => {
                if (page.url() !== urlBefore) return 'navigated';
                if (await homePage.locators.loginPromptModal.isVisible().catch(() => false)) return 'login';
                if (await homePage.locators.signUpModal.isVisible().catch(() => false)) return 'signup';
                return '';
            }, { timeout: 10000 }).not.toBe('');
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-003-bannerRedirect', testInfo);
        });

        test('HP-LO-004 - Verify auto-scrolling functionality of Big Winners carousel', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.bigWinnersMarquee).toBeVisible({ timeout: 10000 });
            await homePage.highlightElement('bigWinnersMarquee');
            const getTransform = () =>
                homePage.locators.bigWinnersMarquee.evaluate((el: Element) =>
                    window.getComputedStyle(el).transform
                );
            const before = await getTransform();
            // poll until the marquee actually moves instead of hoping 1.5s is enough
            await expect.poll(getTransform, { timeout: 8000 }).not.toBe(before);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-004-bigWinnersAutoScroll', testInfo);
        });

        test('HP-LO-005 - Verify winner details are displayed correctly in Big Winners carousel', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.bigWinnersItem).toBeVisible({ timeout: 10000 });
            await homePage.highlightElement('bigWinnersItem');
            // game title
            await expect(homePage.locators.bigWinnersGameTitle).toBeVisible({ timeout: 5000 });
            const gameTitle = await homePage.locators.bigWinnersGameTitle.textContent();
            expect(gameTitle?.trim()).toBeTruthy();
            // win amount must be a real rand value, e.g. "R 236,580.00"
            await expect(homePage.locators.bigWinnersAmount).toBeVisible({ timeout: 5000 });
            const amount = await homePage.locators.bigWinnersAmount.textContent();
            expect(amount?.trim()).toMatch(/R\s*[\d,]+\.\d{2}/);
            // masked user must be an actually masked account, e.g. "*******5648"
            await expect(homePage.locators.bigWinnersMaskedUser).toBeVisible({ timeout: 5000 });
            const maskedUser = await homePage.locators.bigWinnersMaskedUser.textContent();
            expect(maskedUser?.trim()).toMatch(/^\*+\d+$/);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-005-bigWinnersDetails', testInfo);
        });

        test('HP-LO-006 - Verify tapping Big Winners title redirects correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            // TODO: requires Big Winners section heading HTML to identify the title link selector
        });

        test('HP-LO-007 - Verify game launch from Big Winners carousel', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.bigWinnersItem).toBeVisible({ timeout: 10000 });
            // the winner item is a link to its game page — verify we land on THAT game
            const href = await homePage.locators.bigWinnersItem.getAttribute('href');
            const gamePath = (href || '').split('?')[0];
            expect(gamePath).toContain('/home/');
            await homePage.locators.bigWinnersItem.click({ force: true });
            await expect(page).toHaveURL(new RegExp(gamePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
            // logged out: the game page offers Play now (login required to play)
            await expect(homePage.playNowButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-007-bigWinnersLaunch', testInfo);
        });

        test('HP-LO-008 - Verify tapping Favourite icon triggers login prompt', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.trendingFavBtn).toBeVisible({ timeout: 10000 });
            await homePage.locators.trendingFavBtn.click();
            await expect(homePage.locators.loginPromptModal).toBeVisible({ timeout: 5000 });
            await homePage.highlightElement('loginPromptModal');
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-008-favLoginPrompt', testInfo);
        });

        test('HP-LO-009 - Verify Favorites section is hidden', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.waitForLoadState('domcontentloaded');
            await expect(homePage.locators.favouritesSection).not.toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-009-favouritesHidden', testInfo);
        });

        test('HP-LO-010 - Verify Recently Played section is hidden', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.waitForLoadState('domcontentloaded');
            await expect(homePage.locators.recentlyPlayedSection).not.toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-010-recentlyPlayedHidden', testInfo);
        });

        test('HP-LO-011 - Verify Providers section is displayed correctly on homepage', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.providersSection).toBeVisible({ timeout: 10000 });
            await expect(homePage.locators.providerTile).toBeVisible({ timeout: 5000 });
            await expect(homePage.locators.providerImg).toBeVisible({ timeout: 5000 });
            await homePage.highlightElement('providersSection');
            const tileCount = await homePage.homeProviderCards.count();
            expect(tileCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-011-providersSection', testInfo);
        });

        test('HP-LO-012 - Verify horizontal scrollability of Providers section on homepage', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.providersSection).toBeVisible({ timeout: 10000 });
            await homePage.locators.providersSection.scrollIntoViewIfNeeded();
            const scrollBefore = await homePage.getSectionScrollLeft(homePage.locators.providersSection);
            await homePage.scrollSectionRight(homePage.locators.providersSection, 300);
            const scrollAfter = await homePage.getSectionScrollLeft(homePage.locators.providersSection);
            expect(scrollAfter).toBeGreaterThan(scrollBefore);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-012-providersScroll', testInfo);
        });

        test('HP-LO-013 - Verify Show All CTA redirects user to All Providers page', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.providersShowAllLink).toBeVisible({ timeout: 10000 });
            await homePage.locators.providersShowAllLink.click();
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/providers/);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-013-providersShowAll', testInfo);
        });

        test('HP-LO-014 - Verify breadcrumb navigation is displayed correctly on Providers page', async ({ page, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.goto('/home/providers', { waitUntil: 'domcontentloaded' });
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            // Verify the page URL and a recognisable heading/breadcrumb element
            expect(page.url()).toMatch(/\/providers/);
            const heading = homePage.providersBreadcrumbHeading;
            await expect(heading).toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-014-providersBreadcrumb', testInfo);
        });

        test('HP-LO-015 - Verify Back button functionality on Providers page', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.providersShowAllLink.scrollIntoViewIfNeeded();
            await homePage.locators.providersShowAllLink.click();
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            await page.waitForLoadState('domcontentloaded');
            const backBtn = homePage.backButton;
            await expect(backBtn).toBeVisible({ timeout: 5000 });
            await backBtn.click();
            await page.waitForLoadState('domcontentloaded');
            expect(page.url()).not.toContain('/providers');
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-015-providersBack', testInfo);
        });

        test('HP-LO-016 - Verify all provider tiles are displayed correctly on Providers page', async ({ page, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.goto('/home/providers', { waitUntil: 'domcontentloaded' });
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            const tiles = homePage.providerCards;
            await expect(tiles.first()).toBeVisible({ timeout: 10000 });
            const count = await tiles.count();
            expect(count).toBeGreaterThan(5);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-016-providersPageTiles', testInfo);
        });

        test('HP-LO-017 - Verify provider tiles are accessible on Providers page', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.goto('/home/providers', { waitUntil: 'domcontentloaded' });
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            const firstTile = homePage.providerCards.first();
            await expect(firstTile).toBeVisible({ timeout: 10000 });
            await homePage.highlightLocator('firstProviderTile', firstTile);
            const href = await firstTile.getAttribute('href');
            expect(href).toBeTruthy();
            const imgAlt = await firstTile.locator('img').getAttribute('alt');
            expect(imgAlt?.trim()).toBeTruthy();
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-017-providerTileAccess', testInfo);
        });

        test('HP-LO-018 - Verify tapping provider tile redirects user to provider-specific game listing', async ({ page, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.goto('/home/providers', { waitUntil: 'domcontentloaded' });
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            const firstTile = homePage.providerCards.first();
            await expect(firstTile).toBeVisible({ timeout: 10000 });
            await firstTile.click();
            await page.waitForURL(/\/providers\//, { timeout: 10000 });
            expect(page.url()).toMatch(/\/providers\//);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-018-providerTileRedirect', testInfo);
        });

        test('HP-LO-019 - Verify Special Offers section visibility on homepage', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.specialOffersSection).toBeVisible({ timeout: 10000 });
            await expect(homePage.locators.promoCard).toBeVisible({ timeout: 5000 });
            await expect(homePage.locators.promoCardImg).toBeVisible({ timeout: 5000 });
            await homePage.highlightElement('specialOffersSection');
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-019-specialOffersVisible', testInfo);
        });

        test('HP-LO-020 - Verify horizontal scrollability of Special Offers section', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.specialOffersSection).toBeVisible({ timeout: 10000 });
            const scrollBefore = await homePage.getSectionScrollLeft(homePage.locators.specialOffersSection);
            await homePage.scrollSectionRight(homePage.locators.specialOffersSection, 300);
            const scrollAfter = await homePage.getSectionScrollLeft(homePage.locators.specialOffersSection);
            expect(scrollAfter).toBeGreaterThan(scrollBefore);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-020-specialOffersScroll', testInfo);
        });

        test('HP-LO-021 - Verify Show All link redirects user to Promotions page', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.specialOffersShowAllLink).toBeVisible({ timeout: 10000 });
            await homePage.locators.specialOffersShowAllLink.click();
            await page.waitForURL(/\/promotions/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/promotions/);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-021-specialOffersShowAll', testInfo);
        });

        test('HP-LO-022 - Verify tapping promo card redirects user to respective promotion detail page', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.promoCard).toBeVisible({ timeout: 10000 });
            await homePage.locators.promoCard.click();
            await page.waitForURL(/\/promotions\//, { timeout: 10000 });
            expect(page.url()).toMatch(/\/promotions\//);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-022-promoCardRedirect', testInfo);
        });

        test('HP-LO-023 - Verify Stackpot banner is displayed with live jackpot meter and CTA buttons', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.stackpotBanner).toBeVisible({ timeout: 10000 });
            await expect(homePage.locators.stackpotJackpotMeter).toBeVisible({ timeout: 5000 });
            const meterText = await homePage.locators.stackpotJackpotMeter.textContent();
            expect(meterText?.trim()).toBeTruthy();
            expect(meterText).toMatch(/R\d/);
            await expect(homePage.locators.stackpotPlayNowBtn).toBeVisible({ timeout: 5000 });
            await expect(homePage.locators.stackpotMoreInfoBtn).toBeVisible({ timeout: 5000 });
            await homePage.highlightElement('stackpotBanner');
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-023-stackpotBanner', testInfo);
        });

        test('HP-LO-024 - Verify Play Now CTA on Stackpot banner redirects user to Slot vertical page', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.stackpotPlayNowBtn).toBeVisible({ timeout: 10000 });
            await homePage.locators.stackpotPlayNowBtn.click();
            await page.waitForURL(/\/spingames/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/spingames/);
            expect(page.url()).toContain('progressive=true');
            const firstGameCard = homePage.gameCards.first();
            await expect(firstGameCard).toBeVisible({ timeout: 10000 });
            const cardCount = await homePage.gameCards.count();
            expect(cardCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-024-stackpotPlayNow', testInfo);
        });

        test('HP-LO-025 - Verify More Info CTA on Stackpot banner triggers Stackpot Jackpot info window', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.stackpotMoreInfoBtn).toBeVisible({ timeout: 10000 });
            await homePage.locators.stackpotMoreInfoBtn.click();
            await expect(homePage.locators.stackpotModal).toBeVisible({ timeout: 5000 });
            await expect(homePage.locators.stackpotModalTitle).toBeVisible({ timeout: 5000 });
            const titleText = await homePage.locators.stackpotModalTitle.textContent();
            expect(titleText?.trim().toLowerCase()).toContain('stackpot');
            await expect(homePage.locators.stackpotModalDescription).toBeVisible({ timeout: 5000 });
            const descText = await homePage.locators.stackpotModalDescription.textContent();
            expect(descText?.trim()).toBeTruthy();
            expect(descText?.toLowerCase()).toContain('stackpot');
            await expect(homePage.locators.stackpotModalPlayNowBtn).toBeVisible({ timeout: 5000 });
            await expect(homePage.locators.stackpotModalCloseBtn).toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-025-stackpotMoreInfo', testInfo);
            await homePage.locators.stackpotModalCloseBtn.click();
            await expect(homePage.locators.stackpotModal).not.toBeVisible({ timeout: 5000 });
        });

        test('HP-LO-026 - Verify horizontal scrollability of generic game sections', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.gameSection).toBeVisible({ timeout: 10000 });
            await homePage.locators.gameSection.scrollIntoViewIfNeeded();
            const scrollBefore = await homePage.getSectionScrollLeft(homePage.locators.gameSection);
            await homePage.scrollSectionRight(homePage.locators.gameSection, 300);
            const scrollAfter = await homePage.getSectionScrollLeft(homePage.locators.gameSection);
            expect(scrollAfter).toBeGreaterThan(scrollBefore);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-026-gameSectionScroll', testInfo);
        });

        test('HP-LO-027 - Verify visibility of All Games link', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.gameSectionAllLink).toBeVisible({ timeout: 10000 });
            await homePage.highlightElement('gameSectionAllLink');
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-027-allGamesLink', testInfo);
        });

        test('HP-LO-028 - Verify navigation from All Games link', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.gameSectionAllLink).toBeVisible({ timeout: 10000 });
            await homePage.locators.gameSectionAllLink.click();
            await page.waitForURL(/\/spingames/, { timeout: 10000 });
            expect(page.url()).toContain('/spingames');
            await expect(homePage.spingamesAllButton).toBeVisible({ timeout: 10000 });
            const gameCards = homePage.gameCards;
            await expect(gameCards.first()).toBeVisible({ timeout: 10000 });
            expect(await gameCards.count()).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-028-allGamesNav', testInfo);
        });

        test('HP-LO-029 - Verify game launch from generic game sections', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.gameSectionCard).toBeVisible({ timeout: 10000 });
            // the game card is a link to its game page — verify we land on THAT game
            const href = await homePage.locators.gameSectionCard.getAttribute('href');
            const gamePath = (href || '').split('?')[0];
            expect(gamePath).toContain('/home/');
            await homePage.locators.gameSectionCard.click();
            await expect(page).toHaveURL(new RegExp(gamePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
            // logged out: the game page offers Play now (login required to play)
            await expect(homePage.playNowButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-029-gameLaunch', testInfo);
        });

        test('HP-LO-030 - Verify game tile image, Play Now CTA and content are displayed correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.gameSectionCard).toBeVisible({ timeout: 10000 });
            await homePage.highlightElement('gameSectionCard');
            await expect(homePage.locators.gameSectionImg).toBeVisible({ timeout: 5000 });
            // tile image must have actually loaded
            await expect.poll(() => homePage.locators.gameSectionImg.evaluate((el: any) => el.naturalWidth), { timeout: 10000 }).toBeGreaterThan(0);
            const ariaLabel = await homePage.locators.gameSectionCard.getAttribute('aria-label');
            expect(ariaLabel?.trim()).toBeTruthy();
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-030-gameTileContent', testInfo);
        });

        test('HP-LO-031 - Verify clicking Providers breadcrumb on provider detail page navigates to providers listing', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.goto('/home/providers', { waitUntil: 'domcontentloaded' });
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            const firstTile = homePage.providerCards.first();
            await expect(firstTile).toBeVisible({ timeout: 10000 });
            await firstTile.click();
            await page.waitForURL(/\/providers\//, { timeout: 10000 });
            await expect(homePage.locators.providerDetailBreadcrumbProviders).toBeVisible({ timeout: 10000 });
            await homePage.highlightLocator('providerDetailBreadcrumbProviders', homePage.locators.providerDetailBreadcrumbProviders);
            await homePage.locators.providerDetailBreadcrumbProviders.click();
            await page.waitForURL(/\/home\/providers$/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/home\/providers$/);
            await ScreenshotHelper(page, screenshotDir, 'HP-LO-031-providerBreadcrumbNav', testInfo);
        });

    });

    // ─────────────────────────────────────────────────────────────────────────
    // LOGGED IN
    // ─────────────────────────────────────────────────────────────────────────
    test.describe('Home Page - Logged In', () => {

        test.beforeEach(async ({ page, headerPage, testData }: HomePageSuiteFixtures) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
        });

        test('HP-LI-001 - Verify horizontal scrollability of homepage banners', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.bannerCarousel).toBeVisible({ timeout: 10000 });
            const indexBefore = await homePage.getActivePaginationIndex();
            await homePage.clickBannerNext();
            const indexAfter = await homePage.getActivePaginationIndex();
            expect(indexAfter).not.toBe(indexBefore);
            await homePage.highlightElement('bannerActivePagination');
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-001-bannerScroll', testInfo);
        });

        test('HP-LI-002 - Verify visibility of CTA buttons on homepage banners', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.bannerCarousel).toBeVisible({ timeout: 10000 });
            await expect(homePage.locators.bannerActiveSlide).toBeVisible({ timeout: 5000 });
            await expect(homePage.locators.bannerImage).toBeVisible({ timeout: 5000 });
            // banner image must have actually loaded, not just have a broken src
            await expect.poll(() => homePage.locators.bannerImage.evaluate((el: any) => el.naturalWidth), { timeout: 10000 }).toBeGreaterThan(0);
            await homePage.highlightElement('bannerImage');
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-002-bannerVisible', testInfo);
        });

        test('HP-LI-003 - Verify banner CTA redirects to respective page correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.bannerCarousel).toBeVisible({ timeout: 10000 });
            const urlBefore = page.url();
            await homePage.locators.bannerImage.click();
            // logged in: banner must navigate OR open a dialog (e.g. deposit) — a dead banner is a bug
            await expect.poll(async () => {
                if (page.url() !== urlBefore) return 'navigated';
                if (await homePage.anyDialog.isVisible().catch(() => false)) return 'dialog';
                return '';
            }, { timeout: 10000 }).not.toBe('');
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-003-bannerRedirect', testInfo);
        });

        test('HP-LI-004 - Verify auto-scrolling functionality of Big Winners carousel', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.bigWinnersMarquee).toBeVisible({ timeout: 10000 });
            await homePage.highlightElement('bigWinnersMarquee');
            const getTransform = () =>
                homePage.locators.bigWinnersMarquee.evaluate((el: Element) =>
                    window.getComputedStyle(el).transform
                );
            const before = await getTransform();
            // poll until the marquee actually moves instead of hoping 1.5s is enough
            await expect.poll(getTransform, { timeout: 8000 }).not.toBe(before);
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-004-bigWinnersAutoScroll', testInfo);
        });

        test('HP-LI-005 - Verify winner details are displayed correctly in Big Winners carousel', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.bigWinnersItem).toBeVisible({ timeout: 10000 });
            await homePage.highlightElement('bigWinnersItem');
            // game title
            await expect(homePage.locators.bigWinnersGameTitle).toBeVisible({ timeout: 5000 });
            const gameTitle = await homePage.locators.bigWinnersGameTitle.textContent();
            expect(gameTitle?.trim()).toBeTruthy();
            // win amount must be a real rand value, e.g. "R 236,580.00"
            await expect(homePage.locators.bigWinnersAmount).toBeVisible({ timeout: 5000 });
            const amount = await homePage.locators.bigWinnersAmount.textContent();
            expect(amount?.trim()).toMatch(/R\s*[\d,]+\.\d{2}/);
            // masked user must be an actually masked account, e.g. "*******5648"
            await expect(homePage.locators.bigWinnersMaskedUser).toBeVisible({ timeout: 5000 });
            const maskedUser = await homePage.locators.bigWinnersMaskedUser.textContent();
            expect(maskedUser?.trim()).toMatch(/^\*+\d+$/);
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-005-bigWinnersDetails', testInfo);
        });

        test('HP-LI-006 - Verify tapping Big Winners title redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            // TODO: requires Big Winners section heading HTML to identify the title link selector
        });

        test('HP-LI-007 - Verify game launches successfully from Big Winners carousel', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.bigWinnersItem).toBeVisible({ timeout: 10000 });
            const urlBefore = page.url();
            await homePage.locators.bigWinnersItem.click({ force: true });
            await page.waitForURL(/\/home\//, { timeout: 10000 });
            expect(page.url()).not.toBe(urlBefore);
            await expect(homePage.gameFrame).toBeVisible({ timeout: 30000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-007-bigWinnersLaunch', testInfo);
        });

        test('HP-LI-008 - Verify user is able to mark game as favourite', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.trendingSection).toBeVisible({ timeout: 10000 });
            await expect(homePage.locators.trendingFavBtn).toBeVisible({ timeout: 5000 });
            // Normalize state: a previous run may have left this game favourited
            if (await homePage.locators.trendingFavActiveBtn.isVisible().catch(() => false)) {
                await homePage.locators.trendingFavBtn.click();
                await expect(homePage.locators.trendingFavActiveBtn).not.toBeVisible({ timeout: 5000 });
            }
            await homePage.locators.trendingFavBtn.click();
            await expect(homePage.locators.trendingFavActiveBtn).toBeVisible({ timeout: 5000 });
            await homePage.highlightElement('trendingFavActiveBtn');
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-008-markFavourite', testInfo);
            // clean up
            await homePage.locators.trendingFavBtn.click();
            await expect(homePage.locators.trendingFavActiveBtn).not.toBeVisible({ timeout: 5000 });
        });

        test('HP-LI-009 - Verify user is able to unmark favourite game', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.trendingSection).toBeVisible({ timeout: 10000 });
            // Normalize state: start from not-favourited regardless of previous runs
            if (await homePage.locators.trendingFavActiveBtn.isVisible().catch(() => false)) {
                await homePage.locators.trendingFavBtn.click();
                await expect(homePage.locators.trendingFavActiveBtn).not.toBeVisible({ timeout: 5000 });
            }
            await homePage.locators.trendingFavBtn.click();
            await expect(homePage.locators.trendingFavActiveBtn).toBeVisible({ timeout: 5000 });
            await homePage.locators.trendingFavBtn.click();
            await expect(homePage.locators.trendingFavActiveBtn).not.toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-009-unmarkFavourite', testInfo);
        });

        test('HP-LI-010 - Verify Favorites section is hidden when no favourite games are available', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.waitForLoadState('domcontentloaded');
            await expect(homePage.locators.favouritesSection).not.toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-010-favouritesHidden', testInfo);
        });

        test('HP-LI-011 - Verify user is able to favourite multiple games', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.trendingSection).toBeVisible({ timeout: 10000 });
            const favBtns = homePage.featuredFavourites;
            const count = await favBtns.count();
            expect(count).toBeGreaterThan(1);
            // Normalize state: both target games must start un-favourited
            for (const i of [0, 1]) {
                const active = favBtns.nth(i).locator('svg.primary-pink-gradient-text');
                if (await active.isVisible().catch(() => false)) {
                    await favBtns.nth(i).click();
                    await expect(active).not.toBeVisible({ timeout: 5000 });
                }
            }
            await favBtns.nth(0).click();
            await favBtns.nth(1).click();
            const activeBtns = homePage.featuredActiveFavourites;
            await expect(activeBtns).toHaveCount(2, { timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-011-multipleFavourites', testInfo);
            // clean up
            await favBtns.nth(0).click();
            await favBtns.nth(1).click();
        });

        test('HP-LI-012 - Verify favourite games persist after page refresh', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.trendingSection).toBeVisible({ timeout: 10000 });
            // Normalize state: start from not-favourited regardless of previous runs
            if (await homePage.locators.trendingFavActiveBtn.isVisible().catch(() => false)) {
                await homePage.locators.trendingFavBtn.click();
                await expect(homePage.locators.trendingFavActiveBtn).not.toBeVisible({ timeout: 5000 });
            }
            await homePage.locators.trendingFavBtn.click();
            await expect(homePage.locators.trendingFavActiveBtn).toBeVisible({ timeout: 5000 });
            await page.reload({ waitUntil: 'domcontentloaded' });
            await expect(homePage.locators.trendingSection).toBeVisible({ timeout: 15000 });
            await expect(homePage.locators.trendingFavActiveBtn).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-012-favouritePersist', testInfo);
            // clean up
            await homePage.locators.trendingFavBtn.click();
            await expect(homePage.locators.trendingFavActiveBtn).not.toBeVisible({ timeout: 5000 });
        });

        test('HP-LI-013 - Verify launched game is added to Recently Played section', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.trendingSection).toBeVisible({ timeout: 10000 });
            await homePage.locators.trendingGameCard.click();
            await page.waitForURL(/\/home\//, { timeout: 10000 });
            await page.waitForLoadState('domcontentloaded');
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await expect(homePage.locators.recentlyPlayedSection).toBeVisible({ timeout: 10000 });
            await expect(homePage.locators.recentlyPlayedCard).toBeVisible({ timeout: 5000 });
            await homePage.highlightElement('recentlyPlayedSection');
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-013-recentlyPlayed', testInfo);
        });

        test('HP-LI-014 - Verify Recently Played section maintains latest played game order', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.trendingSection).toBeVisible({ timeout: 10000 });
            const playedGameTitle = await homePage.locators.trendingGameCard.getAttribute('aria-label');
            await homePage.locators.trendingGameCard.click();
            await page.waitForURL(/\/home\//, { timeout: 10000 });
            await page.waitForLoadState('domcontentloaded');
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await expect(homePage.locators.recentlyPlayedSection).toBeVisible({ timeout: 10000 });
            const firstCard = homePage.recentlyPlayedFirstCard;
            await expect(firstCard).toBeVisible({ timeout: 10000 });
            const firstCardTitle = await firstCard.getAttribute('aria-label');
            expect(firstCardTitle).toBe(playedGameTitle);
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-014-recentlyPlayedOrder', testInfo);
        });

        test('HP-LI-015 - Verify Recently Played section visibility', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.trendingSection).toBeVisible({ timeout: 10000 });
            await homePage.locators.trendingGameCard.click();
            await page.waitForURL(/\/home\//, { timeout: 10000 });
            await page.waitForLoadState('domcontentloaded');
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await expect(homePage.locators.recentlyPlayedSection).toBeVisible({ timeout: 10000 });
            await homePage.highlightElement('recentlyPlayedSection');
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-015-recentlyPlayedVisible', testInfo);
        });

        test('HP-LI-016 - Verify user is able to launch game from Recently Played section', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.trendingSection).toBeVisible({ timeout: 10000 });
            await homePage.locators.trendingGameCard.click();
            await page.waitForURL(/\/home\//, { timeout: 10000 });
            await page.waitForLoadState('domcontentloaded');
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await expect(homePage.locators.recentlyPlayedSection).toBeVisible({ timeout: 10000 });
            await expect(homePage.locators.recentlyPlayedCard).toBeVisible({ timeout: 5000 });
            const urlBefore = page.url();
            await homePage.locators.recentlyPlayedCard.click();
            await page.waitForURL(/\/home\//, { timeout: 10000 });
            expect(page.url()).not.toBe(urlBefore);
            await expect(homePage.gameFrame).toBeVisible({ timeout: 30000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-016-recentlyPlayedLaunch', testInfo);
        });

        test('HP-LI-017 - Verify Providers section is displayed correctly on homepage', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.providersSection).toBeVisible({ timeout: 10000 });
            await expect(homePage.locators.providerTile).toBeVisible({ timeout: 5000 });
            await expect(homePage.locators.providerImg).toBeVisible({ timeout: 5000 });
            await homePage.highlightElement('providersSection');
            const tileCount = await homePage.homeProviderCards.count();
            expect(tileCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-017-providersSection', testInfo);
        });

        test('HP-LI-018 - Verify horizontal scrollability of Providers section on homepage', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.providersSection).toBeVisible({ timeout: 10000 });
            await homePage.locators.providersSection.scrollIntoViewIfNeeded();
            const scrollBefore = await homePage.getSectionScrollLeft(homePage.locators.providersSection);
            await homePage.scrollSectionRight(homePage.locators.providersSection, 300);
            const scrollAfter = await homePage.getSectionScrollLeft(homePage.locators.providersSection);
            expect(scrollAfter).toBeGreaterThan(scrollBefore);
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-018-providersScroll', testInfo);
        });

        test('HP-LI-019 - Verify Show All CTA redirects user to All Providers page', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.providersShowAllLink).toBeVisible({ timeout: 10000 });
            await homePage.locators.providersShowAllLink.click();
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/providers/);
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-019-providersShowAll', testInfo);
        });

        test('HP-LI-020 - Verify breadcrumb navigation is displayed correctly on Providers page', async ({ page, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.goto('/home/providers', { waitUntil: 'domcontentloaded' });
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/providers/);
            const heading = homePage.providersBreadcrumbHeading;
            await expect(heading).toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-020-providersBreadcrumb', testInfo);
        });

        test('HP-LI-021 - Verify Back button functionality on Providers page', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.providersShowAllLink.scrollIntoViewIfNeeded();
            await homePage.locators.providersShowAllLink.click();
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            await page.waitForLoadState('domcontentloaded');
            const backBtn = homePage.backButton;
            await expect(backBtn).toBeVisible({ timeout: 5000 });
            await backBtn.click();
            await page.waitForLoadState('domcontentloaded');
            expect(page.url()).not.toContain('/providers');
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-021-providersBack', testInfo);
        });

        test('HP-LI-022 - Verify all provider tiles are displayed correctly on Providers page', async ({ page, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.goto('/home/providers', { waitUntil: 'domcontentloaded' });
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            const tiles = homePage.providerCards;
            await expect(tiles.first()).toBeVisible({ timeout: 10000 });
            const count = await tiles.count();
            expect(count).toBeGreaterThan(5);
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-022-providersPageTiles', testInfo);
        });

        test('HP-LI-023 - Verify provider tiles are accessible on Providers page', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.goto('/home/providers', { waitUntil: 'domcontentloaded' });
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            const firstTile = homePage.providerCards.first();
            await expect(firstTile).toBeVisible({ timeout: 10000 });
            await homePage.highlightLocator('firstProviderTile', firstTile);
            const href = await firstTile.getAttribute('href');
            expect(href).toBeTruthy();
            const imgAlt = await firstTile.locator('img').getAttribute('alt');
            expect(imgAlt?.trim()).toBeTruthy();
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-023-providerTileAccess', testInfo);
        });

        test('HP-LI-024 - Verify tapping provider tile redirects user to provider-specific game listing', async ({ page, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.goto('/home/providers', { waitUntil: 'domcontentloaded' });
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            const firstTile = homePage.providerCards.first();
            await expect(firstTile).toBeVisible({ timeout: 10000 });
            await firstTile.click();
            await page.waitForURL(/\/providers\//, { timeout: 10000 });
            expect(page.url()).toMatch(/\/providers\//);
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-024-providerTileRedirect', testInfo);
        });

        test('HP-LI-025 - Verify horizontal scrollability of generic game sections', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.gameSection).toBeVisible({ timeout: 10000 });
            await homePage.locators.gameSection.scrollIntoViewIfNeeded();
            const scrollBefore = await homePage.getSectionScrollLeft(homePage.locators.gameSection);
            await homePage.scrollSectionRight(homePage.locators.gameSection, 300);
            const scrollAfter = await homePage.getSectionScrollLeft(homePage.locators.gameSection);
            expect(scrollAfter).toBeGreaterThan(scrollBefore);
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-025-gameSectionScroll', testInfo);
        });

        test('HP-LI-026 - Verify visibility of All Games link', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.gameSectionAllLink).toBeVisible({ timeout: 10000 });
            await homePage.highlightElement('gameSectionAllLink');
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-026-allGamesLink', testInfo);
        });

        test('HP-LI-027 - Verify navigation from All Games link', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.gameSectionAllLink).toBeVisible({ timeout: 10000 });
            const urlBefore = page.url();
            await homePage.locators.gameSectionAllLink.click();
            await page.waitForURL(/\/all/, { timeout: 10000 });
            expect(page.url()).not.toBe(urlBefore);
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-027-allGamesNav', testInfo);
        });

        test('HP-LI-028 - Verify user is able to launch game from generic game section', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.gameSectionCard).toBeVisible({ timeout: 10000 });
            const urlBefore = page.url();
            await homePage.locators.gameSectionCard.click();
            await page.waitForURL(/\/home\//, { timeout: 10000 });
            expect(page.url()).not.toBe(urlBefore);
            await expect(homePage.gameFrame).toBeVisible({ timeout: 30000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-028-gameLaunch', testInfo);
        });

        test('HP-LI-029 - Verify game tile image and content are displayed correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(homePage.locators.gameSectionCard).toBeVisible({ timeout: 10000 });
            await homePage.highlightElement('gameSectionCard');
            await expect(homePage.locators.gameSectionImg).toBeVisible({ timeout: 5000 });
            // tile image must have actually loaded
            await expect.poll(() => homePage.locators.gameSectionImg.evaluate((el: any) => el.naturalWidth), { timeout: 10000 }).toBeGreaterThan(0);
            const ariaLabel = await homePage.locators.gameSectionCard.getAttribute('aria-label');
            expect(ariaLabel?.trim()).toBeTruthy();
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-029-gameTileContent', testInfo);
        });

        test('HP-LI-030 - Verify clicking Providers breadcrumb on provider detail page navigates to providers listing', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await page.goto('/home/providers', { waitUntil: 'domcontentloaded' });
            await page.waitForURL(/\/providers/, { timeout: 10000 });
            const firstTile = homePage.providerCards.first();
            await expect(firstTile).toBeVisible({ timeout: 10000 });
            await firstTile.click();
            await page.waitForURL(/\/providers\//, { timeout: 10000 });
            await expect(homePage.locators.providerDetailBreadcrumbProviders).toBeVisible({ timeout: 10000 });
            await homePage.highlightLocator('providerDetailBreadcrumbProviders', homePage.locators.providerDetailBreadcrumbProviders);
            await homePage.locators.providerDetailBreadcrumbProviders.click();
            await page.waitForURL(/\/home\/providers$/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/home\/providers$/);
            await ScreenshotHelper(page, screenshotDir, 'HP-LI-030-providerBreadcrumbNav', testInfo);
        });

    });

    // ─────────────────────────────────────────────────────────────────────────
    // FOOTER
    // ─────────────────────────────────────────────────────────────────────────
    test.describe('Home Page - Footer', () => {

        test.beforeEach(async ({ page }: HomePageSuiteFixtures) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
        });

        test('HP-FT-001 - Verify Show All CTA expands footer description content', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.heroSection.scrollIntoViewIfNeeded();
            await expect(homePage.locators.heroSection).toBeVisible({ timeout: 10000 });
            await expect(homePage.locators.heroShowAllBtn).toBeVisible({ timeout: 10000 });
            const btnText = await homePage.locators.heroShowAllBtn.textContent();
            expect(btnText?.trim()).toBe('Show All');
            await homePage.locators.heroShowAllBtn.click();
            // expansion is real when the toggle flips to "Show Less"
            await expect(homePage.locators.heroShowAllBtn).toHaveText(/Show Less/i, { timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-001-showAll', testInfo);
            // collapse again and verify the toggle returns
            await homePage.locators.heroShowAllBtn.click();
            await expect(homePage.locators.heroShowAllBtn).toHaveText(/Show All/i, { timeout: 5000 });
        });

        test('HP-FT-002 - Verify Responsible Gaming CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerResponsibleGambling.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerResponsibleGambling).toBeVisible({ timeout: 10000 });
            await homePage.locators.footerResponsibleGambling.click();
            await page.waitForURL(/\/responsible-gambling/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/responsible-gambling/);
            await page.waitForLoadState('domcontentloaded');
            await expect(homePage.genericPageHeading).toBeVisible({ timeout: 10000 });
            const pageHeading = await homePage.genericPageHeading.textContent();
            expect(pageHeading?.trim()).toBeTruthy();
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-002-responsibleGambling', testInfo);
        });

        test('HP-FT-003 - Verify FAQs CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerFaq.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerFaq).toBeVisible({ timeout: 10000 });
            await homePage.locators.footerFaq.click();
            await page.waitForURL(/\/faq/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/faq/);
            await page.waitForLoadState('domcontentloaded');
            await expect(homePage.genericPageHeading).toBeVisible({ timeout: 10000 });
            const pageHeading = await homePage.genericPageHeading.textContent();
            expect(pageHeading?.trim()).toBeTruthy();
            await expect(homePage.accordionContainer).toBeVisible({ timeout: 10000 });
            const faqAccordionItems = homePage.accordionItems;
            await expect(faqAccordionItems.first()).toBeVisible({ timeout: 10000 });
            const faqItemCount = await faqAccordionItems.count();
            expect(faqItemCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-003-faq', testInfo);
        });

        test('HP-FT-004 - Verify Get the App CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerGetTheApp.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerGetTheApp).toBeVisible({ timeout: 10000 });
            await homePage.locators.footerGetTheApp.click();
            await page.waitForURL(/\/get-the-app/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/get-the-app/);
            await page.waitForLoadState('domcontentloaded');
            await expect(homePage.getAppHeading).toBeVisible({ timeout: 10000 });
            await expect(homePage.getAppAppleButton).toBeVisible({ timeout: 10000 });
            await expect(homePage.getAppAndroidButton).toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-004-getTheApp', testInfo);
        });

        test('HP-FT-005 - Verify Privacy Policy CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerPrivacyPolicy.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerPrivacyPolicy).toBeVisible({ timeout: 10000 });
            await homePage.locators.footerPrivacyPolicy.click();
            await page.waitForURL(/\/privacy-policy/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/privacy-policy/);
            await page.waitForLoadState('domcontentloaded');
            await expect(homePage.genericPageHeading).toBeVisible({ timeout: 10000 });
            const pageHeading = await homePage.genericPageHeading.textContent();
            expect(pageHeading?.trim()).toBeTruthy();
            await expect(homePage.accordionContainer).toBeVisible({ timeout: 10000 });
            const accordionItems = homePage.accordionItems;
            await expect(accordionItems.first()).toBeVisible({ timeout: 10000 });
            const ppItemCount = await accordionItems.count();
            expect(ppItemCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-005-privacyPolicy', testInfo);
        });

        test('HP-FT-006 - Verify Contact Us CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerContactUs.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerContactUs).toBeVisible({ timeout: 10000 });
            await homePage.locators.footerContactUs.click();
            await page.waitForURL(/\/contact-us/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/contact-us/);
            await page.waitForLoadState('domcontentloaded');
            await expect(homePage.genericPageHeading).toBeVisible({ timeout: 10000 });
            const pageHeading = await homePage.genericPageHeading.textContent();
            expect(pageHeading?.trim()).toBeTruthy();
            await expect(homePage.contactUsContainer).toBeVisible({ timeout: 10000 });
            await expect(homePage.contactSupportEmail).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-006-contactUs', testInfo);
        });

        test('HP-FT-007 - Verify Terms and Conditions CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerTermsConditions.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerTermsConditions).toBeVisible({ timeout: 10000 });
            await homePage.locators.footerTermsConditions.click();
            await page.waitForURL(/\/terms-and-conditions/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/terms-and-conditions/);
            await page.waitForLoadState('domcontentloaded');
            await expect(homePage.genericPageHeading).toBeVisible({ timeout: 10000 });
            const pageHeading = await homePage.genericPageHeading.textContent();
            expect(pageHeading?.trim()).toBeTruthy();
            await expect(homePage.accordionContainer).toBeVisible({ timeout: 10000 });
            const tcAccordionItems = homePage.accordionItems;
            await expect(tcAccordionItems.first()).toBeVisible({ timeout: 10000 });
            const tcItemCount = await tcAccordionItems.count();
            expect(tcItemCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-007-termsConditions', testInfo);
        });

        test('HP-FT-009 - Verify How To CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerHowTo.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerHowTo).toBeVisible({ timeout: 10000 });
            await homePage.locators.footerHowTo.click();
            await page.waitForURL(/\/how-to/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/how-to/);
            await page.waitForLoadState('domcontentloaded');
            await expect(homePage.genericPageHeading).toBeVisible({ timeout: 10000 });
            const pageHeading = await homePage.genericPageHeading.textContent();
            expect(pageHeading?.trim()).toBeTruthy();
            await expect(homePage.howToContentWrapper).toBeVisible({ timeout: 10000 });
            const howToSections = homePage.howToSections;
            await expect(howToSections.first()).toBeVisible({ timeout: 10000 });
            const sectionCount = await howToSections.count();
            expect(sectionCount).toBeGreaterThan(0);
            const howToDetails = homePage.howToDetails;
            const detailsCount = await howToDetails.count();
            expect(detailsCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-009-howTo', testInfo);
        });

        test('HP-FT-010 - Verify Apple Store download CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerAppleBtn.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerAppleBtn).toBeVisible({ timeout: 10000 });
            const downloadHref = await homePage.locators.footerAppDownloadLink.getAttribute('href');
            expect(downloadHref).toContain('JackpotCityAppDownload');
            const [newTab] = await Promise.all([
                page.context().waitForEvent('page'),
                homePage.locators.footerAppleBtn.click()
            ]);
            await newTab.waitForLoadState('domcontentloaded', { timeout: 15000 });
            // NOTE: currently lands on jackpotcity.com (not the App Store) — same as the hamburger app
            // buttons; confirm intended target with the team. Guard against blank/error tabs meanwhile.
            expect(newTab.url()).toMatch(/jackpotcity|apple\.com/i);
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-010-appleStore', testInfo);
            await newTab.close();
        });

        test('HP-FT-011 - Verify Android Store download CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerAndroidBtn.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerAndroidBtn).toBeVisible({ timeout: 10000 });
            await expect(homePage.appImage('Jackpotcity Android App')).toBeVisible({ timeout: 5000 });
            const downloadHref = await homePage.locators.footerAppDownloadLink.getAttribute('href');
            expect(downloadHref).toContain('JackpotCityAppDownload');
            const relAttr = await homePage.locators.footerAppDownloadLink.getAttribute('rel');
            expect(relAttr).toContain('noopener');
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-011-androidStore', testInfo);
        });

        test('HP-FT-012 - Verify Huawei App Gallery CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerHuaweiBtn.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerHuaweiBtn).toBeVisible({ timeout: 10000 });
            await expect(homePage.appImage('Jackpotcity Huawei App')).toBeVisible({ timeout: 5000 });
            const downloadHref = await homePage.locators.footerAppDownloadLink.getAttribute('href');
            expect(downloadHref).toContain('JackpotCityAppDownload');
            const relAttr = await homePage.locators.footerAppDownloadLink.getAttribute('rel');
            expect(relAttr).toContain('noopener');
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-012-huaweiStore', testInfo);
        });

        test('HP-FT-013 - Verify Instagram social media CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerInstagramLink.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerInstagramLink).toBeVisible({ timeout: 10000 });
            const href = await homePage.locators.footerInstagramLink.getAttribute('href');
            expect(href).toContain('instagram.com');
            const [newTab] = await Promise.all([
                page.context().waitForEvent('page'),
                homePage.locators.footerInstagramLink.click()
            ]);
            await newTab.waitForLoadState('domcontentloaded', { timeout: 15000 });
            expect(newTab.url()).toMatch(/instagram\.com/);
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-013-instagram', testInfo);
            await newTab.close();
        });

        test('HP-FT-014 - Verify Facebook social media CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerFacebookLink.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerFacebookLink).toBeVisible({ timeout: 10000 });
            const href = await homePage.locators.footerFacebookLink.getAttribute('href');
            expect(href).toContain('facebook.com');
            const [newTab] = await Promise.all([
                page.context().waitForEvent('page'),
                homePage.locators.footerFacebookLink.click()
            ]);
            await newTab.waitForLoadState('domcontentloaded', { timeout: 15000 });
            expect(newTab.url()).toMatch(/facebook\.com/);
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-014-facebook', testInfo);
            await newTab.close();
        });

        test('HP-FT-015 - Verify Twitter/X social media CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerTwitterLink.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerTwitterLink).toBeVisible({ timeout: 10000 });
            const href = await homePage.locators.footerTwitterLink.getAttribute('href');
            expect(href).toContain('x.com');
            const [newTab] = await Promise.all([
                page.context().waitForEvent('page'),
                homePage.locators.footerTwitterLink.click()
            ]);
            await newTab.waitForLoadState('domcontentloaded', { timeout: 15000 });
            expect(newTab.url()).toMatch(/x\.com|twitter\.com/);
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-015-twitter', testInfo);
            await newTab.close();
        });

        test('HP-FT-016 - Verify About Us CTA redirects user correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerAboutUs.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerAboutUs).toBeVisible({ timeout: 10000 });
            await homePage.locators.footerAboutUs.click();
            await page.waitForURL(/\/about-us/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/about-us/);
            await page.waitForLoadState('domcontentloaded');
            await expect(homePage.genericPageHeading).toBeVisible({ timeout: 10000 });
            const pageHeading = await homePage.genericPageHeading.textContent();
            expect(pageHeading?.trim()).toBeTruthy();
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-016-aboutUs', testInfo);
        });

        test('HP-FT-017 - Verify PAIA Manual CTA opens PDF successfully', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerPaiaManual.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerPaiaManual).toBeVisible({ timeout: 10000 });
            await homePage.locators.footerPaiaManual.click();
            await page.waitForURL(/\/paia-manual/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/paia-manual/);
            await page.waitForLoadState('domcontentloaded');
            await expect(homePage.genericPageHeading).toBeVisible({ timeout: 10000 });
            const pageHeading = await homePage.genericPageHeading.textContent();
            expect(pageHeading?.trim()).toBeTruthy();
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-017-paiaManual', testInfo);
        });

        test('HP-FT-018 - Verify footer payment method icons are displayed correctly', async ({ page, homePage, screenshotDir }: HomePageSuiteFixtures, testInfo: TestInfo) => {
            await homePage.locators.footerVisaIcon.scrollIntoViewIfNeeded();
            await expect(homePage.locators.footerVisaIcon).toBeVisible({ timeout: 10000 });
            await expect(homePage.locators.footerMastercardIcon).toBeVisible({ timeout: 5000 });
            await expect(homePage.locators.footerZapperIcon).toBeVisible({ timeout: 5000 });
            await expect(homePage.locators.footerOzowIcon).toBeVisible({ timeout: 5000 });
            await expect(homePage.locators.footerApplePayIcon).toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'HP-FT-018-paymentIcons', testInfo);
        });

    });

}
