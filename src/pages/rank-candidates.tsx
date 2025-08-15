import { _posts } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { AdaySiralaView } from 'src/sections/rankCandidates/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Aday Sırala - ${CONFIG.appName}`}</title>

      <AdaySiralaView posts={_posts} />
    </>
  );
}
