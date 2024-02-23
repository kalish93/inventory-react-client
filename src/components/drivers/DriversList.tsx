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

import DriverForm from './DriverForm';
import { AppDispatch } from '../../app/store';
import { selectDrivers } from '../../features/driver/driverSlice';
import { getDrivers } from '../../features/driver/driverActions';

const DriversList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const driverState = useSelector(selectDrivers);
  const { items: drivers = [], currentPage, totalCount } = driverState.drivers;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getDrivers(page + 1, rowsPerPage));
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
        Add Driver
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
                <TableCell>Truck Number</TableCell>
                <TableCell>Djbouti Phone</TableCell>
                <TableCell>Ethiopia Phone</TableCell>
                <TableCell>Association Name</TableCell>
                <TableCell>Association Phone</TableCell>
                <TableCell>Owner Name</TableCell>
                <TableCell>Owner Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver: any) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.truckNumber}</TableCell>
                <TableCell>{driver.djboutiPhone}</TableCell>
                <TableCell>{driver.ethiopiaPhone}</TableCell>
                <TableCell>{driver.associationName}</TableCell>
                <TableCell>{driver.associationPhone}</TableCell>
                <TableCell>{driver.ownerName}</TableCell>
                <TableCell>{driver.ownerPhone}</TableCell>                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DriverForm open={openModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default DriversList;
