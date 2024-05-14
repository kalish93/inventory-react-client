import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectProvision } from "../../features/provision/provisionSlice";
import { getProvisions } from "../../features/provision/provisionActions";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import dayjs from "dayjs";

const ProvisionList = () => {
    const dispatch = useDispatch<AppDispatch>();
  const provisionState = useSelector(selectProvision);
  const {
    items: provisions = [],
    currentPage,
    totalCount,
  } = provisionState.provisions;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getProvisions(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
console.log(provisions)
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
              <TableCell>Product Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Purchase UCOGS</TableCell>
              <TableCell>Sales UCOGS</TableCell>
              <TableCell>Unit Cost Of Transport</TableCell>
              <TableCell>Unit Cost Of ESL</TableCell>
              <TableCell>Unit Cost Of Transit</TableCell>
              <TableCell>Unit Cost Of Income Tax</TableCell>
              <TableCell>Purchase Number</TableCell>
              <TableCell>Declaration Number</TableCell>
              <TableCell>Sale Quantity</TableCell>
              <TableCell>Invoice Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {provisions.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.saleDetail?.product?.name}
                </TableCell>
                <TableCell>
                  {new Date(item.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {item.saleDetail.productPurchase.purchaseUnitCostOfGoods.toFixed(2)}
                </TableCell>
                <TableCell>
                  {item.saleDetail.unitCostOfGoods.toFixed(2)}
                </TableCell>
                <TableCell>
                  {item.saleDetail.productPurchase.transport.unitTransportCost.toFixed(2)}
                </TableCell>
                <TableCell>
                  {item.saleDetail.productPurchase.esl.unitEslCost.toFixed(2)}
                </TableCell>
                <TableCell>
                  {item.saleDetail.productPurchase.transit.unitTransitCost.toFixed(2)}
                </TableCell>
                <TableCell>
                  {item.productDeclaration.unitIncomeTax.toFixed(2)}
                </TableCell>
                <TableCell>
                  {item.saleDetail.purchase.number}
                </TableCell>
                <TableCell>
                  {item.saleDetail.declaration.number}
                </TableCell>
                <TableCell>
                  {item.saleDetail.saleQuantity}
                </TableCell>
                <TableCell>
                  {item.saleDetail?.sale?.invoiceNumber}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    )
}

export default ProvisionList;