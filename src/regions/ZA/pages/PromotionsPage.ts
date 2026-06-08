import { Page } from '@playwright/test';
import { SafeActions } from '../../../common/actions/SafeActions';
import { PromotionsPage as CommonPromotionsPage } from '../../../common/pages/PromotionsPage';

export class PromotionsPage extends CommonPromotionsPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
