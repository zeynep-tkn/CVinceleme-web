import { CONFIG } from 'src/config-global';

import { SignUpView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function SignUpPage() {
  return (
    <>
        <title>{`Kayıt Ol - ${CONFIG.appName}`}</title>
      <SignUpView />
    </>
  );
}