import { test } from '../../../fixtures/jackpotCityFixture';
import { runSmokeSecondaryNewSuiteTests } from '../../../../../common/tests/smokeSecondaryNewSuite.shared';

test.describe('GH Smoke — Secondary', () => {
    runSmokeSecondaryNewSuiteTests(test);
});
