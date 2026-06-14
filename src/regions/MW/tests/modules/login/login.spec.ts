import { test } from '../../../fixtures/jackpotCityFixture';
import { runLoginNewSuiteTests } from '../../../../../common/tests/loginNewSuite.shared';

test.describe('MW Login Tests', () => {
    runLoginNewSuiteTests(test);
});
