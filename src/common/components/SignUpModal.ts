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
    // Identify the sign-up dialog by the registration form it contains — the modal title differs by
    // region ("Sign Up-modal-title" on ZA, "Register-modal-title" on TZ), but the form id is shared.
    get dialog(): Locator { return this.page.locator("[role='dialog']:has(#registration-form)"); }
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
    // The consent text carries two inline links (visually un-highlighted) that open in a new tab.
    get termsConditionsLink(): Locator { return this.page.locator("[data-element='input-terms-container'] a[href='/terms-and-conditions']"); }
    get privacyPolicyLink(): Locator { return this.page.locator("[data-element='input-terms-container'] a[href='/privacy-policy']"); }
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

    // ══════════════════════════════════════════════════════════════════════════
    //  Intent API — field-level validation mechanics live here.
    // ══════════════════════════════════════════════════════════════════════════
    private async fillValidStepOneExcept(skip: 'mobile' | 'email' | 'none' = 'none'): Promise<void> {
        if (skip !== 'mobile') await this.username.pressSequentially(SignUpModal.randomMobile(), { delay: 20 });
        await this.password.fill('ValidPass123!');
        await this.firstName.fill('John');
        await this.lastName.fill('Tester');
        if (skip !== 'email') await this.email.fill('qa.automation.jpc@example.com');
    }

    async expectMobileRejectsNonDigits(junk: string): Promise<void> {
        await this.username.pressSequentially(junk, { delay: 50 });
        expect(await this.username.inputValue(), `mobile field accepted "${junk}"`).toMatch(/^\d*$/);
    }
    /** A 7-digit mobile must block Next; a >9-digit mobile is capped at 9 or blocks Next. */
    async expectNineDigitRestriction(): Promise<void> {
        await this.username.pressSequentially('1234567', { delay: 20 });
        await this.fillValidStepOneExcept('mobile');
        expect(await this.nextButton.isEnabled().catch(() => false), 'form must not proceed with a 7-digit mobile').toBe(false);
        await this.username.fill('');
        await this.username.pressSequentially('1234567890123', { delay: 20 });
        const v = await this.username.inputValue();
        if (v.length > 9) expect(await this.nextButton.isEnabled().catch(() => false), 'form must not proceed with a >9-digit mobile').toBe(false);
        else expect(v.length).toBeLessThanOrEqual(9);
    }
    /** A 27-char password must be capped at 20, flagged, or block Next. */
    async expectPasswordLimitHandled(): Promise<void> {
        await this.password.pressSequentially('Abcdefgh1'.repeat(3), { delay: 15 });
        const v = await this.password.inputValue();
        if (v.length <= 20) { expect(v.length).toBeLessThanOrEqual(20); return; }
        await this.username.pressSequentially(SignUpModal.randomMobile(), { delay: 20 });
        await this.firstName.fill('John'); await this.lastName.fill('Tester');
        await this.email.fill('qa.automation.jpc@example.com');
        const proceedable = await this.nextButton.isEnabled().catch(() => false);
        const feedback = await this.errorFeedback.first().isVisible().catch(() => false);
        expect(proceedable === false || feedback, 'a 27-char password must be capped, flagged, or block Next').toBe(true);
    }
    /** TZ signup: the Preferred Language control is shown and offers language options. */
    async expectPreferredLanguageOffered(): Promise<void> {
        const combo = this.page.locator('#preferredLanguage');
        await expect(combo).toBeVisible({ timeout: 10000 });
        await combo.click();
        await expect(this.page.getByRole('option').first()).toBeVisible({ timeout: 8000 });
        await this.page.keyboard.press('Escape').catch(() => { });
    }

    /** A valid registered mobile-number format is accepted and lets the form advance. */
    async expectValidMobileAccepted(): Promise<void> {
        await this.fillValidStepOneExcept('none');
        await expect(this.nextButton).toBeEnabled();
    }
    /** A valid password (per the configured policy) is accepted and lets the form advance. */
    async expectValidPasswordAccepted(): Promise<void> {
        await this.fillValidStepOneExcept('none');
        await expect(this.password).toHaveValue('ValidPass123!');
        await expect(this.nextButton).toBeEnabled();
    }
    async expectFieldAccepts(field: 'firstName' | 'lastName' | 'email', value: string): Promise<void> {
        const input = field === 'firstName' ? this.firstName : field === 'lastName' ? this.lastName : this.email;
        const errKey = field === 'firstName' ? 'firstname' : field === 'lastName' ? 'lastname' : 'email';
        await input.fill(value);
        await input.blur();
        await expect(input).toHaveValue(value);
        await expect(this.fieldError(errKey)).not.toBeVisible();
    }
    async expectInvalidEmailFlagged(): Promise<void> {
        await this.fillValidStepOneExcept('email');
        await this.email.fill('not-an-email@');
        await this.email.blur();
        const errorShown = await this.fieldError('email').isVisible().catch(() => false);
        const blocked = !(await this.nextButton.isEnabled().catch(() => false));
        expect(errorShown || blocked, 'invalid email must show validation or block Next').toBe(true);
    }
    async fillReferralCode(code: string): Promise<void> {
        await this.referralExpander.click();
        await expect(this.referralCode).toBeVisible();
        await this.referralCode.fill(code);
        await expect(this.referralCode).toHaveValue(code);
    }
    async expectIdTypeOptions(): Promise<void> {
        await this.idTypeCombobox.click();
        await expect(this.option(/south african id/i)).toBeVisible();
        await expect(this.option(/passport/i)).toBeVisible();
    }
    async selectPassport(): Promise<void> {
        await this.idTypeCombobox.click();
        await this.option(/passport/i).click();
        await expect(this.idTypeCombobox).toHaveText(/passport/i);
    }
    async expectSaIdDefaultWithField(): Promise<void> {
        await expect(this.idTypeCombobox).toHaveText(/south african id/i);
        await expect(this.idNumber).toBeVisible();
    }
    async expectIdNumberFieldShown(): Promise<void> { await expect(this.idNumber).toBeVisible(); }
    async expectInvalidIdFlagged(value: string): Promise<void> {
        await this.idNumber.fill(value);
        await this.idNumber.blur();
        await expect(this.idNumberError).toBeVisible();
        expect(((await this.idNumberError.textContent()) ?? '').trim().length, 'ID error must have text').toBeGreaterThan(0);
    }
    /** Synthetic passport may be rejected by real validation — returns whether it was flagged. */
    async fillPassportNumber(): Promise<boolean> {
        await this.fillStepTwo('A' + String(Math.floor(10000000 + Math.random() * 89999999)));
        return this.idNumberError.isVisible().catch(() => false);
    }
    async selectFirstDob(): Promise<void> {
        await this.dobButton.click();
        await expect(this.datePanel).toBeVisible();
        await this.firstSelectableDate.click();
        await expect(this.dobButton).toHaveCount(0);
    }
    async expectSourceOptions(): Promise<void> {
        await this.sourceCombobox.click();
        await expect(this.options.first()).toBeVisible();
        expect(await this.options.count(), 'source of income must offer options').toBeGreaterThan(0);
    }
    async expectPromoToggles(): Promise<void> {
        await expect(this.promoCheckboxBox).toHaveAttribute('data-p-checked', 'false');
        await this.promoCheckbox.click();
        await expect(this.promoCheckboxBox).toHaveAttribute('data-p-checked', 'true');
        await this.promoCheckbox.click();
        await expect(this.promoCheckboxBox).toHaveAttribute('data-p-checked', 'false');
    }
    async expectTermsToggles(): Promise<void> {
        await expect(this.termsCheckboxBox).toHaveAttribute('data-p-checked', 'false');
        await this.termsCheckbox.click();
        await expect(this.termsCheckboxBox).toHaveAttribute('data-p-checked', 'true');
        await this.termsCheckbox.click();
        await expect(this.termsCheckboxBox).toHaveAttribute('data-p-checked', 'false');
    }
    async hasAgreeToAll(): Promise<boolean> { return this.agreeToAll.isVisible().catch(() => false); }
    async expectAgreeToAllChecksBoth(): Promise<void> {
        await this.agreeToAll.click();
        await expect(this.termsCheckboxBox).toHaveAttribute('data-p-checked', 'true');
        await expect(this.promoCheckboxBox).toHaveAttribute('data-p-checked', 'true');
    }
    /** Make the consent step (Terms checkbox + T&C/Privacy links) visible. On ZA it lives on
     *  step two; on TZ it is on the first view — so only advance if the links aren't already shown. */
    private async revealConsentStep(): Promise<void> {
        if (await this.termsConditionsLink.isVisible().catch(() => false)) return;
        await this.fillStepOne();
        await this.advanceToStepTwo();
    }

    /** The T&C / Privacy links blend into the consent text; verify each opens its page in a new tab. */
    async expectConsentLinkOpensNewTab(which: 'terms' | 'privacy'): Promise<void> {
        await this.revealConsentStep();
        const link = which === 'terms' ? this.termsConditionsLink : this.privacyPolicyLink;
        const urlPattern = which === 'terms' ? /\/terms-and-conditions/ : /\/privacy-policy/;
        await expect(link).toBeVisible({ timeout: 10000 });
        await expect(link).toHaveAttribute('target', '_blank');
        const popupPromise = this.page.context().waitForEvent('page');
        await link.click();
        const popup = await popupPromise;
        await popup.waitForLoadState('domcontentloaded').catch(() => { });
        await expect(popup).toHaveURL(urlPattern, { timeout: 15000 });
        await popup.close();
    }

    /**
     * UX check: a hyperlink must be visually distinguishable from the text around it — by colour,
     * font-weight, or an underline. The consent T&C/Privacy links currently inherit the exact style
     * of the sentence, so a user can't tell they're clickable; this assertion catches that.
     */
    async expectConsentLinkVisuallyDistinct(which: 'terms' | 'privacy'): Promise<void> {
        await this.revealConsentStep();
        const link = which === 'terms' ? this.termsConditionsLink : this.privacyPolicyLink;
        await expect(link).toBeVisible({ timeout: 10000 });
        const s = await link.evaluate((a: HTMLElement) => {
            const cs = getComputedStyle(a);
            const ps = getComputedStyle(a.parentElement as HTMLElement);
            return {
                linkColor: cs.color, textColor: ps.color,
                linkWeight: cs.fontWeight, textWeight: ps.fontWeight,
                decoration: cs.textDecorationLine,
            };
        });
        const distinct =
            s.decoration.includes('underline') ||
            s.linkColor !== s.textColor ||
            s.linkWeight !== s.textWeight;
        expect(
            distinct,
            `The "${which}" link blends into the consent text — colour ${s.linkColor} vs ${s.textColor}, ` +
            `weight ${s.linkWeight} vs ${s.textWeight}, decoration "${s.decoration}". ` +
            `It has no visual affordance, so users can't tell it is a clickable link.`,
        ).toBe(true);
    }

    /** Fill step two but leave Terms unchecked — registration must stay blocked. */
    async expectRegisterBlockedWithoutTerms(): Promise<void> {
        await this.idNumber.fill('9001015009087');
        await this.dobButton.click({ timeout: 5000 }).catch(() => { });
        await this.firstSelectableDate.click({ timeout: 5000 }).catch(() => { });
        await this.sourceCombobox.click({ timeout: 5000 }).catch(() => { });
        await this.options.first().click({ timeout: 5000 }).catch(() => { });
        await expect(this.registerButton).toBeDisabled();
    }
}
