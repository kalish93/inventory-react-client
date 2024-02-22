import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';

import { AppDispatch } from '../../app/store';
import { selectInventory } from '../../features/inventory/inventorySlice';
import { getInventories } from '../../features/inventory/inventoryActions';


const InventoryList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const inventoryState = useSelector(selectInventory);
  const { items: inventories = [], currentPage, totalCount } = inventoryState.inventories;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getInventories(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
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
         page={(currentPage && currentPage > 0) ? currentPage - 1 : 0}
         onPageChange={handleChangePage}
         onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Truck Number</TableCell>
                <TableCell>Djbouti Phone</TableCell>
                <TableCell>Ethiopia Phone</TableCell>
                <TableCell>Association Name</TableCell>
                <TableCell>Association Phone</TableCell>
                <TableCell>Owner Name</TableCell>
                <TableCell>Owner Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventories.map((inventory: any) => (
              <TableRow key={inventory.id}>
                {/* <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.truckNumber}</TableCell>
                <TableCell>{driver.djboutiPhone}</TableCell>
                <TableCell>{driver.ethiopiaPhone}</TableCell>
                <TableCell>{driver.associationName}</TableCell>
                <TableCell>{driver.associationPhone}</TableCell>
                <TableCell>{driver.ownerName}</TableCell>
                <TableCell>{driver.ownerPhone}</TableCell>                 */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default InventoryList;
