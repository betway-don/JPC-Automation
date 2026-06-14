import { test } from '../../../fixtures/jackpotCityFixture';
import { runSmokePriorityNewSuiteTests } from '../../../../../common/tests/smokePriorityNewSuite.shared';

test.describe('GH Smoke — Priority', () => {
    runSmokePriorityNewSuiteTests(test);
});
