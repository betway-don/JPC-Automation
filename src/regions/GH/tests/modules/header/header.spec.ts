import { test } from '../../../fixtures/jackpotCityFixture';
import { runHeaderTests } from '../../../../../common/tests/header.shared';

const GH_URL = 'https://www.jackpotcity.com.gh/';

test.describe('GH Header Tests', () => {
    runHeaderTests(test, GH_URL);
});
