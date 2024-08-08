import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
  Autocomplete,
  Card,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { AppDispatch } from "../../app/store";
import { getProducts } from "../../features/product/productActions";
import {
  createSale,
  getInvoiceNumber,
} from "../../features/sales/salesActions";
import { getCustomers } from "../../features/customer/customerActions";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { selectSale } from "../../features/sales/salseSlice";
import { selectInventory } from "../../features/inventory/inventorySlice";
import { getInventories } from "../../features/inventory/inventoryActions";

interface SaleFormProps {
  open: boolean;
  handleClose: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: any) => state.product.products.items);
  const SalesState = useSelector(selectSale);
  let { invoiceNumber } = SalesState;
  const inventoryState = useSelector(selectInventory);
  const { items: inventories } = inventoryState.inventories;
  const customers = useSelector((state: any) => state.customer.customers.items);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectSale);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (isFormSubmitted && !loading) {
      if (isError) {
        showSnackbar(error || "Unknown error", "error");
      } else {
        showSnackbar("Sale created successfully.", "success");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [formData, setFormData] = useState({
    invoiceNumber: invoiceNumber,
    invoiceDate: null,
    customerId: "",
    productId: "",
    saleQuantity: 0,
    saleUnitPrice: 0,
  });

  const [touched, setTouched] = useState<{
    invoiceNumber?: boolean;
    invoiceDate?: boolean;
    customerId?: boolean;
    productId?: boolean;
    saleQuantity?: boolean;
    saleUnitPrice?: boolean;
  }>({});
  const [addedProducts, setAddedProducts] = useState<
    { productId: string; saleQuantity: number; saleUnitPrice: number }[]
  >([]);

  useEffect(() => {
    dispatch(getInvoiceNumber());
    setFormData({
      invoiceNumber: invoiceNumber,
      invoiceDate: null,
      customerId: "",
      productId: "",
      saleQuantity: 0,
      saleUnitPrice: 0,
    });
  }, [dispatch, invoiceNumber]);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getInventories());
  }, [dispatch]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleAddProduct = () => {
    //check the balance quantity of the added product
    const inventory = inventories.find(
      (i: any) =>
        i.productId === formData.productId ||
        i.saleDetail.productId === formData.productId
    );

    if (inventory) {
      if (inventory.balanceQuantity < formData.saleQuantity) {
        showSnackbar(
          `There is not enough quantity of this product in the inventory.`,
          "error"
        );
        return;
      }
    }
    setAddedProducts([
      ...addedProducts,
      {
        productId: formData.productId,
        saleQuantity: formData.saleQuantity,
        saleUnitPrice: formData.saleUnitPrice,
      },
    ]);
    setFormData({
      ...formData,
      productId: "",
      saleQuantity: 0,
      saleUnitPrice: 0,
    });
  };

  const handleEditProduct = (index: number) => {
    const productToEdit = addedProducts[index];
    setFormData({
      ...formData,
      productId: productToEdit.productId,
      saleQuantity: productToEdit.saleQuantity,
      saleUnitPrice: productToEdit.saleUnitPrice,
    });
    handleRemoveProduct(index);
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...addedProducts];
    updatedProducts.splice(index, 1);
    setAddedProducts(updatedProducts);
  };

  const handleSubmit = () => {
    const combinedData = {
      ...formData,
      products: [...addedProducts],
    };
    dispatch(createSale(combinedData));
    setIsFormSubmitted(true);
    setFormData({
      invoiceNumber: invoiceNumber,
      invoiceDate: null,
      customerId: "",
      productId: "",
      saleQuantity: 0,
      saleUnitPrice: 0,
    });
    setAddedProducts([]);
    handleClose();
    dispatch(getInvoiceNumber());
  };

  const handleCancel = () => {
    setFormData({
      invoiceNumber: invoiceNumber,
      invoiceDate: null,
      customerId: "",
      productId: "",
      saleQuantity: 0,
      saleUnitPrice: 0,
    });
    setAddedProducts([]);
    setTouched({});
    handleClose();
  };
  const isAddProductButtonDisabled = () => {
    if (
      formData.productId === "" ||
      formData.saleQuantity <= 0 ||
      formData.saleUnitPrice <= 0 ||
      formData.customerId === ""
    ) {
      return true;
    }
    return false;
  };

  const isSubmitButtonDisabled = () => {
    return (
      formData.invoiceNumber <= 0 ||
      formData.invoiceDate === null ||
      formData.customerId === "" ||
      addedProducts.length === 0
    );
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            return;
          }
          handleClose();
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sales Form
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ maxWidth: "50%" }}>
              <TextField
                name="invoiceNumber"
                label="Invoice Number"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={handleChange}
                value={formData.invoiceNumber}
                required
                error={touched.invoiceNumber && !formData.invoiceNumber}
                onBlur={() => handleBlur("invoiceNumber")}
              />
              <TextField
                name="invoiceDate"
                label="Invoice Date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                sx={{ marginBottom: 3 }}
                value={formData.invoiceDate}
                onChange={handleChange}
                required
                error={touched.invoiceDate && !formData.invoiceDate}
                onBlur={() => setTouched({ ...touched, invoiceDate: true })}
              />

              <Autocomplete
                options={customers}
                getOptionLabel={(option) =>
                  option.firstName + " " + option.lastName
                }
                value={
                  customers.find(
                    (d: { id: string }) => d.id === formData.customerId
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "customerId",
                      value: newValue ? newValue.id : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer"
                    variant="outlined"
                    fullWidth
                    required
                    error={touched.customerId && !formData.customerId}
                    onBlur={() => setTouched({ ...touched, customerId: true })}
                  />
                )}
              />
            </div>
            <div style={{ maxWidth: "50%" }}>
              <Typography style={{ marginTop: "10px", marginBottom: "10px" }}>
                Add Product
              </Typography>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => option.name}
                value={
                  products.find(
                    (p: { id: any }) => p.id === formData.productId
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "productId",
                      value: newValue ? newValue.id : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ marginBottom: 1 }}
                    label="Product"
                    variant="outlined"
                    fullWidth
                    required
                    error={touched.productId && !formData.productId}
                  />
                )}
              />

              <TextField
                name="saleQuantity"
                label="Sale Quantity"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={formData.saleQuantity === 0 ? "" : formData.saleQuantity}
                onChange={handleChange}
                required
                error={touched.saleQuantity && !formData.saleQuantity}
              />
              <TextField
                name="saleUnitPrice"
                label="Sale Unit Price"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={
                  formData.saleUnitPrice === 0 ? "" : formData.saleUnitPrice
                }
                onChange={handleChange}
                required
                error={touched.saleUnitPrice && !formData.saleUnitPrice}
              />
            </div>
          </div>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddProduct}
            sx={{
              marginTop: 2,
              borderRadius: 2,
              color: "#2196F3",
              border: "2px solid #2196F3",
            }}
            disabled={isAddProductButtonDisabled()}
          >
            Add Product
          </Button>
          {addedProducts.length > 0 && (
            <Card sx={{ mt: 2, p: 2, bgcolor: "#f0f0f0" }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, marginBottom: 1 }}
              >
                Added Products
              </Typography>
              {addedProducts.map((product, index) => {
                const productName =
                  products.find((p: any) => p.id === product.productId)?.name ||
                  "";
                return (
                  <div key={index}>
                    <Typography variant="body1" component="div">
                      Product Name: {productName}, Quantity:{" "}
                      {product.saleQuantity}, Unit Price:{" "}
                      {product.saleUnitPrice}
                    </Typography>
                    <IconButton
                      onClick={() => handleEditProduct(index)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleRemoveProduct(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                );
              })}
            </Card>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ marginTop: 2 }}
              disabled={isSubmitButtonDisabled()}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleCancel}
              sx={{ marginLeft: 1, marginTop: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
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

export default SaleForm;
