import { test } from '../../../fixtures/jackpotCityFixture';
import { runSignupTests } from '../../../../../common/tests/signup.shared';

test.describe('GH Signup Tests', () => {
    runSignupTests(test, '/');
});
