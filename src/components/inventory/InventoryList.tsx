import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

import { AppDispatch } from "../../app/store";
import { selectInventory } from "../../features/inventory/inventorySlice";
import { getInventories } from "../../features/inventory/inventoryActions";
import dayjs from "dayjs";

const InventoryList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const inventoryState = useSelector(selectInventory);
  const {
    items: inventories = [],
    currentPage,
    totalCount,
  } = inventoryState.inventories;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getInventories(page + 1, rowsPerPage));
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
              <TableCell>Purchase Number</TableCell>
              <TableCell>Purchase Date</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Purchase Quantity</TableCell>
              <TableCell>Purchase Unit Price</TableCell>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Invoice Date</TableCell>
              <TableCell>Sale Quantity</TableCell>
              <TableCell>Sale Unit Price</TableCell>
              <TableCell>Balance Quantity</TableCell>
              <TableCell>COGS</TableCell>
              <TableCell>Declaration Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventories.map((inventory: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{inventory.purchase?.number}</TableCell>
                <TableCell>
                  {(inventory.purchase || inventory.productPurchase) &&
                    dayjs(inventory.purchase?.date ?? inventory.productPurchase?.date).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  {inventory.sale
                    ? inventory.saleDetail?.product?.name
                    : inventory.productPurchase.product.name}
                </TableCell>
                <TableCell>
                  {inventory.productPurchase?.purchaseQuantity}
                </TableCell>
                <TableCell>
                  {inventory.productPurchase?.purchaseUnitPriceETB}
                </TableCell>
                <TableCell>{inventory.sale?.invoiceNumber}</TableCell>
                <TableCell>
                  {inventory.sale &&
                    dayjs(inventory.sale?.invoiceDate).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>{inventory.saleDetail?.saleQuantity}</TableCell>
                <TableCell>{inventory.saleDetail?.saleUnitPrice}</TableCell>
                <TableCell>{inventory.balanceQuantity}</TableCell>
                <TableCell>
                  {inventory.productPurchase?.purchaseUnitCostOfGoods ??
                    inventory.saleDetail?.unitCostOfGoods}
                </TableCell>
                <TableCell>
                  {inventory.productPurchase?.declaration?.number ??
                    inventory.saleDetail?.declaration?.number}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default InventoryList;
