import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
} from '@mui/material';

import StoreForm from './StoreForm';
import { AppDispatch } from '../../app/store';
import { selectStore } from '../../features/store/storeSlice';
import { getStores } from '../../features/store/storeActions';

const StoresList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const storeState = useSelector(selectStore);
  const { items: stores = [], currentPage, totalCount } = storeState.stores;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getStores(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add store
      </Button>
      <TablePagination
         rowsPerPageOptions={[5, 10, 25]}
         component="div"
         count={totalCount || 0}
         rowsPerPage={rowsPerPage}
         page={(currentPage && currentPage > 0) ? currentPage - 1 : 0}
         onPageChange={handleChangePage}
         onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((driver: any) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.address}</TableCell>                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <StoreForm open={openModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default StoresList;
