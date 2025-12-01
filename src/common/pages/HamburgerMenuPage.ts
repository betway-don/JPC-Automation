import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromExcel } from '../../global/utils/file-utils/excelReader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

const LOCATOR_URL = "src/global/utils/file-utils/locators.xlsx";

export class HamburgerMenuPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, protected safeActions: SafeActions) {
        this.page = page;

        let configs = loadLocatorsFromExcel(LOCATOR_URL, "hamBurgerMenu");

        if (!configs || Object.keys(configs).length === 0) {
            console.warn("[HamburgerMenuPage POM] Excel locators not found or empty. Using internal mock data.");
            configs = this.getMockLocatorData();
        }

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
            updatePasswordCTA: getLocator(this.page, configs["updatePasswordCTA"]),
            responsibleGamingCTA: getLocator(this.page, configs["responsibleGamingCTA"]),
            documentVerificationCTA: getLocator(this.page, configs["documentVerificationCTA"]),
            logOutCTA: getLocator(this.page, configs["logOutCTA"]),
            slotGamesCTA: getLocator(this.page, configs["slotGamesCTA"]),
            betGamesCTA: getLocator(this.page, configs["betGamesCTA"]),
            quickGamesCTA: getLocator(this.page, configs["quickGamesCTA"]),
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

    async clickUpdatePassword() {
        await this.safeActions.safeClick('updatePasswordCTA', this.locators.updatePasswordCTA);
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

    // Highlight methods
    async highlightElement(key: string) {
        if (this.locators[key]) {
            await this.safeActions.safeHighlight(key, this.locators[key]);
        } else {
            console.error(`Locator ${key} not found`);
        }
    }

    // Mock data
    protected getMockLocatorData(): Record<string, any> {
        return {
            "menuButton": { type: "role", value: "button", options: '{"name":"menu"}', nth: 0 },
            "lightThemeToggle": { type: "css", value: 'svg path[d^="M12 2.25a.75.75"]', options: '{}', nth: 0 },
            "darkThemeToggle": { type: "css", value: 'svg path[d^="M12 2.25a.75.75"]', options: '{}', nth: 0 },
            "searchField": { type: "css", value: 'div', options: '{"hasText":/^Search games$/}', nth: 2 },
            "promotionsCTA": { type: "text", value: "promotions", options: '{}', nth: 2 },
            "providersCTA": { type: "role", value: "paragraph", options: '{"hasText":"Providers"}', nth: 0 },
            "winnersCTA": { type: "text", value: "winners", options: '{"exact":true}', nth: 0 },
            "blogCTA": { type: "text", value: "blog", options: '{}', nth: 0 },
            "quickLinksDropdown": { type: "role", value: "button", options: '{"name":"Quick Links"}', nth: 0 },
            "privacyPolicyCTA": { type: "role", value: "button", options: '{"name":"Privacy Policy"}', nth: 0 },
            "contactUsCTA": { type: "role", value: "button", options: '{"name":"Contact Us"}', nth: 0 },
            "termsConditionsCTA": { type: "role", value: "button", options: '{"name":"Terms & Conditions"}', nth: 0 },
            "faqsCTA": { type: "role", value: "button", options: '{"name":"FAQ\'s"}', nth: 0 },
            "responsibleGamblingCTA": { type: "role", value: "button", options: '{"name":"Responsible Gambling"}', nth: 0 },
            "getTheAppCTA": { type: "role", value: "button", options: '{"name":"Get the app"}', nth: 0 },
            "slotGamesCategory": { type: "css", value: 'div:has-text("Game Categories") >> text="Slot Games"', options: '{}', nth: 0 },
            "liveGamesCategory": { type: "css", value: 'div:has-text("Game Categories") >> text="Live Games"', options: '{}', nth: 0 },
            "aviatorCTA": { type: "css", value: 'div:has-text("Game Categories") >> text="Aviator"', options: '{}', nth: 0 },
            "appleAppButton": { type: "role", value: "button", options: '{"name":"Jackpotcity Apple App"}', nth: 1 },
            "androidAppButton": { type: "role", value: "button", options: '{"name":"Jackpotcity Android App"}', nth: 1 },
            "huaweiAppButton": { type: "role", value: "button", options: '{"name":"Jackpotcity Huawei App"}', nth: 1 },
            "profileIcon": { type: "css", value: '.bg-primary-layer', options: '{}', nth: 2 },
            "balanceContainer": { type: "css", value: 'div:has-text("Cash"):has-text("Bonus Balance")', options: '{}', nth: 0 },
            "cashBalance": { type: "text", value: "Cash", options: '{}', nth: 0 },
            "bonusBalance": { type: "text", value: "Bonus Balance", options: '{}', nth: 0 },
            "depositButton": { type: "role", value: "button", options: '{"name":"Deposit"}', nth: 1 },
            "accountNo": { type: "css", value: '.bg-primary-layer >> text=Account No: >> ..', options: '{}', nth: 0 },
            "eyeToggle": { type: "css", value: '.design-system-button.flex.items-center.font-bold.hover\\:cursor-pointer.hover\\:shadow-md.text-base-priority.p-0', options: '{}', nth: 0 },
            "withdrawalCTA": { type: "role", value: "paragraph", options: '{"hasText":/^Withdrawal$/}', nth: 0 },
            "myAccountDropdown": { type: "role", value: "button", options: '{"name":"My Account"}', nth: 0 },
            "myAccountRegion": { type: "role", value: "region", options: '{"name":"My Account"}', nth: 0 },
            "myAccountDeposit": { type: "role", value: "button", options: '{"name":"Deposit"}', nth: 0 },
            "myAccountWithdrawal": { type: "role", value: "button", options: '{"name":"Withdrawal"}', nth: 0 },
            "transactionSummaryCTA": { type: "role", value: "button", options: '{"name":"Transaction Summary"}', nth: 0 },
            "bonusWalletCTA": { type: "role", value: "button", options: '{"name":"Bonus Wallet"}', nth: 0 },
            "personalDetailsCTA": { type: "role", value: "button", options: '{"name":"Personal Details"}', nth: 0 },
            "accountSettingsCTA": { type: "role", value: "button", options: '{"name":"Account Settings"}', nth: 0 },
            "updatePasswordCTA": { type: "role", value: "button", options: '{"name":"Update Password"}', nth: 0 },
            "responsibleGamingCTA": { type: "role", value: "button", options: '{"name":"Responsible Gaming"}', nth: 0 },
            "documentVerificationCTA": { type: "role", value: "button", options: '{"name":"Document Verification"}', nth: 0 },
            "logOutCTA": { type: "role", value: "button", options: '{"name":"Log Out"}', nth: 0 },
            "slotGamesCTA": { type: "css", value: 'div:has-text("Game Categories") >> text="Slot Games"', options: '{}', nth: 0 },
            "betGamesCTA": { type: "css", value: 'div:has-text("Game Categories") >> text="Betgames"', options: '{}', nth: 0 },
            "quickGamesCTA": { type: "css", value: 'div:has-text("Game Categories") >> text="Quick Games"', options: '{}', nth: 0 },
        };
    }
}
