import { test } from '../../../fixtures/jackpotCityFixture';
import { runUpdatePasswordTests } from '../../../../../common/tests/updatePassword.shared';

test.describe('MW Update Password Tests', () => {
    runUpdatePasswordTests(test);
});
