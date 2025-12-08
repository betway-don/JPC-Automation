import { test } from '../../../fixtures/jackpotCityFixture';
import { runLimitsTests } from '../../../../../common/tests/limits.shared';

const USER_MOBILE = '620789321';
const USER_PASSWORD = '12345678';

test.describe('Limits Tests', () => {
    runLimitsTests(
        test,
        USER_MOBILE,
        USER_PASSWORD
    );
});