import { test } from '../../../fixtures/jackpotCityFixture';
import { runSignUpNewSuiteTests } from '../../../../../common/tests/signUpNewSuite.shared';

test.describe('GH Sign Up Tests', () => {
    runSignUpNewSuiteTests(test);
});
