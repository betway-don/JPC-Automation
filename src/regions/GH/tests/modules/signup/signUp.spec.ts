import { test } from '../../../fixtures/jackpotCityFixture';
import { runSignupTests } from '../../../../../common/tests/signup.shared';

const GH_URL = 'https://www.jackpotcity.com.gh/';

test.describe('GH Signup Tests', () => {
    runSignupTests(test, GH_URL);
});
