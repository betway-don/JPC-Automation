import { test } from '../../../fixtures/jackpotCityFixture';
import { runSignUpNewSuiteTests } from '../../../../../common/tests/signUpNewSuite.shared';

test.describe('TZ Sign Up Tests', () => {
    runSignUpNewSuiteTests(test);
});
