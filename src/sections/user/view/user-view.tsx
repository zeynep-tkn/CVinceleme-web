import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

type Candidate = {
  id: number;
  nameSurname: string;
  department: string | null;
  score: number | null;
  cvFilePath: string | null;
  reason: string | null;
};

// ----------------------------------------------------------------------

export function UserView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('nameSurname');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const apiBaseUrl = 'https://localhost:7068';

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/Candidates`);
        setCandidates(response.data);
      } catch (error) {
        console.error("Adaylar getirilirken hata oluştu:", error);
      }
    };
    fetchCandidates();
  }, []);

  //handleSort fonksiyonu UserTableHead'in beklediği tipe uyarlandı.
  const handleSort = (id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteCandidate = async (id: number) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/Candidates/${id}`);
      setCandidates(candidates.filter(candidate => candidate.id !== id));
    } catch (error) {
      console.error("Aday silinirken hata oluştu:", error);
    }
  };

  const handleRowClick = (cvPath: string | null) => {
    if (cvPath) {
      const fileUrl = `${apiBaseUrl}/${cvPath.replace(/\\/g, '/')}`;
      window.open(fileUrl, '_blank');
    } else {
      alert("Bu aday için bir CV dosyası bulunamadı.");
    }
  };

  const dataFiltered = applyFilter({
    inputData: candidates,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Adaylar
      </Typography>

      <Card>
        <UserTableToolbar
          numSelected={0}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={candidates.length}
                numSelected={0}
                onSort={handleSort}
                headLabel={[
                  { id: 'nameSurname', label: 'İsim' },
                  { id: 'department', label: 'Departman' },
                  { id: 'reason', label: 'Değerlendirme Gerekçesi' },
                  { id: 'score', label: 'Puan Durumu' },
                  { id: '' },
                ]}
              />
             <TableBody>
                {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (

                <UserTableRow
                  key={row.id}
                  id={row.id}
                  nameSurname={row.nameSurname}
                  department={row.department || 'Belirtilmemiş'}
                  reason={row.reason || '-'} 
                  score={row.score}
                  onDelete={handleDeleteCandidate}
                  onRowClick={() => handleRowClick(row.cvFilePath)}
                />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, candidates.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={candidates.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}