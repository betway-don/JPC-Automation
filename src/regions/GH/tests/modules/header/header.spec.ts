import { test } from '../../../fixtures/jackpotCityFixture';
import { runHeaderTests } from '../../../../../common/tests/header.shared';

test.describe('GH Header Tests', () => {
    runHeaderTests(test, '/');
});
