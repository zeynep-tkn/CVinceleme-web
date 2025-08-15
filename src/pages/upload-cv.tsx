import { CONFIG } from 'src/config-global';

import { CVView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`CV Yükle - ${CONFIG.appName}`}</title>

      <CVView />
    </>
  );
}
