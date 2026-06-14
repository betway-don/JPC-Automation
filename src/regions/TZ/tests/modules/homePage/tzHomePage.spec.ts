import { TestInfo, expect } from '@playwright/test';
import { test } from '../../../fixtures/jackpotCityFixture';
import { ScreenshotHelper } from '../../../../../common/actions/ScreenshotHelper';

/**
 * TZ Home page suite. The TZ home (en.jackpotcitycasino.co.tz) is a content/SEO landing
 * page — no game tiles, no providers strip. Each themed section (Aviator, Slots, Crash,
 * Quick Games, Betgames, Live Dealer, Table Games, Promotions) is a copy block under a
 * heading with a CTA link to its vertical. This suite verifies the real TZ sections,
 * footer, TZ-specific nav (Low Data, Sitemap) and TZ social handles. All element access
 * is behind the TzHomePage page object (no raw selectors here).
 */
test.describe('TZ Home Page - Logged Out', () => {

    test.beforeEach(async ({ tzHomePage }) => {
        await tzHomePage.open();
        await tzHomePage.revealAllSections();
    });

    test('TZ-HP-LO-001 - Home page loads with the Welcome hero heading', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(page).toHaveURL(/jackpotcitycasino\.co\.tz/, { timeout: 10000 });
        await expect(tzHomePage.welcomeHeading).toBeVisible({ timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-001-welcome', testInfo);
    });

    test('TZ-HP-LO-002 - "Why Choose Jackpot City" value section is displayed', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(tzHomePage.whyChooseHeading).toBeVisible({ timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-002-whyChoose', testInfo);
    });

    test('TZ-HP-LO-003 - Category nav scroller shows all game categories', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        const count = await tzHomePage.categoryNavLinks.count();
        expect(count).toBeGreaterThanOrEqual(5);
        await expect(tzHomePage.categoryNavLinks.first()).toBeVisible({ timeout: 10000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-003-categoryNav', testInfo);
    });

    test('TZ-HP-LO-004 - Aviator section CTA opens the Aviator game', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(tzHomePage.aviatorHeading).toBeVisible({ timeout: 15000 });
        await tzHomePage.aviatorCta.click();
        await expect(page).toHaveURL(/\/home\/featured\/aviator/, { timeout: 15000 });
        await expect(tzHomePage.playNowButton).toBeVisible({ timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-004-aviator', testInfo);
    });

    test('TZ-HP-LO-005 - Slots section CTA navigates to the Slot Games vertical', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(tzHomePage.slotsHeading).toBeVisible({ timeout: 15000 });
        await tzHomePage.slotsCta.click();
        await expect(page).toHaveURL(/\/spingames/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-005-slots', testInfo);
    });

    test('TZ-HP-LO-006 - Crash Games section CTA navigates to the Crash vertical', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(tzHomePage.crashHeading).toBeVisible({ timeout: 15000 });
        await tzHomePage.crashCta.click();
        await expect(page).toHaveURL(/\/crashgames/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-006-crash', testInfo);
    });

    test('TZ-HP-LO-007 - Live Dealer section links to a live table', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(tzHomePage.liveDealerHeading).toBeVisible({ timeout: 15000 });
        await tzHomePage.liveDealerTableLink.click();
        await expect(page).toHaveURL(/\/livegames\/blackjack/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-007-liveDealer', testInfo);
    });

    test('TZ-HP-LO-008 - Table Games section CTA navigates to live games', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(tzHomePage.tableGamesHeading).toBeVisible({ timeout: 15000 });
        await tzHomePage.tableGamesCta.click();
        await expect(page).toHaveURL(/\/livegames/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-008-tableGames', testInfo);
    });

    test('TZ-HP-LO-009 - Quick Games section CTA navigates to the Quick Games vertical', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(tzHomePage.quickGamesHeading).toBeVisible({ timeout: 15000 });
        await tzHomePage.quickGamesCta.click();
        await expect(page).toHaveURL(/\/quickgames/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-009-quickGames', testInfo);
    });

    test('TZ-HP-LO-010 - Promotions section CTA navigates to the Promotions page', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(tzHomePage.promotionsHeading).toBeVisible({ timeout: 15000 });
        await tzHomePage.promotionsCta.click();
        await expect(page).toHaveURL(/\/promotions/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-010-promotions', testInfo);
    });

    // ── footer quick links ─────────────────────────────────────────────────────
    const footerCases: { id: string; label: string; getter: 'footerResponsibleGambling' | 'footerFaq' | 'footerPrivacy' | 'footerContactUs' | 'footerTerms' | 'footerHowTo'; url: RegExp }[] = [
        { id: 'TZ-HP-LO-011', label: 'Responsible Gambling', getter: 'footerResponsibleGambling', url: /\/responsible-gambling/ },
        { id: 'TZ-HP-LO-012', label: 'FAQ', getter: 'footerFaq', url: /\/faq/ },
        { id: 'TZ-HP-LO-013', label: 'Privacy Policy', getter: 'footerPrivacy', url: /\/privacy-policy/ },
        { id: 'TZ-HP-LO-014', label: 'Contact Us', getter: 'footerContactUs', url: /\/contact-us/ },
        { id: 'TZ-HP-LO-015', label: 'Terms & Conditions', getter: 'footerTerms', url: /\/terms-and-conditions/ },
        { id: 'TZ-HP-LO-016', label: 'How To', getter: 'footerHowTo', url: /\/how-to/ },
    ];
    for (const fc of footerCases) {
        test(`${fc.id} - Footer ${fc.label} link navigates correctly`, async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
            const linkEl = tzHomePage[fc.getter];
            await linkEl.scrollIntoViewIfNeeded();
            await expect(linkEl).toBeVisible({ timeout: 15000 });
            await linkEl.click();
            await expect(page).toHaveURL(fc.url, { timeout: 15000 });
            await expect(tzHomePage.pageHeading).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, `${fc.id}-footer`, testInfo);
        });
    }

    test('TZ-HP-LO-017 - Social links point at the TZ casino profiles', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        // TZ-specific handles confirmed via live discovery.
        await expect(tzHomePage.socialInstagram).toHaveAttribute('href', /instagram\.com\/jackpotcitycasinotz/i, { timeout: 10000 });
        await expect(tzHomePage.socialFacebook).toHaveAttribute('href', /facebook\.com\/JackpotCityCasinoTanzania/i, { timeout: 10000 });
        await expect(tzHomePage.socialX).toHaveAttribute('href', /(x|twitter)\.com\/JPCCasinoTZ/i, { timeout: 10000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-017-social', testInfo);
    });

    // ── TZ-specific nav entries ─────────────────────────────────────────────────
    test('TZ-HP-LO-018 - Betgames section CTA navigates to the Betgames vertical', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        await expect(tzHomePage.betgamesHeading).toBeVisible({ timeout: 15000 });
        await tzHomePage.betgamesCta.click();
        await expect(page).toHaveURL(/\/betgames/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-018-betgames', testInfo);
    });

    test('TZ-HP-LO-019 - Low Data link navigates to the Low Data experience', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        await tzHomePage.lowDataLink.first().scrollIntoViewIfNeeded();
        await tzHomePage.lowDataLink.click();
        await expect(page).toHaveURL(/\/low-data/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-019-lowData', testInfo);
    });

    test('TZ-HP-LO-020 - Sitemap link navigates to the sitemap', async ({ page, tzHomePage, screenshotDir }, testInfo: TestInfo) => {
        await tzHomePage.sitemapLink.first().scrollIntoViewIfNeeded();
        await tzHomePage.sitemapLink.click();
        await expect(page).toHaveURL(/\/sitemap/, { timeout: 15000 });
        await ScreenshotHelper(page, screenshotDir, 'TZ-HP-LO-020-sitemap', testInfo);
    });
});
