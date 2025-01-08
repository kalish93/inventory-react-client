// Desc: This file contains the CashOfAccountList component which is a list of cash of accounts.
import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Button,
  TablePagination,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import AccountTypeList from "./account-types/AccountTypeList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectCashOfAccount } from "../../features/cash-of-account/cashOfAccountSlice";
import {
  createCashOfAccount,
  getCashOfAccounts,
} from "../../features/cash-of-account/cashOfAccountActions";
import CreateCashOfAccountForm from "./CashOfAccountForm";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";

const TabPanel = (props: {
  [x: string]: any;
  children: any;
  value: any;
  index: any;
}) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const CashOfAccountList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cashOfAccountState = useSelector(selectCashOfAccount);
  const {
    items: cashOfAccounts = [],
    currentPage,
    totalCount,
  } = cashOfAccountState.cashOfAccounts;
  const { loading } = cashOfAccountState;
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

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
        centered
      >
        <Tab label="Chart of accounts" />
        <Tab label="Account types" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Chart of Accounts</Typography>
          {hasPermission(PERMISSIONS.CreateChartOfAccount) && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
            >
              Add CA
            </Button>
          )}
        </div>
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
                <TableCell>Account Type</TableCell>
                <TableCell>Account Sub Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cashOfAccounts.map((ca: any) => (
                <TableRow key={ca.id}>
                  <TableCell>{ca.name}</TableCell>
                  <TableCell>{ca.accountType.name}</TableCell>
                  <TableCell>{ca.accountSubType.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AccountTypeList />
      </TabPanel>
      <CreateCashOfAccountForm
        onSubmit={handleCreateCA}
        open={openModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default CashOfAccountList;
