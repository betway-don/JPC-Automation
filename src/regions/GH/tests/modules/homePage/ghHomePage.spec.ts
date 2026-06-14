import { TestInfo, expect } from '@playwright/test';
import { test } from '../../../fixtures/jackpotCityFixture';
import { ScreenshotHelper } from '../../../../../common/actions/ScreenshotHelper';

/**
 * GH Home page suite — GH's home is a content/SEO landing page, structurally different from ZA's
 * carousel home (which is why the shared homePageNewSuite does not apply here). This suite verifies
 * GH's real sections: Welcome hero, category nav scroller, themed sections (Aviator / Slots / Crash /
 * Live Dealer / Table Games), Providers strip, Promotions teaser and footer. All element access is
 * behind the GhHomePage page object (no raw selectors in this spec).
 */
test.describe('GH Home Page - Logged Out', () => {

    test.beforeEach(async ({ ghHomePage }) => {
        await ghHomePage.open();
        await ghHomePage.revealAllSections();
    });

    test('GH-HP-LO-001 - Home page loads with the Welcome hero heading', async ({ page, ghHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(page).toHaveURL(/jackpotcitycasino\.com\.gh\/?$/, { timeout: 10000 });
        await expect(ghHomePage.welcomeHeading).toBeVisible({ timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'GH-HP-LO-001-welcome', testInfo);
    });

    test('GH-HP-LO-002 - "Best of the Best" hero section heading is displayed', async ({ page, ghHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(ghHomePage.bestOfHeading).toBeVisible({ timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'GH-HP-LO-002-bestOf', testInfo);
    });

    test('GH-HP-LO-003 - Category nav scroller shows all game categories', async ({ page, ghHomePage, screenshotDir }, testInfo: TestInfo) => {
        // GH surfaces categories as a horizontal nav scroller (links carry ?land=true&p=N).
        const count = await ghHomePage.categoryNavLinks.count();
        expect(count).toBeGreaterThanOrEqual(5);
        await expect(ghHomePage.categoryNavLinks.first()).toBeVisible({ timeout: 10000 });
        await ScreenshotHelper(page, screenshotDir, 'GH-HP-LO-003-categoryNav', testInfo);
    });

    test('GH-HP-LO-004 - Aviator section CTA opens the Aviator game', async ({ page, ghHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(ghHomePage.aviatorHeading).toBeVisible({ timeout: 15000 });
        await ghHomePage.aviatorCta.click();
        await expect(page).toHaveURL(/\/home\/featured\/aviator/, { timeout: 15000 });
        await expect(ghHomePage.playNowButton).toBeVisible({ timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'GH-HP-LO-004-aviator', testInfo);
    });

    test('GH-HP-LO-005 - Slots section CTA navigates to the Slot Games vertical', async ({ page, ghHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(ghHomePage.slotsHeading).toBeVisible({ timeout: 15000 });
        await ghHomePage.slotsCta.click();
        await expect(page).toHaveURL(/\/spingames/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'GH-HP-LO-005-slots', testInfo);
    });

    test('GH-HP-LO-006 - Crash featured game tiles are displayed and open a game', async ({ page, ghHomePage, screenshotDir }, testInfo: TestInfo) => {
        const count = await ghHomePage.crashFeaturedCards.count();
        expect(count).toBeGreaterThanOrEqual(1);
        await ghHomePage.crashFeaturedCards.first().click();
        await expect(page).toHaveURL(/\/crashgames\/featured\//, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'GH-HP-LO-006-crashFeatured', testInfo);
    });

    test('GH-HP-LO-007 - Live Dealer section links navigate to live game tables', async ({ page, ghHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(ghHomePage.liveDealerHeading).toBeVisible({ timeout: 15000 });
        await ghHomePage.link('/livegames/blackjack').click();
        await expect(page).toHaveURL(/\/livegames\/blackjack/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'GH-HP-LO-007-liveDealer', testInfo);
    });

    test('GH-HP-LO-008 - Table Games section CTA navigates to live games', async ({ page, ghHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(ghHomePage.tableGamesHeading).toBeVisible({ timeout: 15000 });
        await ghHomePage.tableGamesCta.click();
        await expect(page).toHaveURL(/\/livegames/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'GH-HP-LO-008-tableGames', testInfo);
    });

    test('GH-HP-LO-009 - Providers strip shows providers and opens a provider listing', async ({ page, ghHomePage, screenshotDir }, testInfo: TestInfo) => {
        const count = await ghHomePage.providerCards.count();
        expect(count).toBeGreaterThanOrEqual(1);
        const firstHref = await ghHomePage.providerCards.first().getAttribute('href');
        await ghHomePage.providerCards.first().click();
        await expect(page).toHaveURL(new RegExp((firstHref || '/quickgames/providers/').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'GH-HP-LO-009-providers', testInfo);
    });

    test('GH-HP-LO-010 - Promotions section CTA navigates to the Promotions page', async ({ page, ghHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(ghHomePage.promotionsHeading).toBeVisible({ timeout: 15000 });
        await ghHomePage.promotionsCta.click();
        // GH's promotions page has no h1/h2, so the URL change is the navigation signal here.
        await expect(page).toHaveURL(/\/promotions/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'GH-HP-LO-010-promotions', testInfo);
    });

    // ── footer quick links ─────────────────────────────────────────────────────
    const footerCases: { id: string; label: string; getter: 'footerResponsibleGambling' | 'footerFaq' | 'footerPrivacy' | 'footerContactUs' | 'footerTerms' | 'footerHowTo'; url: RegExp }[] = [
        { id: 'GH-HP-LO-011', label: 'Responsible Gambling', getter: 'footerResponsibleGambling', url: /\/responsible-gambling/ },
        { id: 'GH-HP-LO-012', label: 'FAQ', getter: 'footerFaq', url: /\/faq/ },
        { id: 'GH-HP-LO-013', label: 'Privacy Policy', getter: 'footerPrivacy', url: /\/privacy-policy/ },
        { id: 'GH-HP-LO-014', label: 'Contact Us', getter: 'footerContactUs', url: /\/contact-us/ },
        { id: 'GH-HP-LO-015', label: 'Terms & Conditions', getter: 'footerTerms', url: /\/terms-and-conditions/ },
        { id: 'GH-HP-LO-016', label: 'How To', getter: 'footerHowTo', url: /\/how-to/ },
    ];
    for (const fc of footerCases) {
        test(`${fc.id} - Footer ${fc.label} link navigates correctly`, async ({ page, ghHomePage, screenshotDir }, testInfo: TestInfo) => {
            const linkEl = ghHomePage[fc.getter];
            await linkEl.scrollIntoViewIfNeeded();
            await expect(linkEl).toBeVisible({ timeout: 15000 });
            await linkEl.click();
            await expect(page).toHaveURL(fc.url, { timeout: 15000 });
            await expect(ghHomePage.pageHeading).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, `${fc.id}-footer`, testInfo);
        });
    }

    test('GH-HP-LO-017 - Social links point at the correct GH casino profiles', async ({ page, ghHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(ghHomePage.socialInstagram).toHaveAttribute('href', /instagram\.com\/jackpotcitycasinoghana/i, { timeout: 10000 });
        await expect(ghHomePage.socialFacebook).toHaveAttribute('href', /facebook\.com\/JackpotCityCasinoGhana/i, { timeout: 10000 });
        await expect(ghHomePage.socialX).toHaveAttribute('href', /(x|twitter)\.com\/JackPotCity_gh/i, { timeout: 10000 });
        await ScreenshotHelper(page, screenshotDir, 'GH-HP-LO-017-social', testInfo);
    });
});
