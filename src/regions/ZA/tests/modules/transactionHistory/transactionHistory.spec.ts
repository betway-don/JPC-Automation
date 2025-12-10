import { test } from '../../../fixtures/jackpotCityFixture';
import { runTransactionHistoryTests } from '../../../../../common/tests/transactionHistory.shared';



test.describe('ZA Transaction History Tests', () => {
    runTransactionHistoryTests(test);
});