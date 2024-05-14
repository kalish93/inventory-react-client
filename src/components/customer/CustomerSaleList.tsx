import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";
import { getCustomerSales } from "../../features/customer/customerActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectCustomer } from "../../features/customer/customerSlice";

const CustomerSaleList = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const customerState = useSelector(selectCustomer);
  const {
    items: sales = [],
    currentPage,
    totalCount,
  } = customerState.customerSales;

  useEffect(() => {
    dispatch(getCustomerSales(id, page + 1, rowsPerPage));
  }, [dispatch, id, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
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
                <TableCell>Payment Status</TableCell>
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
                  <TableCell>{sale.paymentStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default CustomerSaleList;
