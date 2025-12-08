import { test } from '../../../fixtures/jackpotCityFixture';
import { runTransactionHistoryTests } from '../../../../../common/tests/transactionHistory.shared';

const USER_MOBILE = '866224461';
const USER_PASSWORD = 'Jackpot@1234';

test.describe('MW Transaction History Tests', () => {
    runTransactionHistoryTests(
        test,
        USER_MOBILE,
        USER_PASSWORD
    );
});
