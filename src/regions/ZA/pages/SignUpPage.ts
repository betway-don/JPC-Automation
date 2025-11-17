import { Page, Locator } from '@playwright/test';
// Adjust these paths based on your actual file structure
import { loadLocatorsFromExcel } from '../../../global/utils/file-utils/excelReader'; 
import { getLocator } from '../../../global/utils/file-utils/locatorResolver'; 
import { SafeActions } from '../../Common-Flows/SafeActions'; 
// import { a } from '../../../global/utils/file-utils/lo'; 



const LOCATOR_URL = "src/global/utils/file-utils/locators.xlsx";


export class SignUpPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    // 1. Accept SafeActions via dependency injection
    constructor(page: Page, private safeActions: SafeActions) {
        this.page = page;

        let configs = loadLocatorsFromExcel(LOCATOR_URL, "signUp");
        
        // If Excel loading fails or is empty, use the mock data
        if (!configs || Object.keys(configs).length === 0) {
            console.warn("[SignUpPage POM] Excel locators not found or empty. Using internal mock data.");
            configs = this.getMockLocatorData();
        }

        // 2. This registry ONLY holds Level 1 (Excel) locators
        this.locators = {
            registerButton: getLocator(this.page, configs["registerButton"]),
            // loginButton: getLocator(this.page, configs["loginButton"]),
            // mobileInput: getLocator(this.page, configs["mobileInput"]),
            // passwordInput: getLocator(this.page, configs["passwordInput"]),
            // firstNameInput: getLocator(this.page, configs["firstNameInput"]),
            // lastNameInput: getLocator(this.page, configs["lastNameInput"]),
            // emailInput: getLocator(this.page, configs["emailInput"]),
            // nextButton: getLocator(this.page, configs["nextButton"]),
            // idTypeDropdown: getLocator(this.page, configs["idTypeDropdown"]),
            // passportOption: getLocator(this.page, configs["passportOption"]),
            // saIdOption: getLocator(this.page, configs["saIdOption"]),
            // passportInput: getLocator(this.page, configs["passportInput"]),
            // saIdInput: getLocator(this.page, configs["saIdInput"]),
            // dobDropdown: getLocator(this.page, configs["dobDropdown"]),
            // dobSampleDate: getLocator(this.page, configs["dobSampleDate"]),
            // sourceOfIncomeDropdown: getLocator(this.page, configs["sourceOfIncomeDropdown"]),
            // sourceOfIncomeSalary: getLocator(this.page, configs["sourceOfIncomeSalary"]),
            // promoCheckbox: getLocator(this.page, configs["promoCheckbox"]),
            // ageCheckbox: getLocator(this.page, configs["ageCheckbox"]),
            // signUpFormButton: getLocator(this.page, configs["signUpFormButton"]),
            // diallingCode: getLocator(this.page, configs["diallingCode"]),
        };
    }

    // ------------------------------------------------------------------
    // ACTIONS: Now delegate to safeActions
    // ------------------------------------------------------------------

    async goto() {
        await this.page.goto('https://www.jackpotcity.co.za/');
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

// excel locators


// key,type,value,options,nth
// registerButton,role,button,"{""name"":""Register""}",0
// loginButton,role,button,"{""name"":""Login""}",0
// mobileInput,role,textbox,"{""name"":""Mobile Number""}",0
// passwordInput,role,textbox,"{""name"":""Password""}",0
// firstNameInput,role,textbox,"{""name"":""First Name""}",0
// lastNameInput,role,textbox,"{""name"":""Last Name""}",0
// emailInput,role,textbox,"{""name"":""Email""}",0
// nextButton,text,Next,{},0
// idTypeDropdown,role,combobox,"{""hasText"":""South African ID""}",0
// passportOption,text,Passport,{},0
// saIdOption,text,South African ID,{},1
// passportInput,role,textbox,"{""name"":""Passport""}",0
// saIdInput,role,textbox,"{""name"":""South African ID""}",0
// dobDropdown,role,combobox,"{""name"":""Enter Date of Birth""}",0
// dobSampleDate,title,05/09/,{},0
// sourceOfIncomeDropdown,role,combobox,"{""hasText"":""Enter Source of Income""}",0
// sourceOfIncomeSalary,text,Salary / Wages,{},0
// promoCheckbox,role,checkbox,"{""name"":""Send Big City Life events,""}",0
// ageCheckbox,role,checkbox,"{""name"":""I am over 18 years of age & I""}",0
// signUpFormButton,role,button,"{""name"":""Sign Up""}",0
// diallingCode,text,+27,{},0