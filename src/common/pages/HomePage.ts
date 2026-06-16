import { Page, Locator, expect } from '@playwright/test';
import { SafeActions } from '../actions/SafeActions';
import { BasePage } from './BasePage';
import { css, first } from '../locators/sel';

export class HomePage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        this.locators = this.build('homePage', {
            bannerCarousel: first(css("section.carousel.is-ltr.is-effect-fade")),
            bannerActiveSlide: first(css("section.carousel.is-ltr li.carousel__slide--active")),
            bannerImage: first(css("section.carousel.is-ltr li.carousel__slide--active img[alt='Standard Banner']")),
            bannerNextBtn: first(css("div.banner-navigation.next")),
            bannerPrevBtn: first(css("div.banner-navigation.prev")),
            bannerActivePagination: first(css("button.carousel__pagination-button--active")),
            trendingSection: first(css("div#featured-carousel")),
            trendingGameCard: first(css("#featured-carousel a.game-card")),
            trendingGameImg: first(css("#featured-carousel a.game-card img")),
            trendingFavBtn: first(css("#featured-carousel div[aria-label^='favorite-game']")),
            trendingFavActiveBtn: first(css("#featured-carousel div[aria-label^='favorite-game']:has(svg.primary-pink-gradient-text)")),
            bigWinnersMarquee: first(css(".marquee__content[aria-hidden='false']")),
            bigWinnersItem: first(css(".marquee__content[aria-hidden='false'] a")),
            bigWinnersGameTitle: first(css(".marquee__content[aria-hidden='false'] a span.truncate-text")),
            bigWinnersAmount: first(css(".marquee__content[aria-hidden='false'] a span.text-primary-gold-600")),
            bigWinnersMaskedUser: first(css(".marquee__content[aria-hidden='false'] a span.font-bold:not(.text-primary-gold-600)")),
            gameSection: first(css("div.scroller-casino:not(#featured-carousel)")),
            gameSectionCard: first(css("div.scroller-casino:not(#featured-carousel) a.game-card")),
            gameSectionImg: first(css("div.scroller-casino:not(#featured-carousel) a.game-card img")),
            gameSectionAllLink: first(css("a[href='/spingames']:has(button[aria-label='All Games'])")),
            favouritesSection: first(css("#favourites-carousel")),
            favouritesGameCard: first(css("#favourites-carousel a.game-card")),
            favouritesFavActiveBtn: first(css("#favourites-carousel div[aria-label^='favorite-game']:has(svg.primary-pink-gradient-text)")),
            recentlyPlayedSection: first(css("#recently-played-carousel")),
            recentlyPlayedCard: first(css("#recently-played-carousel a.game-card")),
            loginPromptModal: first(css("div.login-container")),
            signUpModal: first(css("[role='dialog'][aria-labelledby='Sign Up-modal-title']")),
            providersSection: first(css("#home-providers-carousel")),
            providerTile: first(css("#home-providers-carousel a.provider-card")),
            providerImg: first(css("#home-providers-carousel a.provider-card img.provider-image")),
            providersShowAllLink: first(css("a[href='/home/providers']")),
            providerDetailBreadcrumbProviders: first(css("a.underline.cursor-pointer[href='/home/providers']")),
            specialOffersSection: first(css("#specialoffers-carousel")),
            promoCard: first(css("#specialoffers-carousel a[href^='/promotions/']")),
            promoCardTitle: first(css("#specialoffers-carousel .text-base.font-bold.line-clamp-1")),
            promoCardImg: first(css("#specialoffers-carousel div.overflow-hidden img")),
            specialOffersShowAllLink: first(css("a[href='/promotions']:has(button)")),
            stackpotBanner: first(css("div.rounded-xl:has(button:has(img[alt*='more_info']))")),
            stackpotJackpotMeter: first(css("a[href='/spingames?progressive=true']:has(span.text-primary-pink-1300)")),
            stackpotPlayNowBtn: first(css("a[href='/spingames?progressive=true']:has(img[alt*='play_now'])")),
            stackpotMoreInfoBtn: first(css("button:has(img[alt*='more_info'])")),
            stackpotModal: first(css("[role='dialog'][aria-labelledby='STACKPOT JACKPOT-modal-title']")),
            stackpotModalTitle: first(css("[id='STACKPOT JACKPOT-modal-title']")),
            stackpotModalDescription: first(css("[role='dialog'] div.h-full div.p-4 > .text-base-priority")),
            stackpotModalCloseBtn: first(css("[role='dialog'] div.bg-base > button")),
            stackpotModalPlayNowBtn: first(css("[role='dialog'] div.bg-base a[href='/spingames?progressive=true'] button")),
            heroSection: first(css("div.hero-section")),
            heroShowAllBtn: first(css("button.design-system-button.rounded-xl.p-2:not([aria-label]):not([disabled])")),
            footerResponsibleGambling: first(css("a[href='/responsible-gambling'].footer-nav")),
            footerFaq: first(css("a[href='/faq'].footer-nav")),
            footerGetTheApp: first(css("a[href='/get-the-app'].footer-nav")),
            footerPrivacyPolicy: first(css("a[href='/privacy-policy'].footer-nav")),
            footerContactUs: first(css("a[href='/contact-us'].footer-nav")),
            footerTermsConditions: first(css("a[href='/terms-and-conditions'].footer-nav")),
            footerAboutUs: first(css("a[href='/about-us'].footer-nav")),
            footerPaiaManual: first(css("a[href='/paia-manual'].footer-nav")),
            footerHowTo: first(css("a[href='/how-to'].footer-nav")),
            footerAppDownloadLink: first(css("a[href*='JackpotCityAppDownload']")),
            footerAppleBtn: first(css("button:has(img[alt='Jackpotcity Apple App'])")),
            footerAndroidBtn: first(css("button:has(img[alt='Jackpotcity Android App'])")),
            footerHuaweiBtn: first(css("button:has(img[alt='Jackpotcity Huawei App'])")),
            footerInstagramLink: first(css("a[href*='instagram.com']:has(button[aria-label='instagram'])")),
            footerFacebookLink: first(css("a[href*='facebook.com']:has(button[aria-label='Facebook:'])")),
            footerTwitterLink: first(css("a[href*='x.com']:has(button[aria-label='Twitter:'])")),
            footerVisaIcon: first(css("img[alt='visa']")),
            footerMastercardIcon: first(css("img[alt='master_card']")),
            footerZapperIcon: first(css("img[alt='zapper']")),
            footerOzowIcon: first(css("img[alt='ozow']")),
            footerApplePayIcon: first(css("img[alt='apple_pay']")),
        });
    }

    // ─── element accessors (selectors stay inside the Page Object) ─────────────
    get providerCards(): Locator { return this.page.locator('a.provider-card'); }
    get homeProviderCards(): Locator { return this.page.locator('#home-providers-carousel a.provider-card'); }
    get gameCards(): Locator { return this.page.locator('a.game-card'); }
    get spingamesAllButton(): Locator { return this.page.locator('a[href="/spingames"] button#all'); }
    get recentlyPlayedFirstCard(): Locator { return this.page.locator('#recently-played-carousel a.game-card').first(); }
    get featuredFavourites(): Locator { return this.page.locator('#featured-carousel div[aria-label^="favorite-game"]'); }
    get featuredActiveFavourites(): Locator { return this.page.locator('#featured-carousel div[aria-label^="favorite-game"]:has(svg.primary-pink-gradient-text)'); }
    get backButton(): Locator { return this.page.locator('button[size="icon-lg"].aspect-square').first(); }
    // generic content-page elements (footer destinations)
    get genericPageHeading(): Locator { return this.page.locator('#generic-page-header h1'); }
    get providersBreadcrumbHeading(): Locator {
        // The breadcrumb bar is a bold container holding the "Home" link and the current page name.
        // (Targeting it specifically — the old generic `div.font-bold` first()-match grabbed a hidden element.)
        return this.page.locator('div.font-bold:has(a[href="/"])').filter({ hasText: 'Providers' });
    }
    get accordionContainer(): Locator { return this.page.locator('div.kentico-accordion-container'); }
    get accordionItems(): Locator { return this.page.locator('details[id^="accordion-item"]'); }
    get howToContentWrapper(): Locator { return this.page.locator('div.accordions-content-wrapper'); }
    get howToSections(): Locator { return this.page.locator('section.accordion-widget'); }
    get howToDetails(): Locator { return this.page.locator('section.accordion-widget details'); }
    get contactUsContainer(): Locator { return this.page.locator('div.jpc-contactUs-container'); }
    get contactSupportEmail(): Locator { return this.page.locator('a[href^="mailto:"]').first(); }
    get getAppHeading(): Locator { return this.page.locator('h1, h2').filter({ hasText: /download|get.*app/i }).first(); }
    get getAppAppleButton(): Locator { return this.page.locator('button:has(img[alt="Jackpotcity Apple App"])'); }
    get getAppAndroidButton(): Locator { return this.page.locator('button:has(img[alt="Jackpotcity Android App"])'); }
    appImage(alt: string): Locator { return this.page.locator(`img[alt="${alt}"]`); }

    async waitForPage() {
        await this.locators.bannerCarousel.waitFor({ state: 'visible', timeout: 15000 });
    }

    async clickBannerNext() {
        await this.locators.bannerNextBtn.click();
        await this.page.waitForTimeout(800);
    }

    async clickBannerPrev() {
        await this.locators.bannerPrevBtn.click();
        await this.page.waitForTimeout(800);
    }

    async getActivePaginationIndex(): Promise<number> {
        return this.page
            .locator('ol.carousel__pagination button.carousel__pagination-button')
            .evaluateAll((btns: Element[]) =>
                btns.findIndex(b => b.classList.contains('carousel__pagination-button--active'))
            );
    }

    async scrollSectionRight(sectionLocator: Locator, amount = 300) {
        await sectionLocator.evaluate((el: Element, px: number) => {
            (el as HTMLElement).scrollLeft += px;
        }, amount);
        await this.page.waitForTimeout(300);
    }

    async getSectionScrollLeft(sectionLocator: Locator): Promise<number> {
        return sectionLocator.evaluate((el: Element) => (el as HTMLElement).scrollLeft);
    }

    async highlightElement(key: string) {
        if (this.locators[key]) {
            await this.safeActions.safeHighlight(key, this.locators[key]);
        }
    }

    async highlightLocator(name: string, locator: Locator) {
        await this.safeActions.safeHighlight(name, locator);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  Intent API — every mechanic (waits, scroll math, DOM probes, new tabs) lives here.
    // ══════════════════════════════════════════════════════════════════════════
    private static readonly CURRENCY = /(R|GHS|GH₵|₵|MWK|TZS|TSh)\s*[\d,]+\.\d{2}/i;
    private static readonly CURRENCY_LOOSE = /(R|GHS|₵|TSh|MWK|TZS)\s*\d/i;

    async open(): Promise<void> { await this.goto('/'); }

    // ── banners ──────────────────────────────────────────────────────────────
    async expectBannerScrolls(): Promise<void> {
        await expect(this.locators.bannerCarousel).toBeVisible();
        const before = await this.getActivePaginationIndex();
        await this.clickBannerNext();
        expect(await this.getActivePaginationIndex()).not.toBe(before);
    }
    async expectBannerLoaded(): Promise<void> {
        await expect(this.locators.bannerCarousel).toBeVisible();
        await expect(this.locators.bannerActiveSlide).toBeVisible();
        await this.expectImageLoaded(this.locators.bannerImage);
    }
    /** Clicking a banner must DO something — navigate or surface a login/sign-up prompt. */
    async expectBannerActsLoggedOut(): Promise<void> {
        const before = this.page.url();
        await this.locators.bannerImage.click();
        await expect.poll(async () => {
            if (this.page.url() !== before) return 'navigated';
            if (await this.locators.loginPromptModal.isVisible().catch(() => false)) return 'login';
            if (await this.locators.signUpModal.isVisible().catch(() => false)) return 'signup';
            return '';
        }).not.toBe('');
    }
    async expectBannerActsLoggedIn(): Promise<void> {
        const before = this.page.url();
        await this.locators.bannerImage.click();
        await expect.poll(async () => {
            if (this.page.url() !== before) return 'navigated';
            if (await this.anyDialog.isVisible().catch(() => false)) return 'dialog';
            return '';
        }).not.toBe('');
    }

    // ── big winners ────────────────────────────────────────────────────────────
    async expectBigWinnersAutoScroll(): Promise<void> {
        await expect(this.locators.bigWinnersMarquee).toBeVisible();
        const transform = () => this.locators.bigWinnersMarquee.evaluate((el: Element) => getComputedStyle(el).transform);
        const before = await transform();
        await expect.poll(transform, { timeout: 8000 }).not.toBe(before);
    }
    async expectBigWinnerDetails(): Promise<void> {
        await expect(this.locators.bigWinnersItem).toBeVisible();
        await expect(this.locators.bigWinnersGameTitle).toBeVisible();
        expect((await this.locators.bigWinnersGameTitle.textContent())?.trim()).toBeTruthy();
        await expect(this.locators.bigWinnersAmount).toBeVisible();
        expect((await this.locators.bigWinnersAmount.textContent())?.trim()).toMatch(HomePage.CURRENCY);
        await expect(this.locators.bigWinnersMaskedUser).toBeVisible();
        expect((await this.locators.bigWinnersMaskedUser.textContent())?.trim()).toMatch(/^\*+\d+$/);
    }
    async expectBigWinnerOpensGameWithPlayNow(): Promise<void> {
        const href = await this.locators.bigWinnersItem.getAttribute('href');
        const path = (href || '').split('?')[0];
        expect(path).toContain('/home/');
        await this.locators.bigWinnersItem.click({ force: true });
        await this.expectAt(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        await expect(this.playNowButton).toBeVisible();
    }
    /**
     * The whole Big Winners entry is one anchor wrapping the image, the game title
     * (span.truncate-text), the amount and the masked user. Tapping the TITLE must
     * navigate to that same game's page (not a no-op), proving the title is a live
     * click target within the anchor.
     */
    async expectBigWinnerTitleRedirects(): Promise<void> {
        const href = await this.locators.bigWinnersItem.getAttribute('href');
        const path = (href || '').split('?')[0];
        expect(path).toContain('/home/');
        await this.locators.bigWinnersGameTitle.click({ force: true });
        await this.expectAt(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
    async expectBigWinnerLaunchesGame(): Promise<void> {
        const before = this.page.url();
        await this.locators.bigWinnersItem.click({ force: true });
        await this.page.waitForURL(/\/home\//);
        expect(this.page.url()).not.toBe(before);
        await expect(this.gameFrame).toBeVisible({ timeout: 30000 });
    }

    // ── favourites (logged in) ──────────────────────────────────────────────────
    /** Active state of the FIRST trending card's OWN heart — scoped to that card, not "any
     *  favourited card in the carousel" (the account may already have other favourites). */
    private firstFavIcon(): Locator { return this.locators.trendingFavBtn.locator('svg.primary-pink-gradient-text'); }
    /** Toggle the trending favourite and confirm it reached the wanted state. Vue can drop the first
     *  click while the carousel is still hydrating, so retry the click once before asserting. */
    private async setTrendingFavourite(on: boolean): Promise<void> {
        await expect(this.locators.trendingFavBtn).toBeVisible();
        await this.locators.trendingFavBtn.click();
        const reached = await this.firstFavIcon().first()
            .waitFor({ state: on ? 'visible' : 'detached', timeout: 5000 }).then(() => true).catch(() => false);
        if (!reached) await this.locators.trendingFavBtn.click();
        await expect(this.firstFavIcon()).toHaveCount(on ? 1 : 0);
    }
    private async normaliseTrendingUnfavourited(): Promise<void> {
        if (await this.firstFavIcon().count() > 0) await this.setTrendingFavourite(false);
    }
    async expectFavouritePromptsLogin(): Promise<void> {
        await expect(this.locators.trendingFavBtn).toBeVisible();
        await this.locators.trendingFavBtn.click();
        await expect(this.locators.loginPromptModal).toBeVisible();
    }
    async expectFavouritesSectionHidden(): Promise<void> { await expect(this.locators.favouritesSection).not.toBeVisible(); }
    async expectRecentlyPlayedSectionHidden(): Promise<void> { await expect(this.locators.recentlyPlayedSection).not.toBeVisible(); }
    async expectCanFavouriteTrending(): Promise<void> {
        await expect(this.locators.trendingSection).toBeVisible();
        await this.normaliseTrendingUnfavourited();
        await this.setTrendingFavourite(true);
        await this.setTrendingFavourite(false);                // cleanup
    }
    async expectCanFavouriteMultiple(): Promise<void> {
        await expect(this.locators.trendingSection).toBeVisible();
        const favs = this.featuredFavourites;
        expect(await favs.count()).toBeGreaterThan(1);
        for (const i of [0, 1]) {
            const active = favs.nth(i).locator('svg.primary-pink-gradient-text');
            if (await active.isVisible().catch(() => false)) { await favs.nth(i).click(); await expect(active).not.toBeVisible(); }
        }
        await favs.nth(0).click();
        await favs.nth(1).click();
        await expect(favs.nth(0).locator('svg.primary-pink-gradient-text')).toHaveCount(1);
        await expect(favs.nth(1).locator('svg.primary-pink-gradient-text')).toHaveCount(1);
        await favs.nth(0).click();                              // cleanup
        await favs.nth(1).click();
    }
    async expectFavouritePersistsAfterRefresh(): Promise<void> {
        await expect(this.locators.trendingSection).toBeVisible();
        await this.normaliseTrendingUnfavourited();
        await this.setTrendingFavourite(true);
        // The favourite is persisted by an async POST; let it land before reloading, otherwise the
        // refresh can race the write and the favourite appears not to have persisted.
        await this.page.waitForLoadState('networkidle').catch(() => { });
        await this.page.waitForTimeout(1500);
        await this.refresh();
        await expect(this.locators.trendingSection).toBeVisible();
        await expect(this.firstFavIcon()).toHaveCount(1);       // persisted across the refresh
        await this.setTrendingFavourite(false);                 // cleanup
    }

    // ── recently played ──────────────────────────────────────────────────────
    /** Launch the first trending game, then return to home; returns its title for ordering checks. */
    async playTrendingGameAndReturnHome(): Promise<string> {
        const title = await this.locators.trendingGameCard.getAttribute('aria-label');
        await this.locators.trendingGameCard.click();
        await this.page.waitForURL(/\/home\//);
        await this.goto('/');
        return title || '';
    }
    async expectRecentlyPlayedHasGame(): Promise<void> {
        await expect(this.locators.recentlyPlayedSection).toBeVisible();
        await expect(this.locators.recentlyPlayedCard).toBeVisible();
    }
    async expectRecentlyPlayedTopIs(title: string): Promise<void> {
        await expect(this.locators.recentlyPlayedSection).toBeVisible();
        await expect(this.recentlyPlayedFirstCard).toBeVisible();
        expect(await this.recentlyPlayedFirstCard.getAttribute('aria-label')).toBe(title);
    }
    async expectLaunchFromRecentlyPlayed(): Promise<void> {
        await expect(this.locators.recentlyPlayedCard).toBeVisible();
        const before = this.page.url();
        await this.locators.recentlyPlayedCard.click();
        await this.page.waitForURL(/\/home\//);
        expect(this.page.url()).not.toBe(before);
        await expect(this.gameFrame).toBeVisible({ timeout: 30000 });
    }

    // ── providers (home + page) ──────────────────────────────────────────────
    async expectProvidersSection(): Promise<void> {
        await this.locators.providersSection.scrollIntoViewIfNeeded().catch(() => { });
        await expect(this.locators.providersSection).toBeVisible();
        await expect(this.locators.providerTile).toBeVisible();
        await expect(this.locators.providerImg).toBeVisible();
        expect(await this.homeProviderCards.count()).toBeGreaterThan(0);
    }
    async expectProvidersScroll(): Promise<void> { await this.expectSectionScrolls(this.locators.providersSection); }
    async openProvidersShowAll(): Promise<void> {
        await this.locators.providersShowAllLink.click();
        await this.expectAt(/\/providers/);
    }
    async gotoProvidersPage(): Promise<void> { await this.goto('/home/providers'); await this.expectAt(/\/providers/); }
    async expectProvidersBreadcrumb(): Promise<void> {
        await expect(this.providersBreadcrumbHeading).toBeVisible();
        await expect(this.providersBreadcrumbHeading).toContainText('Providers');
    }
    async expectBackLeavesProviders(): Promise<void> {
        // Reach the Providers page directly — the home "Show All" providers link was removed from the site.
        await this.gotoProvidersPage();
        await expect(this.backButton).toBeVisible();
        await this.backButton.click();
        await expect(this.page).not.toHaveURL(/\/providers/);
    }
    async expectAllProviderTiles(): Promise<void> {
        await expect(this.providerCards.first()).toBeVisible();
        expect(await this.providerCards.count()).toBeGreaterThan(5);
    }
    async expectProviderTileAccessible(): Promise<void> {
        const tile = this.providerCards.first();
        await expect(tile).toBeVisible();
        expect(await tile.getAttribute('href')).toBeTruthy();
        expect((await tile.locator('img').getAttribute('alt'))?.trim()).toBeTruthy();
    }
    async openFirstProviderListing(): Promise<void> {
        const tile = this.providerCards.first();
        await expect(tile).toBeVisible();
        await tile.click();
        await this.expectAt(/\/providers\//);
    }
    async expectProviderBreadcrumbReturnsToList(): Promise<void> {
        await this.openFirstProviderListing();
        await expect(this.locators.providerDetailBreadcrumbProviders).toBeVisible();
        await this.locators.providerDetailBreadcrumbProviders.click();
        await this.expectAt(/\/home\/providers$/);
    }

    // ── special offers ────────────────────────────────────────────────────────
    async expectSpecialOffers(): Promise<void> {
        await expect(this.locators.specialOffersSection).toBeVisible();
        await expect(this.locators.promoCard).toBeVisible();
        await expect(this.locators.promoCardImg).toBeVisible();
    }
    async expectSpecialOffersScroll(): Promise<void> { await this.expectSectionScrolls(this.locators.specialOffersSection); }
    async openSpecialOffersShowAll(): Promise<void> { await this.locators.specialOffersShowAllLink.click(); await this.expectAt(/\/promotions/); }
    async openFirstPromoCard(): Promise<void> { await this.locators.promoCard.click(); await this.expectAt(/\/promotions\//); }

    // ── stackpot ────────────────────────────────────────────────────────────────
    async expectStackpotBanner(): Promise<void> {
        await expect(this.locators.stackpotBanner).toBeVisible();
        await expect(this.locators.stackpotJackpotMeter).toBeVisible();
        expect((await this.locators.stackpotJackpotMeter.textContent())?.trim()).toMatch(HomePage.CURRENCY_LOOSE);
        await expect(this.locators.stackpotPlayNowBtn).toBeVisible();
        await expect(this.locators.stackpotMoreInfoBtn).toBeVisible();
    }
    async expectStackpotPlayNowOpensSlots(): Promise<void> {
        await this.locators.stackpotPlayNowBtn.click();
        await this.expectAt(/\/spingames/);
        expect(this.page.url()).toContain('progressive=true');
        await expect(this.gameCards.first()).toBeVisible();
    }
    async expectStackpotMoreInfoModal(): Promise<void> {
        await this.locators.stackpotMoreInfoBtn.click();
        await expect(this.locators.stackpotModal).toBeVisible();
        await expect(this.locators.stackpotModalTitle).toBeVisible();
        expect((await this.locators.stackpotModalTitle.textContent())?.toLowerCase()).toContain('stackpot');
        expect((await this.locators.stackpotModalDescription.textContent())?.toLowerCase()).toContain('stackpot');
        await expect(this.locators.stackpotModalPlayNowBtn).toBeVisible();
        await this.locators.stackpotModalCloseBtn.click();
        await expect(this.locators.stackpotModal).not.toBeVisible();
    }

    // ── game sections ────────────────────────────────────────────────────────
    private async expectSectionScrolls(section: Locator): Promise<void> {
        await expect(section).toBeVisible();
        await section.scrollIntoViewIfNeeded();
        // Cards lazy-load: until the rail actually overflows, scrolling is a no-op. Wait for overflow.
        await expect.poll(
            async () => section.evaluate((el: Element) => (el as HTMLElement).scrollWidth - (el as HTMLElement).clientWidth),
            { timeout: 15000 }
        ).toBeGreaterThan(0);
        const before = await this.getSectionScrollLeft(section);
        // Reveal a later card rather than nudging scrollLeft by a fixed amount: these rails use
        // scroll-snap, so a raw scrollLeft delta can snap back to a card boundary. scrollIntoViewIfNeeded
        // moves the rail deterministically to bring a later card into view.
        const cards = section.locator(':scope > *');
        const idx = Math.min(Math.max(await cards.count() - 1, 0), 6);
        await cards.nth(idx).scrollIntoViewIfNeeded();
        await expect.poll(() => this.getSectionScrollLeft(section)).toBeGreaterThan(before);
    }
    async expectGameSectionScroll(): Promise<void> { await this.expectSectionScrolls(this.locators.gameSection); }
    async expectAllGamesLinkVisible(): Promise<void> { await expect(this.locators.gameSectionAllLink).toBeVisible(); }
    async openAllGamesLink(): Promise<void> {
        await this.locators.gameSectionAllLink.click();
        await this.expectAt(/\/spingames/);
        await expect(this.spingamesAllButton).toBeVisible();
        await expect(this.gameCards.first()).toBeVisible();
    }
    async openAllGamesLinkAny(): Promise<void> {
        const before = this.page.url();
        await this.locators.gameSectionAllLink.click();
        await expect.poll(() => this.page.url()).not.toBe(before);
    }
    async expectGameLaunchFromSectionWithPlayNow(): Promise<void> {
        const href = await this.locators.gameSectionCard.getAttribute('href');
        const path = (href || '').split('?')[0];
        expect(path).toContain('/home/');
        await this.locators.gameSectionCard.click();
        await this.expectAt(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        await expect(this.playNowButton).toBeVisible();
    }
    async expectGameLaunchFromSection(): Promise<void> {
        const before = this.page.url();
        await this.locators.gameSectionCard.click();
        await this.page.waitForURL(/\/home\//);
        expect(this.page.url()).not.toBe(before);
        await expect(this.gameFrame).toBeVisible({ timeout: 30000 });
    }
    async expectGameTileContent(): Promise<void> {
        await expect(this.locators.gameSectionCard).toBeVisible();
        await this.expectImageLoaded(this.locators.gameSectionImg);
        expect((await this.locators.gameSectionCard.getAttribute('aria-label'))?.trim()).toBeTruthy();
    }

    // ── footer ──────────────────────────────────────────────────────────────────
    async expectFooterShowAllToggles(): Promise<void> {
        await this.locators.heroSection.scrollIntoViewIfNeeded();
        await expect(this.locators.heroShowAllBtn).toBeVisible();
        await expect(this.locators.heroShowAllBtn).toHaveText('Show All');
        await this.locators.heroShowAllBtn.click();
        await expect(this.locators.heroShowAllBtn).toHaveText(/Show Less/i);
        await this.locators.heroShowAllBtn.click();
        await expect(this.locators.heroShowAllBtn).toHaveText(/Show All/i);
    }
    /** Open a footer nav link and confirm it lands on a content page with a heading. */
    async openFooterContentPage(linkKey: string, urlPattern: RegExp): Promise<void> {
        const link = this.locators[linkKey];
        await link.scrollIntoViewIfNeeded();
        await expect(link).toBeVisible();
        await link.click();
        await this.expectAt(urlPattern);
        await expect(this.genericPageHeading).toBeVisible();
        expect((await this.genericPageHeading.textContent())?.trim()).toBeTruthy();
    }
    async expectAccordionContent(): Promise<void> {
        await expect(this.accordionContainer).toBeVisible();
        await expect(this.accordionItems.first()).toBeVisible();
        expect(await this.accordionItems.count()).toBeGreaterThan(0);
    }
    async expectContactDetails(): Promise<void> {
        await expect(this.contactUsContainer).toBeVisible();
        await expect(this.contactSupportEmail).toBeVisible();
    }
    async openGetTheApp(): Promise<void> {
        await this.locators.footerGetTheApp.scrollIntoViewIfNeeded();
        await this.locators.footerGetTheApp.click();
        await this.expectAt(/\/get-the-app/);
    }
    async expectGetAppButtons(): Promise<void> {
        await expect(this.getAppHeading).toBeVisible();
        await expect(this.getAppAppleButton).toBeVisible();
        await expect(this.getAppAndroidButton).toBeVisible();
    }
    async expectHowToContent(): Promise<void> {
        await expect(this.howToContentWrapper).toBeVisible();
        await expect(this.howToSections.first()).toBeVisible();
        expect(await this.howToSections.count()).toBeGreaterThan(0);
        expect(await this.howToDetails.count()).toBeGreaterThan(0);
    }
    /** Click a trigger that opens a new tab; assert the tab's URL then close it. */
    async expectOpensTab(trigger: Locator, urlPattern: RegExp): Promise<void> {
        const [tab] = await Promise.all([this.page.context().waitForEvent('page'), trigger.click()]);
        await tab.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => { });
        await expect(tab).toHaveURL(urlPattern);
        await tab.close();
    }
    async expectAppleStoreOpensTab(): Promise<void> {
        await this.locators.footerAppleBtn.scrollIntoViewIfNeeded();
        await expect(this.locators.footerAppleBtn).toBeVisible();
        expect(await this.locators.footerAppDownloadLink.getAttribute('href')).toContain('JackpotCityAppDownload');
        await this.expectOpensTab(this.locators.footerAppleBtn, /jackpotcity|apple\.com/i);
    }
    async expectAppDownloadLink(storeButtonKey: string, imgAlt: string): Promise<void> {
        await this.locators[storeButtonKey].scrollIntoViewIfNeeded();
        await expect(this.locators[storeButtonKey]).toBeVisible();
        await expect(this.appImage(imgAlt)).toBeVisible();
        expect(await this.locators.footerAppDownloadLink.getAttribute('href')).toContain('JackpotCityAppDownload');
        expect(await this.locators.footerAppDownloadLink.getAttribute('rel')).toContain('noopener');
    }
    async expectSocialOpensTab(linkKey: string, urlPattern: RegExp): Promise<void> {
        const link = this.locators[linkKey];
        await link.scrollIntoViewIfNeeded();
        await expect(link).toBeVisible();
        await this.expectOpensTab(link, urlPattern);
    }
    async expectPaymentIcons(): Promise<void> {
        await this.locators.footerVisaIcon.scrollIntoViewIfNeeded();
        for (const k of ['footerVisaIcon', 'footerMastercardIcon', 'footerZapperIcon', 'footerOzowIcon', 'footerApplePayIcon']) {
            await expect(this.locators[k]).toBeVisible();
        }
    }
}
