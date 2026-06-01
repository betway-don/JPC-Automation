import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

export class HeaderPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, private safeActions: SafeActions) {
        this.page = page;
        const configs = loadLocatorsFromJson('header');

        this.locators = {
            menuButton: getLocator(this.page, configs["menuButton"]),
            logoLink: getLocator(this.page, configs["logoLink"]),
            searchButton: getLocator(this.page, configs["searchButton"]),
            searchInput: getLocator(this.page, configs["searchInput"]),
            actualSearchInput: getLocator(this.page, configs["actualSearchInput"]),
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
        await this.page.goto(url || '/', { waitUntil: 'domcontentloaded' });
    }

    async clickMenu() {
        await this.safeActions.safeClick('menuButton', this.locators.menuButton);
    }

    async clickLogo() {
        await this.safeActions.safeClick('logoLink', this.locators.logoLink);
    }

    async searchFor(term: string) {
        await this.safeActions.safeClick('searchButton', this.locators.searchButton);
        await this.safeActions.safeFill('actualSearchInput', this.locators.actualSearchInput, term);
        await this.locators.actualSearchInput.press('Enter');
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

}
