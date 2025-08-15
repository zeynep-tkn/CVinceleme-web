import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Ana Sayfa',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Adaylar',
    path: '/candidate',
    icon: icon('ic-user'),
  },
  {
    title: 'CV Yükle',
    path: '/upload',
    icon: icon('ic-upload'),
  },
  {
    title: 'Aday Sırala',
    path: '/rank',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Giriş Yap',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
];
