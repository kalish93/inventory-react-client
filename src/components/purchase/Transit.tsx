import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectPurchase } from "../../features/purchase/purchaseSlice";

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
import { getTransitFee, getTransportCost } from "../../features/purchase/purchaseActions";
import dayjs from "dayjs";

const Transit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const purchaseState = useSelector(selectPurchase);
  const {
    items: transit = [],
    currentPage,
    totalCount,
  } = purchaseState.transitFees;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getTransitFee(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Tranist Fee</TableCell>
              <TableCell>Truck Number</TableCell>
              <TableCell>Declaration Number</TableCell>
              <TableCell>Unit Transit Cost</TableCell>
              <TableCell>Purchase Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transit.map((item: any) => (
              <TableRow key={item.id}>
              <TableCell>{dayjs(item.date).format("YYYY-MM-DD")}</TableCell>
              <TableCell>{item.cost}</TableCell>
              <TableCell>{item.purchase.truckNumber}</TableCell>
              <TableCell>{item?.productPurchase?.declaration?.number}</TableCell>
              <TableCell>{item.unitTransitCost.toFixed(2)}</TableCell>
              <TableCell>{item.purchase.number}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.paidAmount}</TableCell>
              <TableCell>{item.paymentStatus}</TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Transit;
