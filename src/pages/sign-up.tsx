import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// DÜZELTME: Artık 'SignUpView' 'index.ts' üzerinden doğru şekilde gelecek.
import { SignUpView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function SignUpPage() {
  return (
    <>
      <Helmet>
        <title>{`Kayıt Ol - ${CONFIG.appName}`}</title>
      </Helmet>

      <SignUpView />
    </>
  );
}