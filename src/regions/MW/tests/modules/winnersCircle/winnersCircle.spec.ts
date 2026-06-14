import { test } from '../../../fixtures/jackpotCityFixture';
import { runWinnersCircleNewSuiteTests } from '../../../../../common/tests/winnersCircleNewSuite.shared';

// Skipped pending MW discovery: confirm whether MW has a Winners Circle (header `page-link-winners`
// nav + /winners route). If present, remove `.skip` to run the shared suite; if absent (like GH),
// keep it skipped so it's explicit rather than silently missing.
test.describe.skip('MW Winners Circle Tests (pending MW discovery)', () => {
    runWinnersCircleNewSuiteTests(test);
});
