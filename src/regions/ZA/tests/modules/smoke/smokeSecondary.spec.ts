import { test } from '../../../fixtures/jackpotCityFixture';
import { runSmokeSecondaryNewSuiteTests } from '../../../../../common/tests/smokeSecondaryNewSuite.shared';

test.describe('ZA Smoke — Secondary', () => {
    runSmokeSecondaryNewSuiteTests(test);
});
