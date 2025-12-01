import { Page } from '@playwright/test';
import { LoginPage as CommonLoginPage } from '../../../common/pages/LoginPage';
import { SafeActions } from '../../../common/actions/SafeActions';

export class LoginPage extends CommonLoginPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
