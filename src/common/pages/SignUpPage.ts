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

        const mockData = this.getMockLocatorData();
        if (!configs || Object.keys(configs).length === 0) {
            console.warn("[SignUpPage POM] Excel locators not found or empty. Using internal mock data.");
            configs = mockData;
        } else {
            configs = { ...mockData, ...configs };
        }

        this.locators = {
            registerButton: getLocator(this.page, configs["registerButton"]),
            loginButton: getLocator(this.page, configs["loginButton"]),
            mobileInput: getLocator(this.page, configs["mobileInput"]),
            passwordInput: getLocator(this.page, configs["passwordInput"]),
            confirmPasswordInput: getLocator(this.page, configs["confirmPasswordInput"]),
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
            agreeToAllCheckbox: getLocator(this.page, configs["agreeToAllCheckbox"]),
            termsCheckbox: getLocator(this.page, configs["termsCheckbox"]),
            preferredLanguageDropdown: getLocator(this.page, configs["preferredLanguageDropdown"]),
            referralCodeToggle: getLocator(this.page, configs["referralCodeToggle"]),
            referralCodeInput: getLocator(this.page, configs["referralCodeInput"]),
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
        await this.safeActions.safeFill('firstNameInput', this.locators.firstNameInput, data.fName);
        await this.safeActions.safeFill('lastNameInput', this.locators.lastNameInput, data.lName);
        await this.safeActions.safeFill('emailInput', this.locators.emailInput, data.email);
        await this.safeActions.safeFill('passwordInput', this.locators.passwordInput, data.pass);
    }

    async testMobileValidation(mobile: string, pass: string) {
        await this.safeActions.safeFill('mobileInput', this.locators.mobileInput, mobile);
        await this.safeActions.safeFill('passwordInput', this.locators.passwordInput, pass);
    }

    async testNameValidation(fName: string, lName: string, mobile: string, pass: string) {
        await this.safeActions.safeFill('mobileInput', this.locators.mobileInput, mobile);
        await this.safeActions.safeFill('passwordInput', this.locators.passwordInput, pass);
        await this.safeActions.safeFill('firstNameInput', this.locators.firstNameInput, fName);
        await this.safeActions.safeFill('lastNameInput', this.locators.lastNameInput, lName);
    }

    async testConfirmPasswordValidation(mobile: string, pass: string, confirmPass: string) {
        await this.safeActions.safeFill('mobileInput', this.locators.mobileInput, mobile);
        await this.safeActions.safeFill('passwordInput', this.locators.passwordInput, pass);
        await this.safeActions.safeFill('confirmPasswordInput', this.locators.confirmPasswordInput, confirmPass);
    }

    async expandAndFillReferralCode(code: string) {
        await this.safeActions.safeClick('referralCodeToggle', this.locators.referralCodeToggle);
        await this.page.waitForTimeout(500);
        await this.safeActions.safeFill('referralCodeInput', this.locators.referralCodeInput, code);
    }

    async clickAgreeToAll() {
        await this.safeActions.safeClick('agreeToAllCheckbox', this.locators.agreeToAllCheckbox);
    }

    async clickTermsCheckbox() {
        await this.safeActions.safeClick('termsCheckbox', this.locators.termsCheckbox);
    }

    async clickPromoCheckbox() {
        await this.safeActions.safeClick('promoCheckbox', this.locators.promoCheckbox);
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
        // await this.safeActions.safeClick('dobDropdown', this.locators.dobDropdown);
        // await this.safeActions.safeClick('dobSampleDate', this.locators.dobSampleDate);
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
    }

    async highlightMobileInput() {
        await this.safeActions.safeHighlight('mobileInput', this.locators.mobileInput);
    }

    async highlightPasswordInput() {
        await this.safeActions.safeHighlight('passwordInput', this.locators.passwordInput);
    }

    async highlightConfirmPasswordInput() {
        await this.safeActions.safeHighlight('confirmPasswordInput', this.locators.confirmPasswordInput);
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

    async highlightPreferredLanguage() {
        await this.safeActions.safeHighlight('preferredLanguageDropdown', this.locators.preferredLanguageDropdown);
    }

    async highlightReferralCodeInput() {
        await this.safeActions.safeHighlight('referralCodeInput', this.locators.referralCodeInput);
    }

    async highlightAgreeToAllCheckbox() {
        await this.safeActions.safeHighlight('agreeToAllCheckbox', this.locators.agreeToAllCheckbox);
    }

    async highlightTermsCheckbox() {
        await this.safeActions.safeHighlight('termsCheckbox', this.locators.termsCheckbox);
    }

    async highlightPromoCheckbox() {
        await this.safeActions.safeHighlight('promoCheckbox', this.locators.promoCheckbox);
    }

    async highlightSignUpButton() {
        await this.safeActions.safeHighlight('signUpFormButton', this.locators.signUpFormButton);
    }

    async highlightDOBPicker() {
        await this.safeActions.safeHighlight('dobDropdown', this.locators.dobDropdown);
    }

    // Mock data function
    private getMockLocatorData(): Record<string, any> {
        return {
            // --- Common ---
            // Header register button is NOT disabled; the in-form Sign Up button always starts disabled
            "registerButton": { type: "css", value: "button[element-name='jpc-register']:not([disabled])", options: {}, nth: 0 },
            "loginButton": { type: "role", value: "button", options: { name: "Login" }, nth: 0 },
            // Use IDs directly — they are unique and available in all regions
            "mobileInput": { type: "id", value: "username", options: {}, nth: 0 },
            "passwordInput": { type: "id", value: "password", options: {}, nth: 0 },
            // The in-form Sign Up submit button
            "signUpFormButton": { type: "css", value: "[element-name='jpc-register']", options: {}, nth: 0 },
            // Dialling code prefix span (text varies per region: +255, +233, +27)
            "diallingCode": { type: "css", value: "span.absolute.text-base-priority.left-0 > span", options: {}, nth: 0 },

            // --- TZ-specific (single-step form) ---
            "preferredLanguageDropdown": { type: "id", value: "preferredLanguage", options: {}, nth: 0 },
            "referralCodeToggle": { type: "css", value: "[data-element='input-referralCode-container'] .cursor-pointer", options: {}, nth: 0 },
            "referralCodeInput": { type: "id", value: "referralCode", options: {}, nth: 0 },
            "agreeToAllCheckbox": { type: "id", value: "agreeToAll", options: {}, nth: 0 },
            "termsCheckbox": { type: "id", value: "terms", options: {}, nth: 0 },
            "promoCheckbox": { type: "id", value: "receivePromotionalInformation", options: {}, nth: 0 },

            // --- GH-specific ---
            "confirmPasswordInput": { type: "id", value: "passwordConfirmation", options: {}, nth: 0 },
            "dobDropdown": { type: "id", value: "dateOfBirth", options: {}, nth: 0 },

            // --- ZA-specific (multi-step) ---
            "firstNameInput": { type: "role", value: "textbox", options: { name: "firstname" }, nth: 0 },
            "lastNameInput": { type: "role", value: "textbox", options: { name: "lastname" }, nth: 0 },
            "emailInput": { type: "role", value: "textbox", options: { name: "email" }, nth: 0 },
            "nextButton": { type: "text", value: "Next", options: {}, nth: 0 },
            "idTypeDropdown": { type: "role", value: "combobox", options: { hasText: "South African ID" }, nth: 0 },
            "passportOption": { type: "text", value: "Passport", options: {}, nth: 0 },
            "saIdOption": { type: "text", value: "South African ID", options: {}, nth: 1 },
            "passportInput": { type: "role", value: "textbox", options: { name: "Passport" }, nth: 0 },
            "saIdInput": { type: "role", value: "textbox", options: { name: "South African ID" }, nth: 0 },
            "dobSampleDate": { type: "title", value: "05/09/", options: {}, nth: 0 },
            "sourceOfIncomeDropdown": { type: "role", value: "combobox", options: { hasText: "Enter Source of Income" }, nth: 0 },
            "sourceOfIncomeSalary": { type: "text", value: "Salary / Wages", options: {}, nth: 0 },
            "ageCheckbox": { type: "role", value: "checkbox", options: { name: "I am over 18 years of age & I" }, nth: 0 },
        };
    }
}
