import { Page } from '@playwright/test';
import { SafeActions } from '../../../common/actions/SafeActions';
import { LimitsPage as CommonLimitsPage } from '../../../common/pages/LimitsPage';

export class LimitsPage extends CommonLimitsPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
