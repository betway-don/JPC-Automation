import { test } from '../../../fixtures/jackpotCityFixture';
import { runTransactionHistoryNewSuiteTests } from '../../../../../common/tests/transactionHistoryNewSuite.shared';

test.describe('ZA Transaction History Tests', () => {
    runTransactionHistoryNewSuiteTests(test);
});