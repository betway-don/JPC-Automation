import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';
import { BasePage } from './BasePage';

export class PromotionsPage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        const configs = loadLocatorsFromJson('promotions');

        this.locators = {
            allTab: getLocator(this.page, configs['allTab']),
            cityExclusivesTab: getLocator(this.page, configs['cityExclusivesTab']),
            globalFavouritesTab: getLocator(this.page, configs['globalFavouritesTab']),
            promoCardsGrid: getLocator(this.page, configs['promoCardsGrid']),
            firstPromoCard: getLocator(this.page, configs['firstPromoCard']),
            promoCardTitle: getLocator(this.page, configs['promoCardTitle']),
            promoCardImage: getLocator(this.page, configs['promoCardImage']),
            promoCardTimeLeft: getLocator(this.page, configs['promoCardTimeLeft']),
            tellMeMoreCTA: getLocator(this.page, configs['tellMeMoreCTA']),
            promoDetailTitle: getLocator(this.page, configs['promoDetailTitle']),
            howToParticipate: getLocator(this.page, configs['howToParticipate']),
            promoLoginCTA: getLocator(this.page, configs['promoLoginCTA']),
            betNowCTA: getLocator(this.page, configs['betNowCTA']),
            termsToggle: getLocator(this.page, configs['termsToggle']),
            termsContent: getLocator(this.page, configs['termsContent']),
            eligibleGamesHeading: getLocator(this.page, configs['eligibleGamesHeading']),
            showAllBtn: getLocator(this.page, configs['showAllBtn']),
            favoriteBtn: getLocator(this.page, configs['favoriteBtn']),
            favoriteActiveBtn: getLocator(this.page, configs['favoriteActiveBtn']),
            eligibleGameCard: getLocator(this.page, configs['eligibleGameCard']),
            eligibleGameCardImage: getLocator(this.page, configs['eligibleGameCardImage']),
            backButton: getLocator(this.page, configs['backButton']),
            favouritesCarousel: getLocator(this.page, configs['favouritesCarousel']),
            favouritesCarouselCard: getLocator(this.page, configs['favouritesCarouselCard']),
        };
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

    async clickTellMeMoreWithEligibleGames() {
        let index = 0;
        while (true) {
            await this.page.getByRole('button', { name: 'Tell me more' })
                .first()
                .waitFor({ state: 'visible', timeout: 15000 });
            const buttons = this.page.getByRole('button', { name: 'Tell me more' });
            const count = await buttons.count();
            if (index >= count) {
                throw new Error('No promotion card with Eligible Games section found');
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
                return;
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
}
