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
  Button,
} from '@mui/material';
import { AppDispatch } from '../../app/store';
import { selectDeclaration } from '../../features/declaration/declarationSlice';
import { getDeclarations } from '../../features/declaration/declarationAction';
import DeclarationForm from './DeclarationForm';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const DeclarationList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const declarationState = useSelector(selectDeclaration);
  const { items: declarations = [], currentPage, totalCount } = declarationState.declarations;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getDeclarations(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
       Add Declaration
      </Button>
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
              <TableCell>Declaration Number</TableCell>
              <TableCell>Declaration Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {declarations.map((declaration: any) => (
              <TableRow key={declaration.id} component={Link} to={`/declarations/${declaration.id}`} style={{ textDecoration: 'none' }}>
                <TableCell>{declaration.number }</TableCell>
                <TableCell>{dayjs(declaration.date).format("YYYY-MM-DD")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeclarationForm open={openModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default DeclarationList;
