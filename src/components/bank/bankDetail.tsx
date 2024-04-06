import React, { useEffect } from "react";
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
} from "@mui/material";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { selectBank } from "../../features/bank/bankSlice";
import { getBank } from "../../features/bank/bankActions";

const BankDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const bankState = useSelector(selectBank);
  const bank = bankState.bank;

  useEffect(() => {
    dispatch(getBank(id));
  }, [dispatch, id]);

  console.log(bank);
  if (!bank) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Bank Name: {bank.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Bank Start Date: {dayjs(bank.startingValueDate).format("DD/MM/YYYY")}
      </Typography>

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
            {bank.bankTransactions.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{dayjs(item.date).format("DD/MM/YYYY")}</TableCell>
                <TableCell>{item.payee}</TableCell>
                <TableCell>{item.foreignCurrency}</TableCell>
                <TableCell>{item.payment}</TableCell>
                <TableCell>{item.deposit}</TableCell>
                <TableCell>{item.balance}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  {item.chartofAccount ? item.chartofAccount.name : null}
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
