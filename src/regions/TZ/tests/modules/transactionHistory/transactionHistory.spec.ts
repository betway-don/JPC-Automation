import { test } from '../../../fixtures/jackpotCityFixture';
import { runTransactionHistoryTests } from '../../../../../common/tests/transactionHistory.shared';

const USER_MOBILE = '620789321';
const USER_PASSWORD = '12345678';

test.describe('TZ Transaction History Tests', () => {
    runTransactionHistoryTests(
        test,
        USER_MOBILE,
        USER_PASSWORD
    );
});
