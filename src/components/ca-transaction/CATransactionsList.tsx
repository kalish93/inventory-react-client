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
  ButtonGroup,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectTransactions } from "../../features/ca-transaction/transactionSlice";
import {
  createCATransaction,
  getCATransactions,
} from "../../features/ca-transaction/transactionActions";
import dayjs from "dayjs";
import CATransactionsForm from "./CATransactionsForm";
import JournalEntryForm from "./JournalEntryForm";

const CATransactionsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const CATransactionState = useSelector(selectTransactions);
  const {
    items: CATransactions = [],
    currentPage,
    totalCount,
  } = CATransactionState.transactions;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [value, setValue] = useState(0);
  const [openModal, setOpenModal] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(getCATransactions(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (idx: number) => {
    setOpenModal({ ...openModal, [idx]: true });
  };

  const handleCloseModal = (idx: number) => {
    setOpenModal({ ...openModal, [idx]: false });
  };

  const handleCreateCA = (values: any, idx: number) => {
    dispatch(createCATransaction(values));
    setOpenModal({ ...openModal, [idx]: false });
  };

  return (
    <div>
      <ButtonGroup style={{display:"flex", alignItems:'center', justifyContent:'space-arround'}}>
        {[
          "Add Expense",
          "Add Customer Payment",
          "Add Transport Payment",
          "Add Supplier Payment",
          "Add Journal Entry",
        ].map((text: string, index: number) => (
          <Button
            key={index}
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal(index + 1)}
          >
            {text}
          </Button>
        ))}
      </ButtonGroup>
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
            {CATransactions &&
              CATransactions.map((ca: any) => (
                <TableRow key={ca.id}>
                  <TableCell>{ca.chartofAccount}</TableCell>
                  <TableCell>{dayjs(ca.date).format("YYYY-MM-DD")}</TableCell>
                  <TableCell>{ca.remark}</TableCell>
                  <TableCell>
                    {ca.purchaseNumber
                      ? ca.purchaseNumber
                      : ca.invoiceNumber
                      ? ca.invoiceNumber
                      : null}
                  </TableCell>
                  <TableCell>
                    {ca.declarationNumbers
                      ? ca.declarationNumbers.join(", ")
                      : null}
                  </TableCell>
                  <TableCell>{ca.debit}</TableCell>
                  <TableCell>{ca.credit}</TableCell>
                  <TableCell>{ca.accountDetails}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {[
        { title: "Add Expense", label: "CA Full Name" },
        { title: "Add Customer Payment", label: "Customer Name" },
        { title: "Add Transport Payment", label: "Purchase Number" },
        { title: "Add Supplier Payment", label: "Supplier Name" },
      ].map((item, index) => (
        <CATransactionsForm
          key={index}
          open={openModal[(index + 1) as keyof typeof openModal]}
          handleClose={() => handleCloseModal(index + 1)}
          title={item.title}
          formLabel={item.label}
        />
      ))}
      <JournalEntryForm
        open={openModal[5]}
        handleClose={() => handleCloseModal(5)}
      />
    </div>
  );
};

export default CATransactionsList;
