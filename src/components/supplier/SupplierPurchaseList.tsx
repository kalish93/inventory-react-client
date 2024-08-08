import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectSupplier } from "../../features/supplier/supplierSlice";
import { getSupplierPurchases } from "../../features/supplier/supplierActions";

const SupplierPurchaseList = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const supplierState = useSelector(selectSupplier);
  const {
    items: purchases = [],
    currentPage,
    totalCount,
  } = supplierState.supplierPurchases;
  const {loading} = supplierState;

  useEffect(() => {
    dispatch(getSupplierPurchases(id, page + 1, rowsPerPage));
  }, [dispatch, id, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <CircularProgress />;
  }

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
        {hasPermission(PERMISSIONS.GetPurchases) && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Purchase /Waybill Number</TableCell>
                  <TableCell>Purchase Date</TableCell>
                  <TableCell>Track Number</TableCell>
                  <TableCell>Exchange Rate</TableCell>
                  <TableCell>Supplier Name</TableCell>
                  <TableCell>Paid Amount ETB</TableCell>
                  <TableCell>Paid Amount USD</TableCell>
                  <TableCell>Payment Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.map((purchase: any) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.number}</TableCell>
                    <TableCell>
                      {dayjs(purchase.date).format("MM/DD/YYYY")}
                    </TableCell>
                    <TableCell>{purchase.truckNumber}</TableCell>
                    <TableCell>{purchase.exchangeRate}</TableCell>
                    <TableCell>{purchase.supplier?.name}</TableCell>
                    <TableCell>
                      {purchase.paidAmountETB?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {purchase.paidAmountUSD?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {purchase.paymentStatus}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
    </div>
  );
};

export default SupplierPurchaseList;
