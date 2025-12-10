import { test } from '../../../fixtures/jackpotCityFixture';
import { runTransactionHistoryTests } from '../../../../../common/tests/transactionHistory.shared';

test.describe('TZ Transaction History Tests', () => {
    runTransactionHistoryTests(test);
});
