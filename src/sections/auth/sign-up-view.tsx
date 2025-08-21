import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Standart RouterLink kullanıyoruz

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

export function SignUpView() {
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    // Bu kısım daha sonra backend'e bağlanacak.
    console.log('Kayıt olma butonu tıklandı.');
  };


  return (
    <Box sx={{ height: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack alignItems="center" justifyContent="center" sx={{ width: 1, maxWidth: 420, p: 3 }}>
        <Card sx={{ p: { xs: 3, md: 5 }, width: 1 }}>
          <Stack sx={{ mb: 5, alignItems: 'center' }}>
            <Typography variant="h4" >Kayıt Ol</Typography>

          </Stack>

          <Stack spacing={3}>
            <TextField name="fullName" label="Ad Soyad" />
            <TextField name="email" label="E-posta Adresi" />
            <TextField
              name="password"
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
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

          <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            color="inherit"
            onClick={handleRegister}
            sx={{ mt: 3 }}
          >
            Kayıt Ol
          </LoadingButton>



          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              VEYA
            </Typography>
          </Divider>

          <Stack direction="row" spacing={2}>
            <Button fullWidth size="large" color="inherit" variant="outlined">
              <Iconify icon="logos:google-icon" />
            </Button>
          </Stack>

                    <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mt: 2, alignItems: 'center', }}>
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
