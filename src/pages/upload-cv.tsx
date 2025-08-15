import { CONFIG } from 'src/config-global';

import { UploadView } from 'src/sections/upload/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`CV Yükle - ${CONFIG.appName}`}</title>

      <UploadView />
    </>
  );
}
