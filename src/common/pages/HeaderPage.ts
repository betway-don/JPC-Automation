import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromExcel } from '../../global/utils/file-utils/excelReader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

const LOCATOR_URL = "src/global/utils/file-utils/locators.xlsx";

export class HeaderPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, private safeActions: SafeActions) {
        this.page = page;

        let configs = loadLocatorsFromExcel(LOCATOR_URL, "header");

        if (!configs || Object.keys(configs).length === 0) {
            console.warn("[HeaderPage POM] Excel locators not found or empty. Using internal mock data.");
            configs = this.getMockLocatorData();
        }

        this.locators = {
            menuButton: getLocator(this.page, configs["menuButton"]),
            logoLink: getLocator(this.page, configs["logoLink"]),
            searchButton: getLocator(this.page, configs["searchButton"]),
            searchInput: getLocator(this.page, configs["searchInput"]),
            loginCTA: getLocator(this.page, configs["loginCTA"]),
            registerCTA: getLocator(this.page, configs["registerCTA"]),
            liveChatIcon: getLocator(this.page, configs["liveChatIcon"]),
            themeToggle: getLocator(this.page, configs["themeToggle"]),
            profileIcon: getLocator(this.page, configs["profileIcon"]),
            notificationIcon: getLocator(this.page, configs["notificationIcon"]),
            depositCTA: getLocator(this.page, configs["depositCTA"]),
            accountBalancesDialog: getLocator(this.page, configs["accountBalancesDialog"]),
            usernameInput: getLocator(this.page, configs["usernameInput"]),
            passwordInput: getLocator(this.page, configs["passwordInput"]),
            submitLoginButton: getLocator(this.page, configs["submitLoginButton"]),
        };
    }

    async navigateTo(url?: string) {
        await this.page.goto(url || 'https://jackpotcity.co.za/', { waitUntil: 'domcontentloaded' });
    }

    async clickMenu() {
        await this.safeActions.safeClick('menuButton', this.locators.menuButton);
    }

    async clickLogo() {
        await this.safeActions.safeClick('logoLink', this.locators.logoLink);
    }

    async searchFor(term: string) {
        await this.safeActions.safeClick('searchButton', this.locators.searchButton);
        await this.safeActions.safeFill('searchInput', this.locators.searchInput, term);
        await this.locators.searchInput.press('Enter');
    }

    async clickLoginCTA() {
        await this.safeActions.safeClick('loginCTA', this.locators.loginCTA);
    }

    async clickRegisterCTA() {
        await this.safeActions.safeClick('registerCTA', this.locators.registerCTA);
    }

    async clickLiveChat() {
        await this.safeActions.safeClick('liveChatIcon', this.locators.liveChatIcon);
    }

    async toggleTheme() {
        await this.safeActions.safeClick('themeToggle', this.locators.themeToggle);
    }

    async clickProfile() {
        await this.safeActions.safeClick('profileIcon', this.locators.profileIcon);
    }

    async clickNotification() {
        await this.safeActions.safeClick('notificationIcon', this.locators.notificationIcon);
    }

    async clickDeposit() {
        await this.safeActions.safeClick('depositCTA', this.locators.depositCTA);
    }

    async login(mobile: string, pass: string) {
        await this.clickLoginCTA();
        await this.safeActions.safeFill('usernameInput', this.locators.usernameInput, mobile);
        await this.safeActions.safeFill('passwordInput', this.locators.passwordInput, pass);
        await this.safeActions.safeClick('submitLoginButton', this.locators.submitLoginButton);
    }

    // Highlight methods
    async highlightElement(key: string) {
        if (this.locators[key]) {
            await this.safeActions.safeHighlight(key, this.locators[key]);
        } else {
            console.error(`Locator ${key} not found`);
        }
    }

    private getMockLocatorData(): Record<string, any> {
        return {
            "menuButton": { type: "role", value: "button", options: '{"name":"menu"}', nth: 0 },
            "logoLink": { type: "role", value: "link", options: '{"name":"Jackpotcity", "exact":true}', nth: 0 },
            "searchButton": { type: "text", value: "Search games", options: '{}', nth: 0 },
            "searchInput": { type: "role", value: "textbox", options: '{"name":"Search games"}', nth: 0 },
            "loginCTA": { type: "role", value: "button", options: '{"name":"Login"}', nth: 0 },
            "registerCTA": { type: "role", value: "button", options: '{"name":"Register"}', nth: 0 },
            "liveChatIcon": { type: "role", value: "button", options: '{"name":"Live Chat"}', nth: 0 },
            "themeToggle": { type: "css", value: '#site-header', options: '{"hasText": "light-mode"}', nth: 0 },
            "themeToggle_fallback": { type: "css", value: '#site-header [aria-label="light-mode"]', options: '{}', nth: 0 },
            "profileIcon": { type: "role", value: "button", options: '{"name":"account", "exact":true}', nth: 0 },
            "notificationIcon": { type: "role", value: "button", options: '{"name":"notification-panel"}', nth: 0 },
            "depositCTA": { type: "css", value: 'div:has-text("Cash") button:has(svg path[d="m19.5 8.25-7.5 7.5-7.5-7.5"])', options: '{}', nth: 0 },
            "accountBalancesDialog": { type: "css", value: 'div[role="dialog"]:has-text("Account Balances")', options: '{}', nth: 0 },
            "usernameInput": { type: "role", value: "textbox", options: '{"name":"username"}', nth: 0 },
            "passwordInput": { type: "role", value: "textbox", options: '{"name":"password"}', nth: 0 },
            "submitLoginButton": { type: "role", value: "button", options: '{"name":"Submit"}', nth: 0 },
        };
    }
}
