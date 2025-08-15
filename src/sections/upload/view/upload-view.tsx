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
  const [files, setFiles] = useState<File[]>([]);
  const [department, setDepartment] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // --- Dosya Yükleme Alanı Fonksiyonları ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  // --- Ana İşlem Fonksiyonu ---
  const handleProcessAndRank = async () => {
    if (files.length === 0) {
      setError('Lütfen en az bir CV dosyası seçin.');
      return;
    }
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

    try {
      // 1. ADIM: Yeni CV'leri Yükle
      const uploadFormData = new FormData();
      files.forEach((file) => uploadFormData.append('cvFiles', file));
      uploadFormData.append('department', department);

      const uploadResponse = await fetch('https://localhost:7068/api/Analysis/analyze-cv', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`CV yükleme hatası! Durum: ${uploadResponse.status}`);
      }
      
      const uploadResult = await uploadResponse.json();
      console.log('Yükleme Sonucu:', uploadResult);


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
        CV Yükle ve Puanla
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
            helperText="Yüklenen CV'lerin atanacağı departman (örn: Yazılım, Mutfak)"
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

          {/* --- Dosya Yükleme Alanı --- */}
          <Box {...getRootProps()} sx={{ p: 3, border: '1px dashed grey', borderRadius: 1, textAlign: 'center', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <Iconify icon="solar:cloud-upload-bold" width={64} sx={{ mb: 1 }} />
            <Typography>Dosyaları buraya sürükleyin veya seçmek için tıklayın</Typography>
          </Box>

          {files.length > 0 && (
             <List>
              {files.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveFile(file)}>
                      <Iconify icon="solar:close-circle-bold" />
                    </IconButton>
                  }
                >
                  <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                </ListItem>
              ))}
            </List>
          )}
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

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
