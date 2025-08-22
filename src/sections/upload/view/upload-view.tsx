import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function UploadView() {
  // --- State'ler ---
  const [department, setDepartment] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // --- Ana İşlem Fonksiyonu ---
  const handleProcessAndRank = async () => {
    if (!department) {
      setError('Lütfen bir departman adı girin.');
      return;
    }
    if (!jobDescription) {
      setError('Lütfen bir iş tanımı girin.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const analyzeFormData = new FormData();
      analyzeFormData.append('department', department);
      analyzeFormData.append('jobDescription', jobDescription);

      const analyzeResponse = await fetch(
        'https://localhost:7068/api/Analysis/analyze-cvs-from-folder',
        {
          method: 'POST',
          body: analyzeFormData,
        }
      );

      if (!analyzeResponse.ok) {
        throw new Error(`CV analiz hatası! Durum: ${analyzeResponse.status}`);
      }

      const analyzeResult = await analyzeResponse.json();
      console.log('Analiz Sonucu:', analyzeResult);
      // Kullanıcıya bilgi vermek için bir başarı mesajı ayarlıyoruz.
      setSuccessMessage(
        `${analyzeResult.successfullyProcessed} yeni CV başarıyla veritabanına eklendi. Şimdi puanlama yapılıyor...`
      );

      // 2. ADIM: Adayları Puanla
      const rankResponse = await fetch('https://localhost:7068/api/Candidates/rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: jobDescription, department }),
      });
      if (!rankResponse.ok) throw new Error(`Puanlama hatası! Durum: ${rankResponse.status}`);

      const rankingResult = await rankResponse.json();

      // 3. ADIM: Sonuçlarla Birlikte Sıralama Sayfasına Yönlendir
      navigate('/rank', { state: { results: rankingResult, jobTitle: jobDescription } });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Yeni Analiz Başlat ve Puanla
      </Typography>

      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* --- Form Alanları --- */}
          <TextField
            label="Departman"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            fullWidth
            required
            helperText="Analiz edilecek CV'lerin atanacağı departman (örn: Yazılım, Mutfak)"
          />
          <TextField
            label="İş Tanımı"
            multiline
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            fullWidth
            required
            helperText="Bu departman için aradığınız pozisyonun özelliklerini girin."
          />

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Alert severity="info">
            Bu işlem, sunucunun Cvs klasöründeki tüm yeni CVleri analiz edecek ve ardından
            belirttiğiniz iş tanımına göre puanlayacaktır.
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && !error && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}

          {/* --- Buton --- */}
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleProcessAndRank}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Puanla ve Sonuçları Göster'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}
