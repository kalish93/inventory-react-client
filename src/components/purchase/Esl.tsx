import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectPurchase } from "../../features/purchase/purchaseSlice";
import { getEslCosts } from "../../features/purchase/purchaseActions";
import {
  Button,
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
import ESLPayment from "../ca-transaction/ESLPayment";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";

const Esl = () => {
  const dispatch = useDispatch<AppDispatch>();
  const purchaseState = useSelector(selectPurchase);
  const { items: esl = [], currentPage, totalCount } = purchaseState.eslCosts;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getEslCosts(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <div>
      {hasPermission(PERMISSIONS.CreateEslPayment) && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          style={{ marginLeft: "10px" }}
        >
          Add ESL Payment
        </Button>
      )}
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
              <TableCell>Esl Custom Cost</TableCell>
              <TableCell>Truck Number</TableCell>
              <TableCell>Declaration Number</TableCell>
              <TableCell>Unit ESL Cost</TableCell>
              <TableCell>Purchase Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {esl.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{dayjs(item.date).format("MM/DD/YYYY")}</TableCell>
                <TableCell>{item.cost}</TableCell>
                <TableCell>{item.purchase?.truckNumber}</TableCell>
                <TableCell>
                  {item?.productPurchase?.declaration?.number}
                </TableCell>
                <TableCell>{item.unitEslCost?.toFixed(2)}</TableCell>
                <TableCell>{item.purchase?.number}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.paidAmount}</TableCell>
                <TableCell>{item.paymentStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ESLPayment open={openModal} handleClose={() => handleCloseModal()} />
    </div>
  );
};

export default Esl;
