import { test } from '../../../fixtures/jackpotCityFixture';
import { runPromotionsNewSuiteTests } from '../../../../../common/tests/promotionsNewSuite.shared';

test.describe('GH Promotions Tests', () => {
    runPromotionsNewSuiteTests(test, '/');
});
