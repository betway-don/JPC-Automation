import { test } from '../../../fixtures/jackpotCityFixture';
import { runUpdatePasswordTests } from '../../../../../common/tests/updatePassword.shared';

test.describe('GH Update Password Tests', () => {
    runUpdatePasswordTests(test);
});
