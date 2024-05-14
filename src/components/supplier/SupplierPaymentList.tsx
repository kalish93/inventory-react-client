import {
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
  } from "@mui/material";
  import { Box } from "@mui/system";
  import React, { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import { AppDispatch } from "../../app/store";
  import { useDispatch, useSelector } from "react-redux";
  import { selectSupplier} from "../../features/supplier/supplierSlice";
  import { getSupplier, getSupplierPayments } from "../../features/supplier/supplierActions";
  import { PERMISSIONS } from "../../core/permissions";
  import { hasPermission } from "../../utils/checkPermission";
  import dayjs from "dayjs";
import SupplierPurchaseList from "./SupplierPurchaseList";
  
  const TabPanel = (props: {
    [x: string]: any;
    children: any;
    value: any;
    index: any;
  }) => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };
  
  const SupplierPaymentList = () => {
    const { id } = useParams();
    const [value, setValue] = useState(0);
    const dispatch = useDispatch<AppDispatch>();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const supplierState = useSelector(selectSupplier);
    const {
      items: purchases = [],
      currentPage,
      totalCount,
    } = supplierState.supplierPayments;
    const supplier = supplierState.supplier;
  
    useEffect(()=>{
      dispatch(getSupplier(id));
    },[dispatch, id]);
  
    useEffect(() => {
      dispatch(getSupplierPayments(id, page + 1, rowsPerPage));
    }, [dispatch, id, page, rowsPerPage]);
  
    const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const handleChange = (event: any, newValue: any) => {
      setValue(newValue);
    };
    return (
      <div>
      <h2 style={{textAlign:'center'}}>Supplier Name: {supplier?.name}</h2>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Payments" />
          <Tab label="Purchases" />
        </Tabs>
        <TabPanel value={value} index={0}>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SupplierPurchaseList />
        </TabPanel>
      </div>
    );
  };
  
  export default SupplierPaymentList;
  