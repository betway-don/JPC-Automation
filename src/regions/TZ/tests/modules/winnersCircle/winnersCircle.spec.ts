import { test } from '../../../fixtures/jackpotCityFixture';
import { runWinnersCircleNewSuiteTests } from '../../../../../common/tests/winnersCircleNewSuite.shared';

// TZ HAS a Winners Circle (unlike GH), so the shared suite runs here.
test.describe('TZ Winners Circle Tests', () => {
    runWinnersCircleNewSuiteTests(test);
});
