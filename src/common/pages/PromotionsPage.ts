import { Page, Locator, expect } from '@playwright/test';
import { SafeActions } from '../actions/SafeActions';
import { BasePage } from './BasePage';
import { css, role, text, first, at } from '../locators/sel';

export class PromotionsPage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        this.locators = this.build('promotions', {
            allTab: first(css("#specialoffers")),
            cityExclusivesTab: first(css("#cityexclusives")),
            globalFavouritesTab: first(css("#globalfavourites")),
            promoCardsGrid: first(css("div.tabs-content .grid")),
            firstPromoCard: first(css("div.tabs-content a[href^=\"/promotions/\"]")),
            promoCardTitle: first(css("div.text-base.font-bold.line-clamp-1.mb-2")),
            promoCardImage: first(css("div.tabs-content div.overflow-hidden img")),
            promoCardTimeLeft: first(css("div.tabs-content .flex-center span")),
            tellMeMoreCTA: at(role("button", {"name":"Tell me more"}), 1),
            promoDetailTitle: first(css("div.text-base-priority.text-xl.font-bold")),
            howToParticipate: first(text("How to participate")),
            promoLoginCTA: first(css("div.bg-light-100.mt-4 button")),
            betNowCTA: first(role("button", {"name":"Bet Now"})),
            termsToggle: first(css("details summary")),
            termsContent: first(css("details[open] .px-3")),
            eligibleGamesHeading: first(text("Eligible Games")),
            showAllBtn: first(role("button", {"name":"Show All"})),
            favoriteBtn: first(css("div[aria-label^=\"favorite-game\"]:has(svg.text-light-50)")),
            favoriteActiveBtn: first(css("div[aria-label^=\"favorite-game\"]:has(svg.primary-pink-gradient-text)")),
            eligibleGameCard: first(css("a.game-card[href*=\"feg=true\"]")),
            eligibleGameCardImage: first(css("a.game-card[href*=\"feg=true\"] img[alt]")),
            backButton: first(css("a[href=\"/promotions\"] button")),
            favouritesCarousel: first(css("div#favourites-carousel")),
            favouritesCarouselCard: first(css("div#favourites-carousel a.game-card")),
        });
    }

    async navigate() {
        await this.page.goto('/promotions', { waitUntil: 'domcontentloaded' });
    }

    async clickAllTab() {
        await this.safeActions.safeClick('allTab', this.locators.allTab);
    }

    async clickCityExclusivesTab() {
        await this.safeActions.safeClick('cityExclusivesTab', this.locators.cityExclusivesTab);
    }

    async clickGlobalFavouritesTab() {
        await this.safeActions.safeClick('globalFavouritesTab', this.locators.globalFavouritesTab);
    }

    async clickTellMeMore() {
        await this.safeActions.safeClick('tellMeMoreCTA', this.locators.tellMeMoreCTA);
    }

    /**
     * Opens each promotion's detail page until one with an Eligible Games section is found.
     * Returns true if found (and leaves that detail page open), false if no promotion in this
     * region has an Eligible Games section — callers can `test.skip` on false rather than fail.
     */
    async clickTellMeMoreWithEligibleGames(): Promise<boolean> {
        let index = 0;
        while (true) {
            await this.page.getByRole('button', { name: 'Tell me more' })
                .first()
                .waitFor({ state: 'visible', timeout: 15000 });
            const buttons = this.page.getByRole('button', { name: 'Tell me more' });
            const count = await buttons.count();
            if (index >= count) {
                return false;
            }
            await buttons.nth(index).click();
            await this.page.waitForURL(/\/promotions\//, { timeout: 10000 });
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            const hasEligible = await this.locators.showAllBtn
                .waitFor({ state: 'visible', timeout: 10000 })
                .then(() => true)
                .catch(() => false);
            if (hasEligible) {
                await this.locators.eligibleGameCard
                    .waitFor({ state: 'visible', timeout: 10000 })
                    .catch(() => {});
                return true;
            }
            await this.page.goBack({ waitUntil: 'domcontentloaded' });
            index++;
        }
    }

    async clickBetNow() {
        await this.safeActions.safeClick('betNowCTA', this.locators.betNowCTA);
    }

    async clickTermsToggle() {
        await this.safeActions.safeClick('termsToggle', this.locators.termsToggle);
    }

    async clickShowAll() {
        await this.safeActions.safeClick('showAllBtn', this.locators.showAllBtn);
    }

    async clickFavoriteAdd() {
        await this.safeActions.safeClick('favoriteBtn', this.locators.favoriteBtn);
    }

    async clickFavoriteRemove() {
        await this.safeActions.safeClick('favoriteActiveBtn', this.locators.favoriteActiveBtn);
    }

    async clickEligibleGameCard() {
        await this.safeActions.safeClick('eligibleGameCard', this.locators.eligibleGameCard);
    }

    async clickBack() {
        await this.safeActions.safeClick('backButton', this.locators.backButton);
    }

    getPromoCards() {
        return this.page.locator('div.tabs-content a[href^="/promotions/"]');
    }

    /** First promo card that exposes a "Tell me more" CTA. */
    get firstTellMeMoreCard(): Locator {
        return this.getPromoCards()
            .filter({ has: this.page.getByRole('button', { name: 'Tell me more' }) })
            .first();
    }
    /** Title element within a given promo card. */
    cardTitleOf(card: Locator): Locator {
        return card.locator('div.text-base.font-bold.line-clamp-1').first();
    }
    /** "Tell me more" CTA within a given promo card. */
    tellMeMoreOf(card: Locator): Locator {
        return card.getByRole('button', { name: 'Tell me more' });
    }

    getEligibleGameCards() {
        return this.page.locator('a.game-card[href*="feg=true"]');
    }

    getActiveTab() {
        return this.page.locator('.tabs-list.bg-primary, .tabs-list.bg-base-primary');
    }

    async highlightElement(key: string) {
        if (this.locators[key]) {
            await this.safeActions.safeHighlight(key, this.locators[key]);
        } else {
            console.error(`Locator ${key} not found`);
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  Intent API
    // ══════════════════════════════════════════════════════════════════════════
    get allTab(): Locator { return this.locators.allTab; }
    get cardsGrid(): Locator { return this.locators.promoCardsGrid; }
    get cardTitle(): Locator { return this.locators.promoCardTitle; }
    get cardImage(): Locator { return this.locators.promoCardImage; }
    get cardTimeLeft(): Locator { return this.locators.promoCardTimeLeft; }
    get tellMeMoreCta(): Locator { return this.locators.tellMeMoreCTA; }
    get detailTitle(): Locator { return this.locators.promoDetailTitle; }
    get howToParticipate(): Locator { return this.locators.howToParticipate; }
    get loginCta(): Locator { return this.locators.promoLoginCTA; }
    get betNowCta(): Locator { return this.locators.betNowCTA; }
    get eligibleGamesHeading(): Locator { return this.locators.eligibleGamesHeading; }
    get eligibleGameCard(): Locator { return this.locators.eligibleGameCard; }
    get showAllButton(): Locator { return this.locators.showAllBtn; }
    get favouriteButton(): Locator { return this.locators.favoriteBtn; }
    get favouriteActiveButton(): Locator { return this.locators.favoriteActiveBtn; }
    get favouritesCarousel(): Locator { return this.locators.favouritesCarousel; }

    // ── actions ──────────────────────────────────────────────────────────────────
    async open(): Promise<void> { await this.navigate(); }
    async openFirstPromo(): Promise<void> { await this.clickTellMeMore(); await this.detailTitle.waitFor({ state: 'visible' }); }
    /** Opens the first promo that has an Eligible Games section; false if none in this region. */
    async openPromoWithEligibleGames(): Promise<boolean> { return this.clickTellMeMoreWithEligibleGames(); }
    async toggleTerms(): Promise<void> { await this.clickTermsToggle(); }
    async selectEligibleGame(): Promise<void> { await this.clickEligibleGameCard(); }
    async addFavourite(): Promise<void> { await this.clickFavoriteAdd(); }
    async removeFavourite(): Promise<void> { await this.clickFavoriteRemove(); }
    async openShowAll(): Promise<void> { await this.clickShowAll(); }
    async betNow(): Promise<void> { await this.clickBetNow(); }

    // ── assertions ──────────────────────────────────────────────────────────────
    async expectPageReady(): Promise<void> {
        await expect(this.allTab).toBeVisible();
        await expect(this.cardsGrid).toBeVisible();
    }
    async expectPageUI(): Promise<void> {
        await expect(this.allTab).toBeVisible();
        await expect(this.locators.cityExclusivesTab).toBeVisible();
        await expect(this.locators.globalFavouritesTab).toBeVisible();
        await expect(this.cardTitle).toBeVisible();
        await this.expectImageLoaded(this.cardImage.first());
        await expect(this.tellMeMoreCta).toBeVisible();
    }
    async expectCardLayout(): Promise<void> {
        await expect(this.cardsGrid).toBeVisible();
        await expect(this.cardTitle).toBeVisible();
        await expect(this.cardImage).toBeVisible();
        await expect(this.cardTimeLeft).toBeVisible();
        await expect(this.tellMeMoreCta).toBeVisible();
    }
    /** Each category tab shows fewer (but non-zero) cards than All. */
    async expectCategoryFilters(): Promise<void> {
        const visible = () => this.getPromoCards().filter({ visible: true });
        await expect.poll(() => visible().count()).toBeGreaterThan(0);
        const allCount = await visible().count();
        await this.clickCityExclusivesTab();
        await expect(this.locators.cityExclusivesTab).toHaveClass(/bg-primary/);
        await expect.poll(() => visible().count()).toBeLessThan(allCount);
        expect(await visible().count()).toBeGreaterThan(0);
        await this.clickGlobalFavouritesTab();
        await expect(this.locators.globalFavouritesTab).toHaveClass(/bg-primary/);
        await expect.poll(() => visible().count()).toBeLessThan(allCount);
        expect(await visible().count()).toBeGreaterThan(0);
    }
    /** "Tell me more" on a card opens the matching detail page (titles agree). */
    async expectTellMeMoreOpensMatchingDetail(): Promise<void> {
        const card = this.firstTellMeMoreCard;
        const cardTitle = (await this.cardTitleOf(card).innerText()).trim();
        await this.tellMeMoreOf(card).click();
        await this.expectAt(/\/promotions\//);
        await expect(this.detailTitle).toBeVisible();
        const detailTitle = (await this.detailTitle.innerText()).trim();
        expect(detailTitle.toLowerCase()).toBe(cardTitle.toLowerCase());
    }
    async expectDetailUI(): Promise<void> {
        await this.expectAt(/\/promotions\//);
        await expect(this.detailTitle).toBeVisible();
        await expect(this.howToParticipate).toBeVisible();
    }
    async expectTermsExpand(): Promise<void> {
        await expect(this.locators.termsToggle).toBeVisible();
        await this.clickTermsToggle();
        await expect(this.locators.termsContent).toBeVisible();
        expect((await this.locators.termsContent.textContent())?.trim().length).toBeGreaterThan(0);
    }
    async expectEligibleGamesSection(): Promise<void> {
        await this.expectAt(/\/promotions\//);
        await expect(this.eligibleGamesHeading).toBeVisible();
        await expect(this.eligibleGameCard).toBeVisible();
        expect(await this.getEligibleGameCards().count()).toBeGreaterThan(0);
        expect((await this.locators.eligibleGameCardImage.getAttribute('alt'))?.trim().length).toBeGreaterThan(0);
        expect((await this.locators.eligibleGameCardImage.getAttribute('src'))?.trim().length).toBeGreaterThan(0);
    }
    async expectBackToPromotionsList(): Promise<void> {
        await this.page.goBack();
        await this.expectAt(/\/promotions$/);
    }
    /** Promotions list scrolls only if it's taller than the viewport (region-tolerant). */
    async expectPageScrolls(): Promise<void> {
        await expect(this.cardsGrid).toBeVisible();
        const scrollable = await this.page.evaluate(() => document.body.scrollHeight > window.innerHeight + 50);
        const y = await this.scrollToPageBottom();
        if (scrollable) expect(y).toBeGreaterThan(0);
    }
    async expectLoggedOutOnDetail(): Promise<void> {
        await expect(this.howToParticipate).toBeVisible();
        await expect(this.loginCta).toBeVisible();
        await expect(this.betNowCta).not.toBeVisible();
    }
}
