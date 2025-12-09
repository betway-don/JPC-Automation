import { test } from '../../../fixtures/jackpotCityFixture';
import { runLimitsTests } from '../../../../../common/tests/limits.shared';

test.describe('Limits Tests', () => {
    runLimitsTests(test);
});