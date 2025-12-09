import { Page } from '@playwright/test';
import { UpdatePasswordPage as CommonUpdatePasswordPage } from '../../../common/pages/UpdatePasswordPage';
import { SafeActions } from '../../../common/actions/SafeActions';

export class UpdatePasswordPage extends CommonUpdatePasswordPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
