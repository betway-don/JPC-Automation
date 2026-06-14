import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../../common/pages/BasePage';
import { SafeActions } from '../../../common/actions/SafeActions';

/**
 * GH-specific Home page object. GH's home is a content/SEO landing page (Welcome hero, a category
 * nav scroller, themed sections — Aviator / Slots / Crash / Live Dealer / Table Games — a Providers
 * strip, a Promotions teaser and a footer), NOT the ZA carousel home. Selectors live here so the
 * GH home spec stays selector-free.
 */
export class MwHomePage extends BasePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }

    async open(): Promise<void> {
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    }

    /**
     * GH home lazy-loads its lower sections (category scroller, themed game strips, providers,
     * promotions) as the user scrolls. Scroll through the page once to render them, then return
     * to the top so above-the-fold assertions are unaffected.
     */
    async revealAllSections(): Promise<void> {
        await this.page.waitForTimeout(2000);
        await this.page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 600) {
                window.scrollTo(0, y);
                await new Promise(r => setTimeout(r, 150));
            }
            window.scrollTo(0, 0);
        });
        await this.page.waitForTimeout(1000);
    }

    /** First visible anchor pointing at an exact href. */
    link(href: string): Locator {
        return this.page.locator(`a[href="${href}"]`).first();
    }

    // ── section headings ──────────────────────────────────────────────────────
    get welcomeHeading(): Locator { return this.page.getByRole('heading', { name: /welcome to jackpot city/i }); }
    get bestOfHeading(): Locator { return this.page.getByRole('heading', { name: /best of the best/i }); }
    get aviatorHeading(): Locator { return this.page.getByRole('heading', { name: /^aviator$/i }).first(); }
    get slotsHeading(): Locator { return this.page.getByRole('heading', { name: /^slots$/i }).first(); }
    get liveDealerHeading(): Locator { return this.page.getByRole('heading', { name: /live dealer/i }).first(); }
    get tableGamesHeading(): Locator { return this.page.getByRole('heading', { name: /table games/i }).first(); }
    get promotionsHeading(): Locator { return this.page.getByRole('heading', { name: /promotions/i }).first(); }

    // ── category nav scroller (links carry ?land=true&p=N) ─────────────────────
    get categoryNavLinks(): Locator { return this.page.locator('a[href*="land=true"]'); }

    // ── themed section collections / CTAs ──────────────────────────────────────
    get crashFeaturedCards(): Locator { return this.page.locator('a[href^="/crashgames/featured/"]'); }
    get providerCards(): Locator { return this.page.locator('a[href^="/quickgames/providers/"]'); }
    get liveDealerLinks(): Locator { return this.page.locator('a[href^="/livegames/"]'); }
    get aviatorCta(): Locator { return this.link('/home/featured/aviator'); }
    get slotsCta(): Locator { return this.link('/spingames'); }
    get tableGamesCta(): Locator { return this.link('/livegames'); }
    get promotionsCta(): Locator { return this.link('/promotions'); }

    // ── footer quick links ──────────────────────────────────────────────────────
    get footerResponsibleGambling(): Locator { return this.link('/responsible-gambling'); }
    get footerFaq(): Locator { return this.link('/faq'); }
    get footerPrivacy(): Locator { return this.link('/privacy-policy'); }
    get footerContactUs(): Locator { return this.link('/contact-us'); }
    get footerTerms(): Locator { return this.link('/terms-and-conditions'); }
    get footerHowTo(): Locator { return this.link('/how-to'); }

    // ── social links (open externally — assert href, don't navigate) ───────────
    get socialInstagram(): Locator { return this.page.locator('a[href*="instagram.com"]').first(); }
    get socialFacebook(): Locator { return this.page.locator('a[href*="facebook.com"]').first(); }
    get socialX(): Locator { return this.page.locator('a[href*="x.com"], a[href*="twitter.com"]').first(); }
}
