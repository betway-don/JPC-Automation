import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromExcel } from '../../global/utils/file-utils/excelReader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

const LOCATOR_URL = "src/global/utils/file-utils/locators.xlsx";

export class SignUpPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, private safeActions: SafeActions) {
        this.page = page;

        let configs = loadLocatorsFromExcel(LOCATOR_URL, "signUp");

        if (!configs || Object.keys(configs).length === 0) {
            console.warn("[SignUpPage POM] Excel locators not found or empty. Using internal mock data.");
            configs = this.getMockLocatorData();
        }

        this.locators = {
            registerButton: getLocator(this.page, configs["registerButton"]),
            loginButton: getLocator(this.page, configs["loginButton"]),
            mobileInput: getLocator(this.page, configs["mobileInput"]),
            passwordInput: getLocator(this.page, configs["passwordInput"]),
            firstNameInput: getLocator(this.page, configs["firstNameInput"]),
            lastNameInput: getLocator(this.page, configs["lastNameInput"]),
            emailInput: getLocator(this.page, configs["emailInput"]),
            nextButton: getLocator(this.page, configs["nextButton"]),
            idTypeDropdown: getLocator(this.page, configs["idTypeDropdown"]),
            passportOption: getLocator(this.page, configs["passportOption"]),
            saIdOption: getLocator(this.page, configs["saIdOption"]),
            passportInput: getLocator(this.page, configs["passportInput"]),
            saIdInput: getLocator(this.page, configs["saIdInput"]),
            dobDropdown: getLocator(this.page, configs["dobDropdown"]),
            dobSampleDate: getLocator(this.page, configs["dobSampleDate"]),
            sourceOfIncomeDropdown: getLocator(this.page, configs["sourceOfIncomeDropdown"]),
            sourceOfIncomeSalary: getLocator(this.page, configs["sourceOfIncomeSalary"]),
            promoCheckbox: getLocator(this.page, configs["promoCheckbox"]),
            ageCheckbox: getLocator(this.page, configs["ageCheckbox"]),
            signUpFormButton: getLocator(this.page, configs["signUpFormButton"]),
            diallingCode: getLocator(this.page, configs["diallingCode"]),
        };
    }

    async goto(url?: string) {
        await this.page.goto(url || '/', { waitUntil: 'domcontentloaded' });
    }

    async clickHomepageRegister() {
        await this.safeActions.safeClick('registerButton', this.locators.registerButton);
    }

    async clickHomepageLogin() {
        await this.safeActions.safeClick('loginButton', this.locators.loginButton);
    }

    async clickNext() {
        await this.safeActions.safeClick('nextButton', this.locators.nextButton);
    }

    async fillStep1(data: { mobile: string, pass: string, fName: string, lName: string, email: string }) {
        await this.safeActions.safeFill('mobileInput', this.locators.mobileInput, data.mobile);
        await this.safeActions.safeFill('passwordInput', this.locators.passwordInput, data.pass);
        await this.safeActions.safeFill('firstNameInput', this.locators.firstNameInput, data.fName);
        await this.safeActions.safeFill('lastNameInput', this.locators.lastNameInput, data.lName);
        await this.safeActions.safeFill('emailInput', this.locators.emailInput, data.email);
    }

    async testMobileValidation(mobile: string, pass: string, email: string) {
        await this.safeActions.safeFill('mobileInput', this.locators.mobileInput, mobile);
        await this.safeActions.safeFill('passwordInput', this.locators.passwordInput, pass);
        await this.safeActions.safeFill('emailInput', this.locators.emailInput, email);
    }

    async testNameValidation(fName: string, lName: string, mobile: string, pass: string, email: string) {
        await this.safeActions.safeFill('mobileInput', this.locators.mobileInput, mobile);
        await this.safeActions.safeFill('passwordInput', this.locators.passwordInput, pass);
        await this.safeActions.safeFill('firstNameInput', this.locators.firstNameInput, fName);
        await this.safeActions.safeFill('lastNameInput', this.locators.lastNameInput, lName);
        await this.safeActions.safeFill('emailInput', this.locators.emailInput, email);
    }

    async fillStep2SA(saId: string) {
        await this.safeActions.safeClick('idTypeDropdown', this.locators.idTypeDropdown);
        await this.safeActions.safeClick('saIdOption', this.locators.saIdOption);
        await this.safeActions.safeFill('saIdInput', this.locators.saIdInput, saId);
    }

    async fillStep2Passport(passport: string) {
        await this.safeActions.safeClick('idTypeDropdown', this.locators.idTypeDropdown);
        await this.safeActions.safeClick('passportOption', this.locators.passportOption);
        await this.safeActions.safeFill('passportInput', this.locators.passportInput, passport);
    }

    async completeStep2Details() {
        await this.safeActions.safeClick('dobDropdown', this.locators.dobDropdown);
        await this.safeActions.safeClick('dobSampleDate', this.locators.dobSampleDate);
        await this.safeActions.safeClick('sourceOfIncomeDropdown', this.locators.sourceOfIncomeDropdown);
        await this.safeActions.safeClick('sourceOfIncomeSalary', this.locators.sourceOfIncomeSalary);
        await this.safeActions.safeClick('promoCheckbox', this.locators.promoCheckbox);
        await this.safeActions.safeClick('ageCheckbox', this.locators.ageCheckbox);
        await this.safeActions.safeClick('signUpFormButton', this.locators.signUpFormButton);
    }

    // ------------------------------------------------------------------
    // HIGHLIGHTS & GETTERS
    // ------------------------------------------------------------------

    async highlightRegisterButton() {
        await this.safeActions.safeHighlight('registerButton', this.locators.registerButton);
    }

    async highlightLoginButton() {
        await this.safeActions.safeHighlight('loginButton', this.locators.loginButton);
    }

    async highlightStep1Form() {
        await this.safeActions.safeHighlight('mobileInput', this.locators.mobileInput);
        await this.safeActions.safeHighlight('passwordInput', this.locators.passwordInput);
        await this.safeActions.safeHighlight('firstNameInput', this.locators.firstNameInput);
        await this.safeActions.safeHighlight('lastNameInput', this.locators.lastNameInput);
    }

    async highlightMobileInput() {
        await this.safeActions.safeHighlight('mobileInput', this.locators.mobileInput);
    }

    async highlightPasswordInput() {
        await this.safeActions.safeHighlight('passwordInput', this.locators.passwordInput);
    }

    async highlightNameInputs() {
        await this.safeActions.safeHighlight('firstNameInput', this.locators.firstNameInput);
        await this.safeActions.safeHighlight('lastNameInput', this.locators.lastNameInput);
    }

    async highlightSAIdInput() {
        await this.safeActions.safeHighlight('saIdInput', this.locators.saIdInput);
    }

    async highlightPassportInput() {
        await this.safeActions.safeHighlight('passportInput', this.locators.passportInput);
    }

    async highlightDiallingCode() {
        await this.safeActions.safeHighlight('diallingCode', this.locators.diallingCode);
    }

    // Mock data function
    private getMockLocatorData(): Record<string, any> {
        return {
            "registerButton": { type: "role", value: "button", options: '{"name":"Register"}', nth: 0 },
            "loginButton": { type: "role", value: "button", options: '{"name":"Login"}', nth: 0 },
            "mobileInput": { type: "role", value: "textbox", options: '{"name":"username"}', nth: 0 },
            "passwordInput": { type: "role", value: "textbox", options: '{"name":"password"}', nth: 0 },
            "firstNameInput": { type: "role", value: "textbox", options: '{"name":"firstname"}', nth: 0 },
            "lastNameInput": { type: "role", value: "textbox", options: '{"name":"lastname"}', nth: 0 },
            "emailInput": { type: "role", value: "textbox", options: '{"name":"email"}', nth: 0 },
            "nextButton": { type: "text", value: "Next", options: '{}', nth: 0 },
            "idTypeDropdown": { type: "role", value: "combobox", options: '{"hasText":"South African ID"}', nth: 0 },
            "passportOption": { type: "text", value: "Passport", options: '{}', nth: 0 },
            "saIdOption": { type: "text", value: "South African ID", options: '{}', nth: 1 },
            "passportInput": { type: "role", value: "textbox", options: '{"name":"Passport"}', nth: 0 },
            "saIdInput": { type: "role", value: "textbox", options: '{"name":"South African ID"}', nth: 0 },
            "dobDropdown": { type: "role", value: "combobox", options: '{"name":"Enter Date of Birth"}', nth: 0 },
            "dobSampleDate": { type: "title", value: "05/09/", options: '{}', nth: 0 },
            "sourceOfIncomeDropdown": { type: "role", value: "combobox", options: '{"hasText":"Enter Source of Income"}', nth: 0 },
            "sourceOfIncomeSalary": { type: "text", value: "Salary / Wages", options: '{}', nth: 0 },
            "promoCheckbox": { type: "role", value: "checkbox", options: '{"name":"Send Big City Life events,"}', nth: 0 },
            "ageCheckbox": { type: "role", value: "checkbox", options: '{"name":"I am over 18 years of age & I"}', nth: 0 },
            "signUpFormButton": { type: "role", value: "button", options: '{"name":"Sign Up"}', nth: 0 },
            "diallingCode": { type: "text", value: "+27", options: '{}', nth: 0 }
        };
    }
}
