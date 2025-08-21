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


export function SignUpView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://localhost:7068/api/Auth/register', {
        userName, 
        email,
        password,
      });

      if (response.status === 200) {
        // Kayıt başarılı olduğunda kullanıcıyı giriş yapma sayfasına yönlendir
        router.push('/sign-in');
      }
    } catch (err: any) {
      // Hata durumunda backend'den gelen mesajı veya genel bir hata mesajını göster
      setError(err.response?.data || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box sx={{ height: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack alignItems="center" justifyContent="center" sx={{ width: 1, maxWidth: 420, p: 3 }}>
        <Card sx={{ p: { xs: 3, md: 5 }, width: 1 }}>
          <Stack sx={{ mb: 3, alignItems: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Kayıt Ol</Typography>
          </Stack>

          <Stack spacing={3}>
            <TextField
              name="userName"
              label="Kullanıcı Adı"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
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

          {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}


          <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            color="inherit"
            loading={loading} 
            onClick={handleRegister}
            sx={{ mt: 3 }}
          >
            Kayıt Ol
          </LoadingButton>





          {/* <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              VEYA
            </Typography>
          </Divider>

          <Stack direction="row" spacing={2}>
            <Button fullWidth size="large" color="inherit" variant="outlined">
              <Iconify icon="logos:google-icon" />
            </Button>
          </Stack> */}

                    <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mt: 3 }}>
            <Typography variant="body2">Hesabın var mı?</Typography>
            <Link component={RouterLink} to="/sign-in" variant="subtitle2">
              Giriş Yap
            </Link>
          </Stack>
        </Card>
      </Stack>
    </Box>

  );
}
