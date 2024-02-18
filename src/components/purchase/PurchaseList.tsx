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
import { AppDispatch } from '../../app/store';
import { selectPurchase } from '../../features/purchase/purchaseSlice';
import { getPurchases } from '../../features/purchase/purchaseActions';
import PurchaseForm from './PurchaseForm';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const PurchaseList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const PurchaseState = useSelector(selectPurchase);
  const { items: purchases = [], currentPage, totalCount } = PurchaseState.purchases;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getPurchases(page + 1, rowsPerPage));
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
       Add Purchase
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
              <TableCell>Purchase Number</TableCell>
              <TableCell>Purchase Date</TableCell>
              <TableCell>Track Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((purchase: any) => (
              <TableRow key={purchase.id} component={Link} to={`/purchases/${purchase.id}`} style={{ textDecoration: 'none' }}>
                <TableCell>{purchase.number }</TableCell>
                <TableCell>{dayjs(purchase.date).format("YYYY-MM-DD")}</TableCell>
                <TableCell>{purchase.truckNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PurchaseForm open={openModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default PurchaseList;
