import { test } from '../../../fixtures/jackpotCityFixture';
import { runVerticalPagesTests, VERTICALS } from '../../../../../common/tests/verticalPagesNewSuite.shared';

test.describe('MW Vertical Pages Tests', () => {
    for (const vertical of VERTICALS) {
        runVerticalPagesTests(test, vertical);
    }
});
