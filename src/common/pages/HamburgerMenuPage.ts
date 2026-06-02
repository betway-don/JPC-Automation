import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

export class HamburgerMenuPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, protected safeActions: SafeActions) {
        this.page = page;
        const configs = loadLocatorsFromJson('hamBurgerMenu');

        this.locators = {
            menuButton: getLocator(this.page, configs["menuButton"]),
            lightThemeToggle: getLocator(this.page, configs["lightThemeToggle"]),
            darkThemeToggle: getLocator(this.page, configs["darkThemeToggle"]),
            searchField: getLocator(this.page, configs["searchField"]),
            promotionsCTA: getLocator(this.page, configs["promotionsCTA"]),
            providersCTA: getLocator(this.page, configs["providersCTA"]),
            winnersCTA: getLocator(this.page, configs["winnersCTA"]),
            blogCTA: getLocator(this.page, configs["blogCTA"]),
            quickLinksDropdown: getLocator(this.page, configs["quickLinksDropdown"]),
            privacyPolicyCTA: getLocator(this.page, configs["privacyPolicyCTA"]),
            contactUsCTA: getLocator(this.page, configs["contactUsCTA"]),
            termsConditionsCTA: getLocator(this.page, configs["termsConditionsCTA"]),
            faqsCTA: getLocator(this.page, configs["faqsCTA"]),
            responsibleGamblingCTA: getLocator(this.page, configs["responsibleGamblingCTA"]),
            getTheAppCTA: getLocator(this.page, configs["getTheAppCTA"]),
            slotGamesCategory: getLocator(this.page, configs["slotGamesCategory"]),
            liveGamesCategory: getLocator(this.page, configs["liveGamesCategory"]),
            aviatorCTA: getLocator(this.page, configs["aviatorCTA"]),
            appleAppButton: getLocator(this.page, configs["appleAppButton"]),
            androidAppButton: getLocator(this.page, configs["androidAppButton"]),
            huaweiAppButton: getLocator(this.page, configs["huaweiAppButton"]),
            profileIcon: getLocator(this.page, configs["profileIcon"]),
            balanceContainer: getLocator(this.page, configs["balanceContainer"]),
            cashBalance: getLocator(this.page, configs["cashBalance"]),
            bonusBalance: getLocator(this.page, configs["bonusBalance"]),
            depositButton: getLocator(this.page, configs["depositButton"]),
            accountNo: getLocator(this.page, configs["accountNo"]),
            eyeToggle: getLocator(this.page, configs["eyeToggle"]),
            withdrawalCTA: getLocator(this.page, configs["withdrawalCTA"]),
            myAccountDropdown: getLocator(this.page, configs["myAccountDropdown"]),
            myAccountRegion: getLocator(this.page, configs["myAccountRegion"]),
            myAccountDeposit: getLocator(this.page, configs["myAccountDeposit"]),
            myAccountWithdrawal: getLocator(this.page, configs["myAccountWithdrawal"]),
            transactionSummaryCTA: getLocator(this.page, configs["transactionSummaryCTA"]),
            bonusWalletCTA: getLocator(this.page, configs["bonusWalletCTA"]),
            personalDetailsCTA: getLocator(this.page, configs["personalDetailsCTA"]),
            accountSettingsCTA: getLocator(this.page, configs["accountSettingsCTA"]),
            cityRewardsCTA: getLocator(this.page, configs["cityRewardsCTA"]),
            responsibleGamingCTA: getLocator(this.page, configs["responsibleGamingCTA"]),
            documentVerificationCTA: getLocator(this.page, configs["documentVerificationCTA"]),
            logOutCTA: getLocator(this.page, configs["logOutCTA"]),
            slotGamesCTA: getLocator(this.page, configs["slotGamesCTA"]),
            betGamesCTA: getLocator(this.page, configs["betGamesCTA"]),
            quickGamesCTA: getLocator(this.page, configs["quickGamesCTA"]),
            hamburgerMenuClose: getLocator(this.page, configs["hamburgerMenuClose"]),
            hamburgerLoginCTA: getLocator(this.page, configs["hamburgerLoginCTA"]),
            hamburgerSignUpCTA: getLocator(this.page, configs["hamburgerSignUpCTA"]),
            newGamesCTA: getLocator(this.page, configs["newGamesCTA"]),
            crashGamesCTA: getLocator(this.page, configs["crashGamesCTA"]),
            transactionSummaryShortcut: getLocator(this.page, configs["transactionSummaryShortcut"]),
            cityRewardsShortcut: getLocator(this.page, configs["cityRewardsShortcut"]),
        };
    }

    async openMenu() {
        await this.safeActions.safeClick('menuButton', this.locators.menuButton);
    }

    async toggleTheme() {
        await this.safeActions.safeClick('lightThemeToggle', this.locators.lightThemeToggle);
    }

    async clickDarkTheme() {
        await this.safeActions.safeClick('darkThemeToggle', this.locators.darkThemeToggle);
    }

    async clickQuickLinks() {
        await this.safeActions.safeClick('quickLinksDropdown', this.locators.quickLinksDropdown);
    }

    async clickMyAccount() {
        await this.safeActions.safeClick('myAccountDropdown', this.locators.myAccountDropdown);
    }

    async clickSlotGamesCategory() {
        await this.safeActions.safeClick('slotGamesCategory', this.locators.slotGamesCategory);
    }

    async clickLiveGamesCategory() {
        await this.safeActions.safeClick('liveGamesCategory', this.locators.liveGamesCategory);
    }

    async clickEyeToggle() {
        await this.safeActions.safeClick('eyeToggle', this.locators.eyeToggle);
    }

    async clickMyAccountDeposit() {
        await this.safeActions.safeClick('myAccountDeposit', this.locators.myAccountDeposit);
    }

    async clickMyAccountWithdrawal() {
        await this.safeActions.safeClick('myAccountWithdrawal', this.locators.myAccountWithdrawal);
    }

    async clickTransactionSummary() {
        await this.safeActions.safeClick('transactionSummaryCTA', this.locators.transactionSummaryCTA);
    }

    async clickBonusWallet() {
        await this.safeActions.safeClick('bonusWalletCTA', this.locators.bonusWalletCTA);
    }

    async clickPersonalDetails() {
        await this.safeActions.safeClick('personalDetailsCTA', this.locators.personalDetailsCTA);
    }

    async clickAccountSettings() {
        await this.safeActions.safeClick('accountSettingsCTA', this.locators.accountSettingsCTA);
    }

    async clickCityRewards() {
        await this.safeActions.safeClick('cityRewardsCTA', this.locators.cityRewardsCTA);
    }

    async clickResponsibleGaming() {
        await this.safeActions.safeClick('responsibleGamingCTA', this.locators.responsibleGamingCTA);
    }

    async clickDocumentVerification() {
        await this.safeActions.safeClick('documentVerificationCTA', this.locators.documentVerificationCTA);
    }

    async clickLogOut() {
        await this.safeActions.safeClick('logOutCTA', this.locators.logOutCTA);
    }

    async clickAviatorCTA() {
        await this.safeActions.safeClick('aviatorCTA', this.locators.aviatorCTA);
    }

    async clickSlotGamesCTA() {
        await this.safeActions.safeClick('slotGamesCTA', this.locators.slotGamesCTA);
    }

    async clickBetGamesCTA() {
        await this.safeActions.safeClick('betGamesCTA', this.locators.betGamesCTA);
    }

    async clickQuickGamesCTA() {
        await this.safeActions.safeClick('quickGamesCTA', this.locators.quickGamesCTA);
    }

    async closeMenu() {
        await this.safeActions.safeClick('hamburgerMenuClose', this.locators.hamburgerMenuClose);
    }

    async clickHamburgerLoginCTA() {
        await this.safeActions.safeClick('hamburgerLoginCTA', this.locators.hamburgerLoginCTA);
    }

    async clickHamburgerSignUpCTA() {
        await this.safeActions.safeClick('hamburgerSignUpCTA', this.locators.hamburgerSignUpCTA);
    }

    async clickNewGamesCTA() {
        await this.safeActions.safeClick('newGamesCTA', this.locators.newGamesCTA);
    }

    async clickCrashGamesCTA() {
        await this.safeActions.safeClick('crashGamesCTA', this.locators.crashGamesCTA);
    }

    async clickTransactionSummaryShortcut() {
        await this.safeActions.safeClick('transactionSummaryShortcut', this.locators.transactionSummaryShortcut);
    }

    async clickCityRewardsShortcut() {
        await this.safeActions.safeClick('cityRewardsShortcut', this.locators.cityRewardsShortcut);
    }

    // Highlight methods
    async highlightElement(key: string) {
        if (this.locators[key]) {
            await this.safeActions.safeHighlight(key, this.locators[key]);
        } else {
            console.error(`Locator ${key} not found`);
        }
    }

}
