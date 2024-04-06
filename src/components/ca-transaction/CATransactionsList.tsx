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
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";
import SupplierPaymentForm from "./SupplierPaymentForm";
import Menu, { MenuProps } from "@mui/material/Menu";
import { styled, alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CustomerPaymentForm from "./CustomerPaymentForm";
import ExpensesPaymentForm from "./ExpensesPaymentForm";
import TransportExpensePayment from "./TransportExpensePayment";
import CustomTaxPayment from "./CustomTaxPayment";
import TransitPayment from "./TransitPayment";
import ESLPayment from "./ESLPayment";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

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
  const [openModal, setOpenModal] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

  const handleClose = () => {
    setAnchorEl(null);
  };

  console.log("CATransactions", CATransactions);
  return (
    <div>
      {hasPermission(PERMISSIONS.CreateCaTransaction) && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal(8)}
        >
          Add Journal Enty
        </Button>
      )}

      {hasPermission(PERMISSIONS.GetCaTransactions) && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount || 0}
          rowsPerPage={rowsPerPage}
          page={currentPage && currentPage > 0 ? currentPage - 1 : 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
      {hasPermission(PERMISSIONS.GetCaTransactions) && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction Date</TableCell>
                <TableCell>Transaction Type</TableCell>
                <TableCell>Purchase/Invoice Num</TableCell>
                <TableCell>Transaction Remark</TableCell>
                <TableCell>Debit</TableCell>
                <TableCell>Credit</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>CA Full name</TableCell>
                <TableCell>Exchange Rate</TableCell>
                <TableCell>USD Amount</TableCell>
                <TableCell>Account Receivable/Payable details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CATransactions &&
                CATransactions.map((ca: any) => (
                  <TableRow key={ca.id}>
                    <TableCell>{dayjs(ca.date).format("DD/MM/YYYY")}</TableCell>
                    <TableCell>{ca.type}</TableCell>
                    <TableCell>
                      {ca.purchase?.number ||
                        ca.sale?.invoiceNumber ||
                        (ca.number === 1
                          ? ca.number
                          : ca.number === 0
                          ? "START"
                          : null)}
                    </TableCell>
                    <TableCell>{ca.remark}</TableCell>
                    <TableCell>{ca.debit?.toLocaleString()}</TableCell>
                    <TableCell>{ca.credit?.toLocaleString()}</TableCell>
                    <TableCell>
                      {ca.productPurchase?.product?.name ??
                        ca.saleDetail?.product?.name ??
                        ca.productDeclaration?.product?.name}
                    </TableCell>
                    <TableCell>
                      {ca.customer
                        ? ca.customer?.firstName + " " + ca.customer?.lastName
                        : null}
                    </TableCell>
                    <TableCell>{ca.supplier?.name}</TableCell>
                    <TableCell>
                      {ca.chartofAccount?.name ??
                        ca.bankTransaction?.bank?.name}
                    </TableCell>
                    <TableCell>{ca.exchangeRate}</TableCell>
                    <TableCell>{ca.USDAmount}</TableCell>
                    <TableCell>{ca.accountPayableRecievableDetail}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <JournalEntryForm
        open={openModal[8]}
        handleClose={() => handleCloseModal(8)}
      />
    </div>
  );
};

export default CATransactionsList;
