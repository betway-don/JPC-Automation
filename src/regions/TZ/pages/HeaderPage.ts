import { Page } from '@playwright/test';
import { HeaderPage as CommonHeaderPage } from '../../../common/pages/HeaderPage';
import { SafeActions } from '../../../common/actions/SafeActions';

export class HeaderPage extends CommonHeaderPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
