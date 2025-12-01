import { Page } from '@playwright/test';
import { SafeActions } from '../../../common/actions/SafeActions';
import { HeaderPage as CommonHeaderPage } from '../../../common/pages/HeaderPage';

export class HeaderPage extends CommonHeaderPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
