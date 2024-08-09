import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
  TablePagination,
} from "@mui/material";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { selectBank } from "../../features/bank/bankSlice";
import { getBank, getBankTransactions } from "../../features/bank/bankActions";

const BankDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const bankState = useSelector(selectBank);
  const { loading, bank } = bankState;
  const {
    items: bankTransactions = [],
    currentPage,
    totalCount,
  } = bankState.bankTransactions;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getBank(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getBankTransactions(id, page + 1, rowsPerPage));
  }, [dispatch, id, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(bank, bankState);

  if (loading || !bank) {
    return <CircularProgress />;
  }
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Bank Name: {bank.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Bank Start Date: {dayjs(bank.startingValueDate).format("MM/DD/YYYY")}
      </Typography>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100, 250]}
        component="div"
        count={totalCount || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Payee</TableCell>
              <TableCell>Foreign Currency</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Deposit</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>CA</TableCell>
              <TableCell>Exchange Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bankTransactions.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{dayjs(item.date).format("MM/DD/YYYY")}</TableCell>
                <TableCell>{item.payee}</TableCell>
                <TableCell>{item.foreignCurrency?.toLocaleString()}</TableCell>
                <TableCell>{item.payment?.toLocaleString()}</TableCell>
                <TableCell>{item.deposit?.toLocaleString()}</TableCell>
                <TableCell>{item.balance?.toLocaleString()}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  {item.cashOfAccount ? item.cashOfAccount.name : null}
                </TableCell>
                <TableCell>{item.exchangeRate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BankDetail;
