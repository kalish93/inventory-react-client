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
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { AppDispatch } from '../../app/store';
import { selectProduct } from '../../features/product/productSlice';
import { deleteProduct, getProducts } from '../../features/product/productActions';
import ProductForm from './ProductForm';
import ConfirmationModal from '../common/confirmationModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const productState = useSelector(selectProduct);
  const { items: products = [], currentPage, totalCount } = productState.products;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const {isError, error, loading} = useSelector(selectProduct);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleDeleteProduct();
    closeConfirmationModal();
  };

  const handleUpdateProduct = () =>{
    handleOpenModal();
    handleMenuClose();
  }

  const handleDeleteProduct = () =>{
    handleMenuClose();

    if (selectedProductId !== null) {
      dispatch(deleteProduct(selectedProductId))
        .then(() => {
          if(!isError && !loading){
            showSnackbar('Product deleted successfully', 'success');
          }else{
            showSnackbar(error, 'error');
          }
        })
      }
  }

  const handleMenuOpen = (event: any, productId: any, product: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
    setSelectedProduct(product)
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProductId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getProducts(page + 1, rowsPerPage));
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
    setSelectedProductId(null);
    setSelectedProduct(null)
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
       Add Product
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
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Unit of measurement</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.unitOfMeasurement}</TableCell>
                <TableCell>
                <IconButton
                    aria-label="Actions"
                    onClick={(event) => handleMenuOpen(event, product.id, product)}
                    style={{ margin: 0, padding: 0 }}
                  >
                   <MoreVertIcon/>
                  </IconButton>
                  <Menu
                    id="actions-menu"
                    MenuListProps={{
                      'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      style: {
                        width: '20ch',
                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)'
                      },
                    }}
                  >
                    <MenuItem onClick={ () => handleUpdateProduct()}>Update</MenuItem>
                    <MenuItem onClick={openConfirmationModal}>Delete</MenuItem>
                  </Menu>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ProductForm open={openModal} handleClose={handleCloseModal} selectedProduct={selectedProduct}/>
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title="Delete Product"
        content="Are you sure you want to delete this product?"
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity as "success" | "error"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductList;
