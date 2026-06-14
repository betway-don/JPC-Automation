import { Page, Locator } from '@playwright/test';
import { SafeActions } from '../actions/SafeActions';
import { BasePage } from './BasePage';
import { css, id, role, text, title, first, at, withText } from '../locators/sel';

export class SignUpPage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        this.locators = this.build('signUp', {
            registerButton: first(role("button", {"name":"Register"})),
            loginButton: first(role("button", {"name":"Login"})),
            mobileInput: first(id("username")),
            passwordInput: first(id("password")),
            firstNameInput: first(role("textbox", {"name":"firstname"})),
            lastNameInput: first(role("textbox", {"name":"lastname"})),
            emailInput: first(role("textbox", {"name":"/email/i"})),
            nextButton: first(role("button", {"name":"Next","exact":true})),
            idTypeDropdown: first(withText(role('combobox'), 'South African ID')),
            passportOption: first(text("Passport")),
            saIdOption: at(text("South African ID"), 1),
            passportInput: first(role("textbox", {"name":"Passport"})),
            saIdInput: first(role("textbox", {"name":"idNumber"})),
            dobDropdown: first(role("combobox", {"name":"Enter Date of Birth"})),
            dobSampleDate: first(title("05/09/2026")),
            sourceOfIncomeDropdown: first(role("combobox", {"name":"Enter Source of Income"})),
            sourceOfIncomeSalary: first(text("Salary / Wages")),
            promoCheckbox: first(role("checkbox", {"name":"Send Jackpot City Promotions"})),
            ageCheckbox: first(role("checkbox", {"name":"I am over 18 years of age & I"})),
            signUpFormButton: first(role("button", {"name":"Sign Up"})),
            diallingCode: first(css("span.absolute.text-base-priority.left-0 > span")),
            confirmPasswordInput: first(id("passwordConfirmation")),
            agreeToAllCheckbox: first(id("agreeToAll")),
            termsCheckbox: first(id("terms")),
            preferredLanguageDropdown: first(id("preferredLanguage")),
            referralCodeToggle: first(css("[data-element='input-referralCode-container'] .cursor-pointer")),
            referralCodeInput: first(id("referralCode")),
        });
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

}
