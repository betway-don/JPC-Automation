import { Page } from '@playwright/test';
import { SignUpPage as CommonSignUpPage } from '../../../common/pages/SignUpPage';
import { SafeActions } from '../../../common/actions/SafeActions';

export class SignUpPage extends CommonSignUpPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
