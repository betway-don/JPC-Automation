import { test } from '../../../fixtures/jackpotCityFixture';
import { runTransactionHistoryNewSuiteTests } from '../../../../../common/tests/transactionHistoryNewSuite.shared';

test.describe('TZ Transaction History Tests', () => {
    runTransactionHistoryNewSuiteTests(test);
});
