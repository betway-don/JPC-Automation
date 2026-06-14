import { test } from '../../../fixtures/jackpotCityFixture';
import { runWinnersCircleNewSuiteTests } from '../../../../../common/tests/winnersCircleNewSuite.shared';

// GH has NO Winners Circle feature: the header has no `page-link-winners` nav tab and there is no
// /winners route or winners link anywhere on the GH site (verified by DOM probe 2026-06-12 —
// winnersAnywhere=[], no nav button). The ZA Winners suite is therefore not applicable to GH.
// Kept (skipped) so it's explicit, not silently missing; remove only if GH never gains the feature.
test.describe.skip('GH Winners Circle Tests (feature absent on GH)', () => {
    runWinnersCircleNewSuiteTests(test);
});
