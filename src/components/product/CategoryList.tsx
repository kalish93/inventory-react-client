import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../common/confirmationModal";
import CategoryForm from "./CategoryForm";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";
import { deleteProductCategory, getProductCategories } from "../../features/product/productActions";

const CategoryList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: any) => state.product.productCategories);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const error = useSelector((state: any) => state.product.error);
  const [deleteSubmitted, setDeleteSubmitted] = useState(false);


  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleDeleteCategory();
    closeConfirmationModal();
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getProductCategories());
  }, [dispatch]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (deleteSubmitted) {
      if (error) {
        showSnackbar(error, "error");
      } else {
        showSnackbar("Category deleted successfully", "success");
      }
      setDeleteSubmitted(false);
    }
  }, [deleteSubmitted, error]);

  const handleDeleteCategory = () => {
    handleMenuClose();
    if (selectedCategoryId !== null) {
      dispatch(deleteProductCategory(selectedCategoryId))
        .then(() => {
          setDeleteSubmitted(true);
        })
        .catch(() => {
          setDeleteSubmitted(true);
        });
    }
  };

  const handleMenuOpen = (event: any, categoryId: any, category: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
    setSelectedCategoryId(categoryId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategoryId(null);
    setSelectedCategory(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      {hasPermission(PERMISSIONS.CreateProductCategory) && 
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add Category
      </Button>}
      {hasPermission(PERMISSIONS.GetProductCategories) && <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category: any) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="Actions"
                    onClick={(event) => handleMenuOpen(event, category.id, category)}
                    style={{ margin: 0, padding: 0 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="actions-menu"
                    MenuListProps={{
                      "aria-labelledby": "long-button",
                    }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      style: {
                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    {hasPermission(PERMISSIONS.UpdateProductCategory) && <MenuItem onClick={handleOpenModal}>Update</MenuItem>}
                    {hasPermission(PERMISSIONS.DeleteProductCategory) && <MenuItem onClick={openConfirmationModal}>Delete</MenuItem>}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
      <CategoryForm open={openModal} handleClose={handleCloseModal} selectedCategory={selectedCategory}/>
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title="Delete Category"
        content="Are you sure you want to delete this category?"
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

export default CategoryList;
