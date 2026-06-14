import { test } from '../../../fixtures/jackpotCityFixture';
import { runSmokePriorityNewSuiteTests } from '../../../../../common/tests/smokePriorityNewSuite.shared';

test.describe('MW Smoke — Priority', () => {
    runSmokePriorityNewSuiteTests(test);
});
