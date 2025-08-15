import { _posts } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { RankCandidatesView } from 'src/sections/rank/view';

// ----------------------------------------------------------------------

export default function RankCandidatesPage() {
  return (
    <>
      <title>{`Aday Sırala - ${CONFIG.appName}`}</title>

      <RankCandidatesView />
    </>
  );
}
