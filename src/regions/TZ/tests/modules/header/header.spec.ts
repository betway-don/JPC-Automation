import { test } from '../../../fixtures/jackpotCityFixture';
import { runHeaderTests } from '../../../../../common/tests/header.shared';

test.describe('Header Tests', () => {
    runHeaderTests(
        test,
        'https://www.jackpotcity.co.tz/'
    );
});
