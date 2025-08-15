import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

type UploadResult = {
  message: string;
  successfullyProcessed: number;
  failedOrSkippedFiles: number;
  errorDetails: string[];
};

export function UploadView() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadError('Lütfen en az bir dosya seçin.');
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    setUploadResult(null);
    const formData = new FormData();
    files.forEach((file) => formData.append('cvFiles', file));

    try {
      const response = await fetch('https://localhost:7068/api/Analysis/analyze-cv', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP hatası! Durum: ${response.status}`);
      const result: UploadResult = await response.json();
      setUploadResult(result);
      setFiles([]);
    } catch (e) {
      setUploadError(e instanceof Error ? `Yükleme hatası: ${e.message}` : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Toplu CV Yükle
      </Typography>

      <Card sx={{ p: 3 }}>
        <Box
          {...getRootProps()}
          sx={{
            border: `2px dashed ${isDragActive ? 'primary.main' : alpha('#919EAB', 0.2)}`,
            borderRadius: 1,
            p: 5,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': { borderColor: 'primary.main' },
          }}
        >
          <input {...getInputProps()} />
          <Iconify icon="eva:cloud-upload-fill" width={64} sx={{ mb: 2, color: 'text.disabled' }} />
          <Typography>
            CV dosyalarını buraya sürükleyin veya seçmek için tıklayın (.pdf, .docx)
          </Typography>
        </Box>

        {files.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Seçilen Dosyalar:</Typography>
            <List>
              {files.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveFile(file)}>
                      <Iconify icon="eva:close-fill" />
                    </IconButton>
                  }
                >
                  <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleUpload} disabled={isUploading || files.length === 0}>
            {isUploading ? <CircularProgress size={24} /> : `${files.length} CV Yükle`}
          </Button>
        </Stack>

        {uploadError && <Alert severity="error" sx={{ mt: 3 }}>{uploadError}</Alert>}
        {uploadResult && (
          <Alert severity={uploadResult.failedOrSkippedFiles > 0 ? 'warning' : 'success'} sx={{ mt: 3 }}>
            <Typography variant="subtitle2">{uploadResult.message}</Typography>
            <Typography variant="body2">Başarıyla İşlenen: {uploadResult.successfullyProcessed}</Typography>
            <Typography variant="body2">Başarısız/Atlanan: {uploadResult.failedOrSkippedFiles}</Typography>
            {uploadResult.errorDetails.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption">Detaylar:</Typography>
                <List dense>
                  {uploadResult.errorDetails.map((detail, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={detail} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Alert>
        )}
      </Card>
    </Container>
  );
}
