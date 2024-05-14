import {
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerSaleList from "./CustomerSaleList";
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { selectCustomer } from "../../features/customer/customerSlice";
import { getCustomer, getCustomerPayments } from "../../features/customer/customerActions";
import { PERMISSIONS } from "../../core/permissions";
import { hasPermission } from "../../utils/checkPermission";
import dayjs from "dayjs";

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

const CustomerPaymentList = () => {
  const { id } = useParams();
  const [value, setValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const customerState = useSelector(selectCustomer);
  const {
    items: sales = [],
    currentPage,
    totalCount,
  } = customerState.customerPayments;
  const customer = customerState.customer;

  useEffect(()=>{
    dispatch(getCustomer(id));
  },[dispatch, id]);

  useEffect(() => {
    dispatch(getCustomerPayments(id, page + 1, rowsPerPage));
  }, [dispatch, id, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };
  return (
    <div>
    <h2 style={{textAlign:'center'}}>Customer Name: {customer?.firstName} {customer?.lastName}</h2>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Payments" />
        <Tab label="Sales" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount || 0}
          rowsPerPage={rowsPerPage}
          page={currentPage && currentPage > 0 ? currentPage - 1 : 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {hasPermission(PERMISSIONS.GetCustomerById) && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Invoice Date</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Paid Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((sale: any) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.invoiceNumber}</TableCell>
                    <TableCell>
                      {dayjs(sale.invoiceDate).format("MM/DD/YYYY")}
                    </TableCell>
                    <TableCell>
                      {sale.customer?.firstName + " " + sale.customer?.lastName}
                    </TableCell>
                    <TableCell>{sale.paidAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CustomerSaleList />
      </TabPanel>
    </div>
  );
};

export default CustomerPaymentList;
