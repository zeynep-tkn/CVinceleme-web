import { useLocation } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

// ----------------------------------------------------------------------

type RankedCandidate = {
  candidateId: number;
  nameSurname: string;
  score: number;
  reason: string;
  summary: string;
};

export function RankCandidatesView() {
  const location = useLocation();
  
  // "CV Yükle" sayfasından gönderilen verileri alıyoruz.
  const results: RankedCandidate[] = location.state?.results || [];
  const jobTitle: string = location.state?.jobTitle || 'Belirtilmemiş İş Tanımı';

  // Eğer bir yönlendirme ile gelinmediyse veya sonuç yoksa mesaj göster.
  if (results.length === 0) {
    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 5 }}>
                Aday Sıralama Sonuçları
            </Typography>
            <Alert severity="info">
                Görüntülenecek bir puanlama sonucu bulunamadı. Lütfen &apos;CV Yükle&apos; sayfasından yeni bir puanlama yapın.
            </Alert>
        </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Aday Sıralama Sonuçları
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 5, color: 'text.secondary' }}>
        İş Tanımı: &quot;{jobTitle}&quot;
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '10%' }}>Puan</TableCell>
              <TableCell sx={{ width: '20%' }}>Ad Soyad</TableCell>
              <TableCell sx={{ width: '35%' }}>Değerlendirme Gerekçesi</TableCell>
              <TableCell sx={{ width: '35%' }}>Özet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.candidateId}>
                <TableCell>
                  <Typography variant="h5" component="div">{row.score}</Typography>
                </TableCell>
                <TableCell>{row.nameSurname}</TableCell>
                <TableCell>{row.reason}</TableCell>
                <TableCell>{row.summary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}