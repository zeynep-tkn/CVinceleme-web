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
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'CV Yükle',
    path: '/products',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Aday Sırala',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Giriş Yap',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  {
    title: 'Ayarlar',
    path: '/404',
    icon: icon('ic-disabled'),
  },
];
