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
import { selectPurchase } from "../../features/purchase/purchaseSlice";
import { getPurchase } from "../../features/purchase/purchaseActions";

const PurchaseDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const purchaseState = useSelector(selectPurchase);
  const purchase = purchaseState.purchase;

  useEffect(() => {
    dispatch(getPurchase(id));
  }, [dispatch, id]);

  if (!purchase) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Purchase Number: {purchase.number}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Purchase Date: {dayjs(purchase.date).format("YYYY-MM-DD")}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Truck Number: {purchase.truckNumber}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Declaration Number</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Purchase Quantity</TableCell>
              <TableCell>Purchase ETB Unit Price</TableCell>
              <TableCell>Purchase USD Unit Price</TableCell>
              <TableCell>Purchase Total ETB</TableCell>
              <TableCell>Purchase Unit COGS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchase.productPurchases.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.declaration.number}</TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.purchaseQuantity}</TableCell>
                <TableCell>{item.purchaseUnitPriceETB}</TableCell>
                <TableCell>{item.purchaseUnitPriceUSD}</TableCell>
                <TableCell>{item.purchaseTotalETB}</TableCell>
                <TableCell>{item.purchaseUnitCostOfGoods}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PurchaseDetail;
