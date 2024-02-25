import React, { useEffect, useState } from "react";
import {
  Button,
  TablePagination,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectCashOfAccount } from "../../features/cash-of-account/cashOfAccountSlice";
import {
  createCashOfAccount,
  getCashOfAccounts,
} from "../../features/cash-of-account/cashOfAccountActions";



const CATransactionsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cashOfAccountState = useSelector(selectCashOfAccount);
  const {
    items: cashOfAccounts = [],
    currentPage,
    totalCount,
  } = cashOfAccountState.cashOfAccounts;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [value, setValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(getCashOfAccounts(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCreateCA = (values: any) => {
    dispatch(createCashOfAccount(values));
    setOpenModal(false);
  };

  return (
    <div>
       <Button variant="contained" color="primary" onClick={handleOpenModal}>
       Add Journal Entry
      </Button>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount || 0}
        rowsPerPage={rowsPerPage}
        page={currentPage && currentPage > 0 ? currentPage - 1 : 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CA Full name</TableCell>
              <TableCell>Transaction Date</TableCell>
              <TableCell>Transaction Remark</TableCell>
              <TableCell>Pruchase/Invoice Num</TableCell>
              <TableCell>Declaration Num</TableCell>
              <TableCell>Debit</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Account Payable/Recievable Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cashOfAccounts.map((ca: any) => (
              <TableRow key={ca.id}>
                <TableCell>{ca.name}</TableCell>
                <TableCell>{ca.accountType.name}</TableCell>
                <TableCell>{ca.accountSubType.name}</TableCell>
                <TableCell>{ca.name}</TableCell>
                <TableCell>{ca.accountType.name}</TableCell>
                <TableCell>{ca.accountSubType.name}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CATransactionsList;
