import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Iconify } from 'src/components/iconify';
import {Scrollbar} from 'src/components/scrollbar';

import {TableNoData} from '../table-no-data';
import {UserTableRow} from '../user-table-row';
import {UserTableHead} from '../user-table-head';
import {TableEmptyRows} from '../table-empty-rows';
import {UserTableToolbar} from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';


type Candidate = {
  id: number;
  nameSurname: string;
  summary: string;
};


export function UserView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  // DÜZELTME: Varsayılan sıralama alanı 'name' yerine 'nameSurname' olarak değiştirildi.
  const [orderBy, setOrderBy] = useState('nameSurname');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // .NET API'nizin çalıştığından ve doğru portta olduğundan emin olun.
        const response = await fetch('https://localhost:7068/api/Candidates');
        if (!response.ok) {
          throw new Error(`HTTP hatası! durum: ${response.status}`);
        }
        const data: Candidate[] = await response.json();
        setCandidates(data);
      } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("Bilinmeyen bir hata oluştu");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);


  const handleSort = (event: React.MouseEvent<unknown>, id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = candidates.map((n) => n.nameSurname);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: candidates,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  if (loading) {
    return <Typography>Adaylar yükleniyor...</Typography>
  }

  if (error) {
    return <Typography>Hata: {error}. Backend APInizin çalıştığından ve CORS ayarlarının doğru olduğundan emin olun.</Typography>
  }


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Adaylar</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />}>
          Yeni Aday
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
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
                numSelected={selected.length}
                // onSort={handleSort}
                // onSelectAllRows={handleSelectAllClick}
                headLabel={[
                  { id: 'nameSurname', label: 'İsim Soyisim' },
                  { id: 'summary', label: 'Özet' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((candidate) => (
                    <UserTableRow
                      key={candidate.id}
                      row={{
                        avatarUrl: `/assets/images/avatar/avatar_${(candidate.id % 25) + 1}.jpg`,
                        name: candidate.nameSurname,
                        id: candidate.id,
                        company: "eroğlu",
                        isVerified: true,
                        role: "uzman",
                        status: "aktif"
                      }}
                      selected={selected.indexOf(candidate.nameSurname) !== -1} 
                      onSelectRow={()=> {
                       alert("satırı seçtin babayiğit"); 
                      } }                      
                      // handleClick={() => handleClick(candidate.nameSurname)}
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
