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
    icon: icon('ic-home'),
  },
  {
    title: 'Adaylar',
    path: '/candidate',
    icon: icon('ic-candidates'),
  },
  {
    title: 'Analize Başla',
    path: '/start-analysis',
    icon: icon('ic-upload'),//yükleme iconu değiştir
  },
  {
    title: 'Aday Sırala',
    path: '/rank',
    icon: icon('ic-rank'),
  },
  {
    title: 'Giriş Yap',
    path: '/sign-in',
    icon: icon('ic-signin'),
  },
];
