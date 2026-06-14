import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../../common/pages/BasePage';
import { SafeActions } from '../../../common/actions/SafeActions';

/**
 * TZ-specific Home page object (en.jackpotcitycasino.co.tz).
 *
 * Discovered (2026-06-14) against the live TZ site: the TZ home is a pure content/SEO
 * landing page with NO game tiles (`a.game-card` count is 0). Each themed section is a
 * copy block under a heading with a single CTA link to that vertical — there are no
 * crash "featured" tiles and no providers strip (those are GH-isms that don't exist on
 * TZ). The category nav scroller (links carrying ?land=true&p=N) and a Promotions
 * teaser are present, and the footer carries the standard quick links. TZ also exposes
 * a "Low Data" nav entry and TZ-specific social handles. Selectors live here so the TZ
 * home spec stays selector-free.
 */
export class TzHomePage extends BasePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }

    async open(): Promise<void> {
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    }

    /** TZ home lazy-loads its lower content sections as the user scrolls. */
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

    /** First visible anchor whose href exactly equals the given path. */
    link(href: string): Locator {
        return this.page.locator(`a[href="${href}"]`).first();
    }
    /** First visible anchor whose href contains the given fragment (handles absolute URLs). */
    linkContaining(fragment: string): Locator {
        return this.page.locator(`a[href*="${fragment}"]`).first();
    }

    // ── section headings (real TZ copy) ─────────────────────────────────────────
    get welcomeHeading(): Locator { return this.page.getByRole('heading', { name: /welcome to jackpot city/i }); }
    get whyChooseHeading(): Locator { return this.page.getByRole('heading', { name: /why choose jackpot city/i }); }
    get exploreGamesHeading(): Locator { return this.page.getByRole('heading', { name: /explore the games/i }); }
    get aviatorHeading(): Locator { return this.page.getByRole('heading', { name: /aviator/i }).first(); }
    get slotsHeading(): Locator { return this.page.getByRole('heading', { name: /slot games/i }).first(); }
    get tableGamesHeading(): Locator { return this.page.getByRole('heading', { name: /table games/i }).first(); }
    get liveDealerHeading(): Locator { return this.page.getByRole('heading', { name: /live dealer/i }).first(); }
    get crashHeading(): Locator { return this.page.getByRole('heading', { name: /crash games/i }).first(); }
    get quickGamesHeading(): Locator { return this.page.getByRole('heading', { name: /quick games/i }).first(); }
    get betgamesHeading(): Locator { return this.page.getByRole('heading', { name: /betgames/i }).first(); }
    get promotionsHeading(): Locator { return this.page.getByRole('heading', { name: /promotions/i }).first(); }
    get responsibleHeading(): Locator { return this.page.getByRole('heading', { name: /responsible betting/i }).first(); }

    // ── category nav scroller (links carry ?land=true&p=N) ─────────────────────
    get categoryNavLinks(): Locator { return this.page.locator('a[href*="land=true"]'); }

    // ── section CTAs (each section links to its vertical) ───────────────────────
    get aviatorCta(): Locator { return this.link('/home/featured/aviator'); }
    get slotsCta(): Locator { return this.link('/spingames'); }
    get crashCta(): Locator { return this.link('/crashgames'); }
    get quickGamesCta(): Locator { return this.link('/quickgames'); }
    get betgamesCta(): Locator { return this.link('/betgames'); }
    get tableGamesCta(): Locator { return this.link('/livegames'); }
    get liveDealerTableLink(): Locator { return this.linkContaining('/livegames/blackjack'); }
    get promotionsCta(): Locator { return this.link('/promotions'); }

    // ── TZ-specific nav entries ─────────────────────────────────────────────────
    get lowDataLink(): Locator { return this.linkContaining('/low-data'); }
    get sitemapLink(): Locator { return this.linkContaining('/sitemap'); }

    // ── footer quick links ──────────────────────────────────────────────────────
    get footerResponsibleGambling(): Locator { return this.link('/responsible-gambling'); }
    get footerFaq(): Locator { return this.link('/faq'); }
    get footerPrivacy(): Locator { return this.link('/privacy-policy'); }
    get footerContactUs(): Locator { return this.link('/contact-us'); }
    get footerTerms(): Locator { return this.link('/terms-and-conditions'); }
    get footerHowTo(): Locator { return this.link('/how-to'); }

    // ── social links (TZ-specific handles; open externally — assert href) ───────
    get socialInstagram(): Locator { return this.page.locator('a[href*="instagram.com"]').first(); }
    get socialFacebook(): Locator { return this.page.locator('a[href*="facebook.com"]').first(); }
    get socialX(): Locator { return this.page.locator('a[href*="x.com"], a[href*="twitter.com"]').first(); }
}
