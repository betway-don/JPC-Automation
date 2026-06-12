import { Page, TestInfo, TestType, expect } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { VerticalPage } from '../pages/VerticalPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

/**
 * Vertical Pages suite — Slot Games, Live Games, Crash Games, Quick Games, Betgames.
 * One parameterised implementation; the ZA spec runs it for every vertical. All selectors
 * live in the VerticalPage Page Object (constructed per test with the vertical's path).
 *
 * Reality notes vs the Excel sheet (confirmed by live discovery 2026-06-12):
 *  - Vertical pages have NO provider carousel / "Show All"; providers are a category chip → <path>/providers.
 *  - Crash Games has a category bar but no per-section "All Games" links.
 *  - Only Slot Games has multiple banners; the others show a single banner.
 *  - Logged-in game launch can bounce to ?accountRestricted=1 for a not-fully-verified account.
 */

export interface VerticalConfig {
    name: string;
    code: string;
    path: string;
    /** Crash Games renders no per-section "All Games" links (confirmed live) */
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
    screenshotDir: string;
    testData: any;
};

export async function runVerticalPagesTests(
    test: TestType<VerticalPagesFixtures, any>,
    v: VerticalConfig
) {

    const id = (n: string) => `VP-${v.code}-${n}`;
    const vertical = (page: Page) => new VerticalPage(page, v.path);
    const pathRe = (suffix: string) => new RegExp(`${v.path.replace('/', '\\/')}${suffix}`);

    test.describe(`${v.name} - Vertical Page`, () => {

        // ── Logged out ───────────────────────────────────────────────────────

        test.describe('Logged Out', () => {

            test.beforeEach(async ({ page }: VerticalPagesFixtures) => {
                await vertical(page).goto();
            });

            test(`${id('001')} - Verify banners are displayed correctly with content and CTA`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                await expect(vp.bannerCarousel.first()).toBeVisible({ timeout: 15000 });
                await expect(vp.bannerActiveSlide.first()).toBeVisible({ timeout: 10000 });
                const img = vp.bannerImage.first();
                await expect(img).toBeVisible({ timeout: 10000 });
                // banner image must have actually loaded, not just have a broken src
                await expect.poll(() => img.evaluate((el: any) => el.naturalWidth), { timeout: 10000 }).toBeGreaterThan(0);
                await ScreenshotHelper(page, screenshotDir, `${id('001')}-banners`, testInfo);
            });

            test(`${id('003')} - Verify category options are displayed correctly`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                await expect(vp.categoryChips.first()).toBeVisible({ timeout: 15000 });
                // at least the All chip plus one real category
                expect(await vp.categoryChips.count(), 'vertical should offer more than just the All chip').toBeGreaterThan(1);
                await ScreenshotHelper(page, screenshotDir, `${id('003')}-categories`, testInfo);
            });

            test(`${id('004')} - Verify each category option is accessible`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                await expect(vp.categoryChips.first()).toBeVisible({ timeout: 15000 });
                const hrefs = await vp.gameCategoryHrefs();
                expect(hrefs.length).toBeGreaterThan(0);
                for (const href of hrefs) {
                    await page.goto(href, { waitUntil: 'domcontentloaded' });
                    await expect(vp.gameCards.first(), `category ${href} shows no games`).toBeVisible({ timeout: 20000 });
                }
                await ScreenshotHelper(page, screenshotDir, `${id('004')}-categoryAccess`, testInfo);
            });

            test(`${id('005')} - Verify tapping category displays respective game tiles`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                const hrefs = await vp.gameCategoryHrefs();
                expect(hrefs.length).toBeGreaterThan(0);
                const href = hrefs[0];
                await vp.categoryChip(href).first().click();
                await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
                await expect(vp.gameCards.first()).toBeVisible({ timeout: 20000 });
                expect(await vp.gameCards.count()).toBeGreaterThan(0);
                await ScreenshotHelper(page, screenshotDir, `${id('005')}-categoryTiles`, testInfo);
            });

            test(`${id('006')} - Verify Back button is displayed on category-specific page`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                const hrefs = await vp.gameCategoryHrefs();
                expect(hrefs.length).toBeGreaterThan(0);
                await vp.categoryChip(hrefs[0]).first().click();
                await expect(vp.categoryBackButton.first()).toBeVisible({ timeout: 15000 });
                await ScreenshotHelper(page, screenshotDir, `${id('006')}-backBtn`, testInfo);
            });

            test(`${id('007')} - Verify Back button redirects to the All category page`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                const hrefs = await vp.gameCategoryHrefs();
                expect(hrefs.length).toBeGreaterThan(0);
                await vp.categoryChip(hrefs[0]).first().click();
                await expect(vp.categoryBackButton.first()).toBeVisible({ timeout: 15000 });
                await vp.categoryBackButton.first().click();
                await expect(page).toHaveURL(pathRe('/?(\\?.*)?$'), { timeout: 15000 });
                await expect(vp.gameCards.first()).toBeVisible({ timeout: 20000 });
                await ScreenshotHelper(page, screenshotDir, `${id('007')}-backToAll`, testInfo);
            });

            test(`${id('013')} - Verify horizontal scrollability of game tiles under each section`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                await expect(vp.gameScrollers.first()).toBeVisible({ timeout: 15000 });
                // small sections fit the viewport and legitimately can't scroll — test the first one that overflows
                const count = await vp.gameScrollers.count();
                let tested = false;
                for (let i = 0; i < count; i++) {
                    const section = vp.gameScrollers.nth(i);
                    const overflows = await section.evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth).catch(() => false);
                    if (!overflows) continue;
                    await section.scrollIntoViewIfNeeded();
                    const before = await section.evaluate((el: HTMLElement) => el.scrollLeft);
                    await section.evaluate((el: HTMLElement) => { el.scrollLeft += 300; });
                    await expect.poll(() => section.evaluate((el: HTMLElement) => el.scrollLeft), { timeout: 5000 }).toBeGreaterThan(before);
                    tested = true;
                    break;
                }
                if (!tested) {
                    // nothing overflows — every section's games fit on screen; cards must still render
                    expect(await vp.gameCards.count()).toBeGreaterThan(0);
                }
                await ScreenshotHelper(page, screenshotDir, `${id('013')}-tileScroll`, testInfo);
            });

        });

        // ── Logged in ────────────────────────────────────────────────────────

        test.describe('Logged In', () => {

            test.beforeEach(async ({ page, headerPage, testData }: VerticalPagesFixtures) => {
                await page.goto('/', { waitUntil: 'domcontentloaded' });
                await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
                await vertical(page).goto();
            });

            test(`${id('002')} - Verify horizontal scrollability of banners`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                await expect(vp.bannerCarousel.first()).toBeVisible({ timeout: 15000 });
                const nextBtnCount = await vp.bannerNextButton.count();
                if (nextBtnCount === 0) {
                    // single-banner vertical: nothing to scroll — the one banner must render correctly
                    const dots = await vp.bannerPagination.count();
                    expect(dots, 'no banner navigation, so there must be at most one slide').toBeLessThanOrEqual(1);
                    await expect(vp.bannerActiveSlide.first()).toBeVisible({ timeout: 10000 });
                } else {
                    const activeIndex = () => vp.bannerPagination.evaluateAll(
                        (btns: Element[]) => btns.findIndex(b => b.classList.contains('carousel__pagination-button--active')));
                    const before = await activeIndex();
                    await vp.bannerNextButton.first().click();
                    await expect.poll(activeIndex, { timeout: 5000 }).not.toBe(before);
                }
                await ScreenshotHelper(page, screenshotDir, `${id('002')}-bannerScroll`, testInfo);
            });

            // NOTE: vertical pages have no provider carousel or "Show All" link (Excel assumed one);
            // providers live behind the Providers category chip → <path>/providers.

            test(`${id('008')} - Verify Providers category chip navigates to the provider listing`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                await expect(vp.providersChip.first()).toBeVisible({ timeout: 15000 });
                await vp.providersChip.first().click();
                await expect(page).toHaveURL(pathRe('/providers'), { timeout: 15000 });
                await ScreenshotHelper(page, screenshotDir, `${id('008')}-providersChip`, testInfo);
            });

            test(`${id('009')} - Verify the provider listing page loads with provider tiles`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                await vp.gotoProviders();
                await expect(vp.providerCards.first()).toBeVisible({ timeout: 20000 });
                await ScreenshotHelper(page, screenshotDir, `${id('009')}-providerListing`, testInfo);
            });

            test(`${id('010')} - Verify all available providers are displayed`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                await vp.gotoProviders();
                await expect(vp.providerCards.first()).toBeVisible({ timeout: 20000 });
                expect(await vp.providerCards.count()).toBeGreaterThan(0);
                // provider logos must have actually loaded
                await expect.poll(() => vp.providerCards.first().locator('img').evaluate((el: any) => el.naturalWidth), { timeout: 10000 }).toBeGreaterThan(0);
                await ScreenshotHelper(page, screenshotDir, `${id('010')}-providersDisplayed`, testInfo);
            });

            test(`${id('011')} - Verify provider-specific listing opens correctly`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                await vp.gotoProviders();
                const firstProvider = vp.providerCards.first();
                await expect(firstProvider).toBeVisible({ timeout: 20000 });
                const href = ((await firstProvider.getAttribute('href')) || '').split('?')[0];
                await firstProvider.click();
                // must land on THAT provider's listing, not just any page
                await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
                await expect(vp.gameCards.first()).toBeVisible({ timeout: 20000 });
                await ScreenshotHelper(page, screenshotDir, `${id('011')}-providerSpecific`, testInfo);
            });

            test(`${id('012')} - Verify user is able to launch game from provider listing`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                await vp.gotoProviders();
                await vp.providerCards.first().click();
                await expect(vp.gameCards.first()).toBeVisible({ timeout: 20000 });
                const game = vp.gameCards.first();
                const href = ((await game.getAttribute('href')) || '').split('?')[0];
                await game.click();
                // a bounce to ?accountRestricted=1 means the TEST ACCOUNT cannot play this product
                // ("Limited Access" — not fully verified; confirmed NOT a site bug). Skip with cause.
                const bounced = await page.waitForURL(/accountRestricted=1/, { timeout: 5000 }).then(() => true).catch(() => false);
                test.skip(bounced, `test account is restricted from ${v.name} games — needs a fully verified account`);
                await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
                await expect(vp.gameFrame).toBeVisible({ timeout: 30000 });
                await ScreenshotHelper(page, screenshotDir, `${id('012')}-providerGameLaunch`, testInfo);
            });

            test(`${id('014')} - Verify navigation from All Games link`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                // Crash Games renders no per-section All Games links (confirmed live) — nothing to test there
                test.skip(!v.hasAllGamesLinks, `${v.name} has no All Games links by design`);
                const vp = vertical(page);
                const allGames = vp.allGamesLinks.first();
                await allGames.scrollIntoViewIfNeeded();
                await expect(allGames).toBeVisible({ timeout: 15000 });
                const href = ((await allGames.getAttribute('href')) || '').split('?')[0];
                // links must stay under this vertical. Quirky hrefs like "/spingames/." normalize to the All page.
                expect(href, `All Games link leaves the vertical: "${href}"`).toMatch(pathRe('(/|$)'));
                await allGames.click();
                await expect(page).toHaveURL(pathRe('(/|$|\\?)'), { timeout: 15000 });
                await expect(vp.gameCards.first()).toBeVisible({ timeout: 20000 });
                await ScreenshotHelper(page, screenshotDir, `${id('014')}-allGames`, testInfo);
            });

            test(`${id('015')} - Verify user is able to launch game from category list`, async ({ page, screenshotDir }: VerticalPagesFixtures, testInfo: TestInfo) => {
                const vp = vertical(page);
                const game = vp.gameCards.first();
                await expect(game).toBeVisible({ timeout: 20000 });
                // game cards on verticals link to vertical-scoped paths, e.g. /spingames/featured/<slug>
                const href = ((await game.getAttribute('href')) || '').split('?')[0];
                expect(href.split('/').filter(Boolean).length).toBeGreaterThanOrEqual(2);
                await game.click();
                const bounced = await page.waitForURL(/accountRestricted=1/, { timeout: 5000 }).then(() => true).catch(() => false);
                test.skip(bounced, `test account is restricted from ${v.name} games — needs a fully verified account`);
                await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
                await expect(vp.gameFrame).toBeVisible({ timeout: 30000 });
                await ScreenshotHelper(page, screenshotDir, `${id('015')}-categoryGameLaunch`, testInfo);
            });

        });

    });
}
