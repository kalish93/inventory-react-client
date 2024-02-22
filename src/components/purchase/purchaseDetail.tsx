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
              <TableCell>Purchase Unit Price</TableCell>
              <TableCell>Purchase Total</TableCell>
              <TableCell>Transport cost</TableCell>
              <TableCell>Transit fees</TableCell>
              <TableCell>ESL Custom cost</TableCell>
              <TableCell>Purchase Unit COGS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchase.productPurchases.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.declaration.number}</TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.purchaseQuantity}</TableCell>
                <TableCell>{item.purchaseUnitPrice}</TableCell>
                <TableCell>{item.purchaseTotal}</TableCell>
                <TableCell>{Number(item.transportCost).toFixed(2)}</TableCell>
                <TableCell>{item.transitFees}</TableCell>
                <TableCell>{item.eslCustomCost}</TableCell>
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
