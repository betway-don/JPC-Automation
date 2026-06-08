import { test } from '../../../fixtures/jackpotCityFixture';
import { runPromotionsNewSuiteTests } from '../../../../../common/tests/promotionsNewSuite.shared';

test.describe('Promotions Test Cases', () => {
    runPromotionsNewSuiteTests(test, '/promotions');
});
