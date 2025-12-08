import { Page } from '@playwright/test';
import { SafeActions } from '../../../common/actions/SafeActions';
import { TransactionHistoryPage as CommonTransactionHistoryPage } from '../../../common/pages/TransactionHistoryPage';

export class TransactionHistoryPage extends CommonTransactionHistoryPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
