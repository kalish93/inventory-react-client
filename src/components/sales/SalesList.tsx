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
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { selectSale } from '../../features/sales/salseSlice';
import { AppDispatch } from '../../app/store';
import { getSales } from '../../features/sales/salesActions';
import SaleForm from './SaleForm';

const SalesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const SalesState = useSelector(selectSale);
  const { items: sales = [], currentPage, totalCount } = SalesState.sales;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getSales(page + 1, rowsPerPage));
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
       Add Sale
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
              <TableCell>Invoice Number</TableCell>
              <TableCell>Invoice Date</TableCell>
              <TableCell>Customer Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale: any) => (
              <TableRow key={sale.id} component={Link} to={`/sales/${sale.id}`} style={{ textDecoration: 'none' }}>
                <TableCell>{sale.invoiceNumber }</TableCell>
                <TableCell>{dayjs(sale.invoiceDate).format("YYYY-MM-DD")}</TableCell>
                <TableCell>{sale.customer.firstName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SaleForm open={openModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default SalesList;