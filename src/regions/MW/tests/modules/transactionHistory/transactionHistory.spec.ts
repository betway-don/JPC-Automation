import { test } from '../../../fixtures/jackpotCityFixture';
import { runTransactionHistoryNewSuiteTests } from '../../../../../common/tests/transactionHistoryNewSuite.shared';

test.describe('MW Transaction History Tests', () => {
    runTransactionHistoryNewSuiteTests(test);
});
