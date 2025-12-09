import { test } from '../../../fixtures/jackpotCityFixture';
import { runSignupTests } from '../../../../../common/tests/signup.shared';

test.describe('Jackpot City Signup Tests', () => {
    runSignupTests(test, '/');
});
