import { Page, TestType } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { VerticalPage } from '../pages/VerticalPage';

/**
 * Vertical Pages suite — Slot Games, Live Games, Crash Games, Quick Games, Betgames.
 * One parameterised implementation; the region spec runs it for every vertical. All selectors,
 * waits and assertions live in the VerticalPage object (constructed per test with the path).
 */

export interface VerticalConfig {
    name: string;
    code: string;
    path: string;
    /** Crash Games renders no per-section "All Games" links (confirmed live). */
    hasAllGamesLinks: boolean;
}

export const VERTICALS: VerticalConfig[] = [
    { name: 'Slot Games', code: 'SG', path: '/spingames', hasAllGamesLinks: true },
    { name: 'Live Games', code: 'LG', path: '/livegames', hasAllGamesLinks: true },
    { name: 'Crash Games', code: 'CG', path: '/crashgames', hasAllGamesLinks: false },
    { name: 'Quick Games', code: 'QG', path: '/quickgames', hasAllGamesLinks: true },
    { name: 'Betgames', code: 'BG', path: '/betgames', hasAllGamesLinks: true },
];

type VerticalPagesFixtures = {
    page: Page;
    headerPage: HeaderPage;
    testData: any;
};

export async function runVerticalPagesTests(
    test: TestType<VerticalPagesFixtures, any>,
    v: VerticalConfig
) {

    const id = (n: string) => `VP-${v.code}-${n}`;
    const vertical = (page: Page) => new VerticalPage(page, v.path);

    test.describe(`${v.name} - Vertical Page`, () => {

        test.describe('Logged Out', () => {

            test.beforeEach(async ({ page }: VerticalPagesFixtures) => {
                await vertical(page).goto();
            });

            test(`${id('001')} - banners are displayed with a loaded image`, async ({ page }: VerticalPagesFixtures) => {
                const vp = vertical(page);
                test.skip(!await vp.hasBanners(), 'No banner carousel on vertical pages in this region');
                await vp.expectBannerLoaded();
            });

            test(`${id('003')} - category options are displayed`, async ({ page }: VerticalPagesFixtures) => {
                await vertical(page).expectCategoryChips();
            });

            test(`${id('004')} - every category is accessible and shows games`, async ({ page }: VerticalPagesFixtures) => {
                await vertical(page).expectEveryCategoryHasGames();
            });

            test(`${id('005')} - tapping a category shows its game tiles`, async ({ page }: VerticalPagesFixtures) => {
                await vertical(page).openFirstCategory();
            });

            test(`${id('006')} - a Back button is shown on a category page`, async ({ page }: VerticalPagesFixtures) => {
                const vp = vertical(page);
                await vp.openFirstCategory();
                await vp.expectBackButtonVisible();
            });

            test(`${id('007')} - Back returns to the All category page`, async ({ page }: VerticalPagesFixtures) => {
                const vp = vertical(page);
                await vp.openFirstCategory();
                await vp.expectBackButtonVisible();
                await vp.backToAllCategory();
            });

            test(`${id('013')} - game tiles scroll horizontally`, async ({ page }: VerticalPagesFixtures) => {
                await vertical(page).expectTilesScroll();
            });

        });

        test.describe('Logged In', () => {

            test.beforeEach(async ({ page, headerPage, testData }: VerticalPagesFixtures) => {
                test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Logged-in: pending test account');
                await headerPage.navigateTo('/');
                await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
                await vertical(page).goto();
            });

            test(`${id('002')} - banners scroll (or render a single slide)`, async ({ page }: VerticalPagesFixtures) => {
                const vp = vertical(page);
                test.skip(!await vp.hasBanners(), 'No banner carousel on vertical pages in this region');
                await vp.expectBannersScroll();
            });

            test(`${id('008')} - the Providers chip opens the provider listing`, async ({ page }: VerticalPagesFixtures) => {
                await vertical(page).openProvidersViaChip();
            });

            test(`${id('009')} - the provider listing loads with tiles`, async ({ page }: VerticalPagesFixtures) => {
                await vertical(page).expectProviderListing();
            });

            test(`${id('010')} - all available providers are displayed`, async ({ page }: VerticalPagesFixtures) => {
                await vertical(page).expectAllProvidersDisplayed();
            });

            test(`${id('011')} - a provider-specific listing opens`, async ({ page }: VerticalPagesFixtures) => {
                await vertical(page).openFirstProviderListing();
            });

            test(`${id('012')} - a game launches from a provider listing`, async ({ page }: VerticalPagesFixtures) => {
                const vp = vertical(page);
                const { bounced, href } = await vp.launchFirstProviderGame();
                test.skip(bounced, `test account is restricted from ${v.name} games — needs a fully verified account`);
                await vp.expectGameLaunched(href);
            });

            test(`${id('014')} - navigation from the All Games link`, async ({ page }: VerticalPagesFixtures) => {
                test.skip(!v.hasAllGamesLinks, `${v.name} has no All Games links by design`);
                await vertical(page).expectAllGamesLink();
            });

            test(`${id('015')} - a game launches from the category list`, async ({ page }: VerticalPagesFixtures) => {
                const vp = vertical(page);
                const { bounced, href } = await vp.launchFirstCategoryGame();
                test.skip(bounced, `test account is restricted from ${v.name} games — needs a fully verified account`);
                await vp.expectGameLaunched(href);
            });

        });

    });
}
