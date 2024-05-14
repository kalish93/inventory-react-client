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
import { PERMISSIONS } from "../../core/permissions";
import { hasPermission } from "../../utils/checkPermission";
import dayjs from "dayjs";
import DriverTransportList from "./DriverTransportList";
import { selectDrivers } from "../../features/driver/driverSlice";
import { getDriver, getDriverPayments } from "../../features/driver/driverActions";

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

const DriverPaymentList = () => {
  const { id } = useParams();
  const [value, setValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const driversState = useSelector(selectDrivers);
  const {
    items: transport = [],
    currentPage,
    totalCount,
  } = driversState.driverPayments;
  const driver = driversState.driver;

  useEffect(() => {
    dispatch(getDriver(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getDriverPayments(id, page + 1, rowsPerPage));
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
      <h2 style={{ textAlign: "center" }}>
        Driver Name: {driver?.name} 
      </h2>
      <h3 style={{ textAlign: "center" }}>
        Truck Number: {driver?.truckNumber} 
      </h3>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Payments" />
        <Tab label="Transports" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={totalCount || 0}
          rowsPerPage={rowsPerPage}
          page={currentPage && currentPage > 0 ? currentPage - 1 : 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {hasPermission(PERMISSIONS.GetDriverById) && (
          <TableContainer component={Paper}>
            <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Truck Number</TableCell>
              <TableCell>Purchase Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount Paid</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transport.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{dayjs(item.date).format("MM/DD/YYYY")}</TableCell>
                <TableCell>{item.purchase?.truckNumber}</TableCell>
                <TableCell>{item.purchase?.number}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.paidAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          </TableContainer>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DriverTransportList />
      </TabPanel>
    </div>
  );
};

export default DriverPaymentList;
