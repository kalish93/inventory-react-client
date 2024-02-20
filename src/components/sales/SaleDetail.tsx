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
import { selectSale } from "../../features/sales/salseSlice";
import { getSale } from "../../features/sales/salesActions";


const SaleDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const saleState = useSelector(selectSale);
  const sale = saleState.sale;

  useEffect(() => {
    dispatch(getSale(id));
  }, [dispatch, id]);

  if (!sale) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Invoice Number: {sale.invoiceNumber}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Invoice Date: {dayjs(sale.invoiceDate).format("YYYY-MM-DD")}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Customer Name: {sale.customer.firstName}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Sale Quantity</TableCell>
              <TableCell>Sale Unit Price</TableCell>
              <TableCell>Total Sales</TableCell>
              <TableCell>Unit COGS</TableCell>
              <TableCell>Declaration Number</TableCell>
              <TableCell>ESL Custom cost</TableCell>
              <TableCell>Purchase Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sale.saleDetails.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.saleQuantity}</TableCell>
                <TableCell>{item.saleUnitPrice}</TableCell>
                <TableCell>{item.totalSales}</TableCell>
                <TableCell>{item.unitCostOfGoods}</TableCell>
                <TableCell>{item.declaration.number}</TableCell>
                <TableCell>{item.purchase.number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SaleDetail;
