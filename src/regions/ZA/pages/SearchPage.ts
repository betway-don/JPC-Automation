import { Page } from '@playwright/test';
import { SearchPage as CommonSearchPage } from '../../../common/pages/SearchPage';
import { SafeActions } from '../../../common/actions/SafeActions';

export class SearchPage extends CommonSearchPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
