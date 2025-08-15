import { CONFIG } from 'src/config-global';

import { SignInView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Giriş Yap - ${CONFIG.appName}`}</title>

      <SignInView />
    </>
  );
}
