import { Page } from '@playwright/test';
import { SafeActions } from '../../../common/actions/SafeActions';
import { SignUpPage as CommonSignUpPage } from '../../../common/pages/SignUpPage';

export class SignUpPage extends CommonSignUpPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
