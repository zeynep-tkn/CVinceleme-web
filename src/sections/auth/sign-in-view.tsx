import axios from 'axios';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card'; 
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';


export function SignInView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Form alanları ve durum yönetimi için state'ler
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClick = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://localhost:7068/api/Auth/login', {
        email,
        password,
      });

      if (response.data && response.data.token) {
        // Gelen token'ı tarayıcının yerel deposuna kaydet
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userName', response.data.userName);
        
        // Giriş başarılı, ana sayfaya yönlendir
        router.push('/');
      }
    } catch (err: any) {
      // Hata durumunda backend'den gelen mesajı veya genel bir hata mesajını göster
      setError(err.response?.data || 'Geçersiz e-posta veya şifre.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack alignItems="center" justifyContent="center" sx={{ width: 1, maxWidth: 420, p: 3 }}>
        <Card sx={{ p: { xs: 3, md: 5 }, width: 1 }}>
          <Stack sx={{ mb: 3, alignItems: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Giriş Yap</Typography>
          </Stack>

          <Stack spacing={3}>
            <TextField 
              name="email" 
              label="E-posta Adresi" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              name="password"
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Stack alignItems="flex-end" sx={{ my: 3 }}>
            <Link variant="body2" color="inherit" underline="always">
              Şifreni mi unuttun?
            </Link>
          </Stack>

          {/* Hata mesajını göstermek için */}
          {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}

          <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            color="inherit"
            loading={loading}
            onClick={handleClick}
          >
            Giriş Yap
          </LoadingButton>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            Hesabın yok mu?{' '}
            <Link component={RouterLink} to="/sign-up" variant="subtitle2">
              Kayıt ol
            </Link>
          </Typography>
        </Card>
      </Stack>
    </Box>
  );
}
