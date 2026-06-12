import { Page, Locator, expect } from '@playwright/test';

export type SignUpOutcome = 'welcome' | 'verification' | 'partial' | 'error' | 'timeout';

/**
 * Component Object for the two-step Sign Up modal — single owner of every sign-up selector,
 * plus the multi-step interaction flow. The form embeds hidden anti-autofill decoy inputs
 * reusing the same ids (name="removePseudo"), so fields are selected by name, never by id.
 */
export class SignUpModal {
    constructor(private readonly page: Page) {}

    // ─── elements ──────────────────────────────────────────────────────────────
    get dialog(): Locator { return this.page.locator("[role='dialog'][aria-labelledby='Sign Up-modal-title']"); }
    get form(): Locator { return this.page.locator('#registration-form'); }
    get progressBar(): Locator { return this.page.locator('#progressBar'); }
    get step0(): Locator { return this.page.locator("[data-element='step-0-container']"); }
    get step1(): Locator { return this.page.locator("[data-element='step-1-container']"); }
    get username(): Locator { return this.page.locator("#registration-form input[name='username']"); }
    get password(): Locator { return this.page.locator("#registration-form input[name='password']"); }
    get firstName(): Locator { return this.page.locator("#registration-form input[name='firstname']"); }
    get lastName(): Locator { return this.page.locator("#registration-form input[name='lastname']"); }
    get email(): Locator { return this.page.locator("#registration-form input[name='email']"); }
    get referralExpander(): Locator { return this.dialog.getByText('I have a sign up code'); }
    get referralCode(): Locator { return this.page.locator("#registration-form input[name='referralCode']"); }
    get nextButton(): Locator { return this.page.locator("button[element-name='step-one-next-registration']"); }
    get previousButton(): Locator { return this.page.locator("button[element-name='step-two-previous-registration']"); }
    get registerButton(): Locator { return this.page.locator("button[element-name='jpc-register']"); }
    get idTypeCombobox(): Locator { return this.page.locator('#idNumberType'); }
    get idNumber(): Locator { return this.page.locator("#registration-form input[name='idNumber']"); }
    get idNumberError(): Locator { return this.page.locator('#idNumber-error'); }
    get dobButton(): Locator { return this.page.locator("button[title='enter date of birth']"); }
    get datePanel(): Locator { return this.page.locator('#date-picker-panel'); }
    get firstSelectableDate(): Locator { return this.datePanel.locator("button[role='gridcell']:not([disabled])").first(); }
    get sourceCombobox(): Locator { return this.page.locator('#sourceOfFunds'); }
    get options(): Locator { return this.page.getByRole('option'); }
    option(name: string | RegExp): Locator { return this.page.getByRole('option', { name }); }
    get promoCheckbox(): Locator { return this.page.locator('#receivePromotionalInformation'); }
    get termsCheckbox(): Locator { return this.page.locator('#terms'); }
    get promoCheckboxBox(): Locator { return this.page.locator("div[data-pc-name='checkbox']:has(#receivePromotionalInformation)"); }
    get termsCheckboxBox(): Locator { return this.page.locator("div[data-pc-name='checkbox']:has(#terms)"); }
    get errorFeedback(): Locator { return this.page.locator("span[id$='-error'], .text-error-500"); }
    get agreeToAll(): Locator { return this.page.getByText(/agree to all/i).first(); }
    /** Field-level validation error, e.g. fieldError('email') → #email-error. */
    fieldError(field: string): Locator { return this.page.locator(`#${field}-error`); }

    // ─── test data generators ────────────────────────────────────────────────
    static randomMobile(): string {
        return '7' + String(Math.floor(10000000 + Math.random() * 89999999));
    }
    /** Valid SA ID: YYMMDD + sequence + citizenship + '8' + Luhn check digit (DOB 1990-05-20). */
    static makeSaId(): string {
        const base = '900520' + String(Math.floor(1000 + Math.random() * 8999)) + '0' + '8';
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            let d = Number(base[i]);
            if ((i % 2) === 1) { d *= 2; if (d > 9) d -= 9; }
            sum += d;
        }
        return base + String((10 - (sum % 10)) % 10);
    }
    static uniqueEmail(): string {
        return `qa.jpc.${Date.now()}@example.com`;
    }

    // ─── flow ──────────────────────────────────────────────────────────────────
    async expectOpen(): Promise<void> {
        await expect(this.dialog).toBeVisible({ timeout: 15000 });
        await expect(this.username).toBeVisible({ timeout: 10000 });
    }

    async fillStepOne(): Promise<void> {
        await this.username.pressSequentially(SignUpModal.randomMobile(), { delay: 20 });
        await this.password.fill('ValidPass123!');
        await this.firstName.fill('John');
        await this.lastName.fill('Tester');
        await this.email.fill(SignUpModal.uniqueEmail());
    }

    /** From a valid step one, advance to step two. */
    async advanceToStepTwo(): Promise<void> {
        await expect(this.nextButton, 'Next must enable once step one is valid').toBeEnabled({ timeout: 10000 });
        await this.nextButton.click();
        await expect(this.step1).toBeVisible({ timeout: 10000 });
    }

    /** Fill step two completely (valid SA ID by default) and accept terms. */
    async fillStepTwo(idNumber: string): Promise<void> {
        await this.idNumber.fill(idNumber);
        await this.idNumber.blur();
        await this.page.waitForTimeout(1000);
        // A valid SA ID auto-populates Date of Birth (the ID encodes it); only pick manually otherwise.
        if (await this.dobButton.isVisible().catch(() => false)) {
            await this.dobButton.click();
            await expect(this.datePanel).toBeVisible({ timeout: 10000 });
            await this.firstSelectableDate.click();
            await expect(this.dobButton).toHaveCount(0, { timeout: 10000 });
        }
        await this.sourceCombobox.click();
        await expect(this.options.first()).toBeVisible({ timeout: 10000 });
        await this.options.first().click();
        await expect(this.options).toHaveCount(0, { timeout: 5000 });
        await this.termsCheckbox.click();
        await expect(this.termsCheckboxBox).toHaveAttribute('data-p-checked', 'true', { timeout: 5000 });
    }

    /**
     * Submit and report the outcome. Success routes through one of: the "Your Wow Starts Now!"
     * welcome modal, the post-signup "Jackpot City verification" screen, or a logged-in/partial
     * state. The platform rate-limits account creation per IP → generic "An error occurred".
     */
    async submit(): Promise<SignUpOutcome> {
        await expect(this.registerButton, 'Sign Up must enable once the form is complete').toBeEnabled({ timeout: 10000 });
        await this.registerButton.click();
        return Promise.race<SignUpOutcome>([
            this.page.getByText(/your wow starts now/i).waitFor({ state: 'visible', timeout: 30000 }).then(() => 'welcome' as const),
            this.page.getByText(/jackpot city verification/i).waitFor({ state: 'visible', timeout: 30000 }).then(() => 'verification' as const),
            this.page.getByText('Complete account', { exact: false }).first().waitFor({ state: 'visible', timeout: 30000 }).then(() => 'partial' as const),
            this.page.getByText(/an error occurred/i).waitFor({ state: 'visible', timeout: 30000 }).then(() => 'error' as const),
        ]).catch(() => 'timeout' as const);
    }
}
