import { TestInfo, expect } from '@playwright/test';
import { test } from '../../../fixtures/jackpotCityFixture';
import { ScreenshotHelper } from '../../../../../common/actions/ScreenshotHelper';

/**
 * GH Home page suite — GH's home is a content/SEO landing page, structurally different from ZA's
 * carousel home (which is why the shared homePageNewSuite does not apply here). This suite verifies
 * GH's real sections: Welcome hero, category nav scroller, themed sections (Aviator / Slots / Crash /
 * Live Dealer / Table Games), Providers strip, Promotions teaser and footer. All element access is
 * behind the MwHomePage page object (no raw selectors in this spec).
 */
test.describe('MW Home Page - Logged Out', () => {

    test.beforeEach(async ({ mwHomePage }) => {
        await mwHomePage.open();
        await mwHomePage.revealAllSections();
    });

    test('MW-HP-LO-001 - Home page loads with the Welcome hero heading', async ({ page, mwHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(page).toHaveURL(/jackpotcitycasino\.mw/, { timeout: 10000 });
        await expect(mwHomePage.welcomeHeading).toBeVisible({ timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'MW-HP-LO-001-welcome', testInfo);
    });

    test('MW-HP-LO-002 - "Best of the Best" hero section heading is displayed', async ({ page, mwHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(mwHomePage.bestOfHeading).toBeVisible({ timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'MW-HP-LO-002-bestOf', testInfo);
    });

    test('MW-HP-LO-003 - Category nav scroller shows all game categories', async ({ page, mwHomePage, screenshotDir }, testInfo: TestInfo) => {
        // GH surfaces categories as a horizontal nav scroller (links carry ?land=true&p=N).
        const count = await mwHomePage.categoryNavLinks.count();
        expect(count).toBeGreaterThanOrEqual(5);
        await expect(mwHomePage.categoryNavLinks.first()).toBeVisible({ timeout: 10000 });
        await ScreenshotHelper(page, screenshotDir, 'MW-HP-LO-003-categoryNav', testInfo);
    });

    test('MW-HP-LO-004 - Aviator section CTA opens the Aviator game', async ({ page, mwHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(mwHomePage.aviatorHeading).toBeVisible({ timeout: 15000 });
        await mwHomePage.aviatorCta.click();
        await expect(page).toHaveURL(/\/home\/featured\/aviator/, { timeout: 15000 });
        await expect(mwHomePage.playNowButton).toBeVisible({ timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'MW-HP-LO-004-aviator', testInfo);
    });

    test('MW-HP-LO-005 - Slots section CTA navigates to the Slot Games vertical', async ({ page, mwHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(mwHomePage.slotsHeading).toBeVisible({ timeout: 15000 });
        await mwHomePage.slotsCta.click();
        await expect(page).toHaveURL(/\/spingames/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'MW-HP-LO-005-slots', testInfo);
    });

    test('MW-HP-LO-006 - Crash featured game tiles are displayed and open a game', async ({ page, mwHomePage, screenshotDir }, testInfo: TestInfo) => {
        const count = await mwHomePage.crashFeaturedCards.count();
        expect(count).toBeGreaterThanOrEqual(1);
        await mwHomePage.crashFeaturedCards.first().click();
        await expect(page).toHaveURL(/\/crashgames\/featured\//, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'MW-HP-LO-006-crashFeatured', testInfo);
    });

    test('MW-HP-LO-007 - Live Dealer section links navigate to live game tables', async ({ page, mwHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(mwHomePage.liveDealerHeading).toBeVisible({ timeout: 15000 });
        await mwHomePage.link('/livegames/blackjack').click();
        await expect(page).toHaveURL(/\/livegames\/blackjack/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'MW-HP-LO-007-liveDealer', testInfo);
    });

    test('MW-HP-LO-008 - Table Games section CTA navigates to live games', async ({ page, mwHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(mwHomePage.tableGamesHeading).toBeVisible({ timeout: 15000 });
        await mwHomePage.tableGamesCta.click();
        await expect(page).toHaveURL(/\/livegames/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'MW-HP-LO-008-tableGames', testInfo);
    });

    test('MW-HP-LO-009 - Providers strip shows providers and opens a provider listing', async ({ page, mwHomePage, screenshotDir }, testInfo: TestInfo) => {
        const count = await mwHomePage.providerCards.count();
        expect(count).toBeGreaterThanOrEqual(1);
        const firstHref = await mwHomePage.providerCards.first().getAttribute('href');
        await mwHomePage.providerCards.first().click();
        await expect(page).toHaveURL(new RegExp((firstHref || '/quickgames/providers/').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'MW-HP-LO-009-providers', testInfo);
    });

    test('MW-HP-LO-010 - Promotions section CTA navigates to the Promotions page', async ({ page, mwHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(mwHomePage.promotionsHeading).toBeVisible({ timeout: 15000 });
        await mwHomePage.promotionsCta.click();
        // GH's promotions page has no h1/h2, so the URL change is the navigation signal here.
        await expect(page).toHaveURL(/\/promotions/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'MW-HP-LO-010-promotions', testInfo);
    });

    // ── footer quick links ─────────────────────────────────────────────────────
    const footerCases: { id: string; label: string; getter: 'footerResponsibleGambling' | 'footerFaq' | 'footerPrivacy' | 'footerContactUs' | 'footerTerms' | 'footerHowTo'; url: RegExp }[] = [
        { id: 'MW-HP-LO-011', label: 'Responsible Gambling', getter: 'footerResponsibleGambling', url: /\/responsible-gambling/ },
        { id: 'MW-HP-LO-012', label: 'FAQ', getter: 'footerFaq', url: /\/faq/ },
        { id: 'MW-HP-LO-013', label: 'Privacy Policy', getter: 'footerPrivacy', url: /\/privacy-policy/ },
        { id: 'MW-HP-LO-014', label: 'Contact Us', getter: 'footerContactUs', url: /\/contact-us/ },
        { id: 'MW-HP-LO-015', label: 'Terms & Conditions', getter: 'footerTerms', url: /\/terms-and-conditions/ },
        { id: 'MW-HP-LO-016', label: 'How To', getter: 'footerHowTo', url: /\/how-to/ },
    ];
    for (const fc of footerCases) {
        test(`${fc.id} - Footer ${fc.label} link navigates correctly`, async ({ page, mwHomePage, screenshotDir }, testInfo: TestInfo) => {
            const linkEl = mwHomePage[fc.getter];
            await linkEl.scrollIntoViewIfNeeded();
            await expect(linkEl).toBeVisible({ timeout: 15000 });
            await linkEl.click();
            await expect(page).toHaveURL(fc.url, { timeout: 15000 });
            await expect(mwHomePage.pageHeading).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, `${fc.id}-footer`, testInfo);
        });
    }

    test('MW-HP-LO-017 - Social links point at the casino social profiles', async ({ page, mwHomePage, screenshotDir }, testInfo: TestInfo) => {
        // MW-specific handles unconfirmed; assert the links resolve to the right platforms.
        await expect(mwHomePage.socialInstagram).toHaveAttribute('href', /instagram\.com/i, { timeout: 10000 });
        await expect(mwHomePage.socialFacebook).toHaveAttribute('href', /facebook\.com/i, { timeout: 10000 });
        await expect(mwHomePage.socialX).toHaveAttribute('href', /(x|twitter)\.com/i, { timeout: 10000 });
        await ScreenshotHelper(page, screenshotDir, 'MW-HP-LO-017-social', testInfo);
    });
});
