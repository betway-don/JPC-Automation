import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        const c = loadLocatorsFromJson('homePage');
        this.locators = {
            bannerCarousel:         getLocator(this.page, c['bannerCarousel']),
            bannerActiveSlide:      getLocator(this.page, c['bannerActiveSlide']),
            bannerImage:            getLocator(this.page, c['bannerImage']),
            bannerNextBtn:          getLocator(this.page, c['bannerNextBtn']),
            bannerPrevBtn:          getLocator(this.page, c['bannerPrevBtn']),
            bannerActivePagination: getLocator(this.page, c['bannerActivePagination']),
            trendingSection:        getLocator(this.page, c['trendingSection']),
            trendingGameCard:       getLocator(this.page, c['trendingGameCard']),
            trendingGameImg:        getLocator(this.page, c['trendingGameImg']),
            trendingFavBtn:         getLocator(this.page, c['trendingFavBtn']),
            trendingFavActiveBtn:   getLocator(this.page, c['trendingFavActiveBtn']),
            bigWinnersMarquee:      getLocator(this.page, c['bigWinnersMarquee']),
            bigWinnersItem:         getLocator(this.page, c['bigWinnersItem']),
            bigWinnersGameTitle:    getLocator(this.page, c['bigWinnersGameTitle']),
            bigWinnersAmount:       getLocator(this.page, c['bigWinnersAmount']),
            bigWinnersMaskedUser:   getLocator(this.page, c['bigWinnersMaskedUser']),
            gameSection:            getLocator(this.page, c['gameSection']),
            gameSectionCard:        getLocator(this.page, c['gameSectionCard']),
            gameSectionImg:         getLocator(this.page, c['gameSectionImg']),
            gameSectionAllLink:     getLocator(this.page, c['gameSectionAllLink']),
            favouritesSection:      getLocator(this.page, c['favouritesSection']),
            favouritesGameCard:     getLocator(this.page, c['favouritesGameCard']),
            favouritesFavActiveBtn: getLocator(this.page, c['favouritesFavActiveBtn']),
            recentlyPlayedSection:  getLocator(this.page, c['recentlyPlayedSection']),
            recentlyPlayedCard:     getLocator(this.page, c['recentlyPlayedCard']),
            loginPromptModal:       getLocator(this.page, c['loginPromptModal']),
            signUpModal:            getLocator(this.page, c['signUpModal']),
            providersSection:       getLocator(this.page, c['providersSection']),
            providerTile:           getLocator(this.page, c['providerTile']),
            providerImg:            getLocator(this.page, c['providerImg']),
            providersShowAllLink:                getLocator(this.page, c['providersShowAllLink']),
            providerDetailBreadcrumbProviders:   getLocator(this.page, c['providerDetailBreadcrumbProviders']),
            specialOffersSection:   getLocator(this.page, c['specialOffersSection']),
            promoCard:              getLocator(this.page, c['promoCard']),
            promoCardTitle:         getLocator(this.page, c['promoCardTitle']),
            promoCardImg:           getLocator(this.page, c['promoCardImg']),
            specialOffersShowAllLink:  getLocator(this.page, c['specialOffersShowAllLink']),
            stackpotBanner:            getLocator(this.page, c['stackpotBanner']),
            stackpotJackpotMeter:      getLocator(this.page, c['stackpotJackpotMeter']),
            stackpotPlayNowBtn:        getLocator(this.page, c['stackpotPlayNowBtn']),
            stackpotMoreInfoBtn:       getLocator(this.page, c['stackpotMoreInfoBtn']),
            stackpotModal:             getLocator(this.page, c['stackpotModal']),
            stackpotModalTitle:        getLocator(this.page, c['stackpotModalTitle']),
            stackpotModalDescription:  getLocator(this.page, c['stackpotModalDescription']),
            stackpotModalCloseBtn:     getLocator(this.page, c['stackpotModalCloseBtn']),
            stackpotModalPlayNowBtn:   getLocator(this.page, c['stackpotModalPlayNowBtn']),
            heroSection:               getLocator(this.page, c['heroSection']),
            heroShowAllBtn:            getLocator(this.page, c['heroShowAllBtn']),
            footerResponsibleGambling: getLocator(this.page, c['footerResponsibleGambling']),
            footerFaq:                 getLocator(this.page, c['footerFaq']),
            footerGetTheApp:           getLocator(this.page, c['footerGetTheApp']),
            footerPrivacyPolicy:       getLocator(this.page, c['footerPrivacyPolicy']),
            footerContactUs:           getLocator(this.page, c['footerContactUs']),
            footerTermsConditions:     getLocator(this.page, c['footerTermsConditions']),
            footerAboutUs:             getLocator(this.page, c['footerAboutUs']),
            footerPaiaManual:          getLocator(this.page, c['footerPaiaManual']),
            footerHowTo:               getLocator(this.page, c['footerHowTo']),
            footerAppDownloadLink:     getLocator(this.page, c['footerAppDownloadLink']),
            footerAppleBtn:            getLocator(this.page, c['footerAppleBtn']),
            footerAndroidBtn:          getLocator(this.page, c['footerAndroidBtn']),
            footerHuaweiBtn:           getLocator(this.page, c['footerHuaweiBtn']),
            footerInstagramLink:       getLocator(this.page, c['footerInstagramLink']),
            footerFacebookLink:        getLocator(this.page, c['footerFacebookLink']),
            footerTwitterLink:         getLocator(this.page, c['footerTwitterLink']),
            footerVisaIcon:            getLocator(this.page, c['footerVisaIcon']),
            footerMastercardIcon:      getLocator(this.page, c['footerMastercardIcon']),
            footerZapperIcon:          getLocator(this.page, c['footerZapperIcon']),
            footerOzowIcon:            getLocator(this.page, c['footerOzowIcon']),
            footerApplePayIcon:        getLocator(this.page, c['footerApplePayIcon']),
        };
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
    get providersBreadcrumbHeading(): Locator { return this.page.locator('h1, [class*="breadcrumb"], div.font-bold').first(); }
    get accordionContainer(): Locator { return this.page.locator('div.kentico-accordion-container'); }
    get accordionItems(): Locator { return this.page.locator('details[id^="accordion-item"]'); }
    get howToContentWrapper(): Locator { return this.page.locator('div.accordions-content-wrapper'); }
    get howToSections(): Locator { return this.page.locator('section.accordion-widget'); }
    get howToDetails(): Locator { return this.page.locator('section.accordion-widget details'); }
    get contactUsContainer(): Locator { return this.page.locator('div.jpc-contactUs-container'); }
    get contactSupportEmail(): Locator { return this.page.locator('a[href*="mailto:support@jackpotcity.co.za"]').first(); }
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
}
