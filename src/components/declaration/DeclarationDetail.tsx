import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectDeclaration } from "../../features/declaration/declarationSlice";
import { useParams } from "react-router-dom";
import { getDeclaration } from "../../features/declaration/declarationAction";
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

const DeclarationDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const declarationState = useSelector(selectDeclaration);
  const declaration = declarationState.declaration;

  useEffect(() => {
    dispatch(getDeclaration(id));
  }, [dispatch, id]);

  if (!declaration) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Declaration Number: {declaration.number}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Declaration Date: {dayjs(declaration.date).format("YYYY-MM-DD")}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Declaration Quantity</TableCell>
              <TableCell>Total Income Tax</TableCell>
              <TableCell>Unit Income Tax</TableCell>
              <TableCell>Purchased Quantity</TableCell>
              <TableCell>Declaration Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {declaration.declarationProducts.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.declarationQuantity}</TableCell>
                <TableCell>{item.totalIncomeTax}</TableCell>
                <TableCell>{Number(item.unitIncomeTax).toFixed(2)}</TableCell>
                <TableCell>{item.purchasedQuantity}</TableCell>
                <TableCell>{item.declarationBalance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DeclarationDetail;
