import { Page } from '@playwright/test';
import { SafeActions } from '../../../common/actions/SafeActions';
import { LoginPage as CommonLoginPage } from '../../../common/pages/LoginPage';

export class LoginPage extends CommonLoginPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}