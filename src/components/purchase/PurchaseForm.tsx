import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
  IconButton,
  Autocomplete,
  Card,
  Snackbar,
  Alert,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { AppDispatch } from "../../app/store";
import { CreateProductPurchase } from "../../models/purchase";
import { getProducts } from "../../features/product/productActions";
import { createPurchase, getWaybillNumber } from "../../features/purchase/purchaseActions";
import { getDeclarations } from "../../features/declaration/declarationAction";
import { getDrivers } from "../../features/driver/driverActions";
import { selectPurchase } from "../../features/purchase/purchaseSlice";
import { getSuppliers } from "../../features/supplier/supplierActions";
interface PurchaseFormProps {
  open: boolean;
  handleClose: () => void;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: any) => state.product.products.items);
  const declarations = useSelector(
    (state: any) => state.declaration.declarations.items
  );
  const suppliers = useSelector((state: any) => state.supplier.suppliers.items);
  const drivers = useSelector((state: any) => state.driver.drivers.items);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const purchaseState  = useSelector(selectPurchase)
  let {waybillNumber} = purchaseState;
  const { isError, error, loading } = useSelector(selectPurchase);

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
        showSnackbar("Purchase created successfully.", "success");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [formData, setFormData] = useState<any>({
    number: waybillNumber,
    date: null,
    truckNumber: "",
    exchangeRate: null,
    transportCost: null,
    eslCustomCost: null,
    supplierId: null,
    transitFees: null,
    productId: "",
    declarationId: "",
    purchaseQuantity: null,
    purchaseUnitPrice: null,
  });
  const [touched, setTouched] = useState<{
    number?: boolean;
    date?: boolean;
    truckNumber?: boolean;
    exchangeRate?: boolean;
    transportCost?: boolean;
    eslCustomCost?: boolean;
    supplierId?: boolean;
    transitFees?: boolean;
    productId?: boolean;
    purchaseQuantity?: boolean;
    declarationId?: boolean;
    purchaseUnitPrice?: boolean;
  }>({});

  const [addedProducts, setAddedProducts] = useState<CreateProductPurchase[]>(
    []
  );
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getWaybillNumber());
    setFormData({
      number: waybillNumber,
      date: null,
      truckNumber: "",
      exchangeRate: null,
      transportCost: null,
      eslCustomCost: null,
      supplierId: null,
      transitFees: null,
      productId: "",
      declarationId: "",
      purchaseQuantity: null,
      purchaseUnitPrice: null,
    })

  }, [dispatch, waybillNumber]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDeclarations());
    dispatch(getSuppliers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDrivers());
  }, [dispatch]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddProduct = () => {
    const selectedDeclaration = declarations.find(
      (d: any) => d.id === formData.declarationId
    );

    const productDeclaration = selectedDeclaration.declarationProducts.find(
      (item: any) => item.product.id === formData.productId
    );

    if (selectedDeclaration) {
      let purchaseQuantity = parseInt(formData.purchaseQuantity);
      if (
        addedProducts.find(
          (product) => product.productId === formData.productId
        )
      ) {
        addedProducts.forEach((product) => {
          if (product.productId === formData.productId)
            purchaseQuantity += parseInt(product.purchaseQuantity as any);
        });
      } else {
        purchaseQuantity = parseInt(formData.purchaseQuantity);
      }
      if (
        (productDeclaration.declarationBalance == null &&
          productDeclaration.declarationQuantity >= purchaseQuantity) ||
        productDeclaration.declarationBalance >= purchaseQuantity
      ) {
        const newProduct = {
          productId: formData.productId,
          declarationId: formData.declarationId,
          purchaseQuantity: formData.purchaseQuantity,
          purchaseUnitPrice: formData.purchaseUnitPrice,
        };

        setAddedProducts((prevProducts) => [...prevProducts, newProduct]);
        setFormData((prevData: any) => ({
          ...prevData,
          number: waybillNumber,
          productId: "",
          declarationId: "",
          purchaseQuantity: null,
          purchaseUnitPrice: null,
        }));
      } else {
        // Display an error message or handle the case where purchase quantity exceeds declaration balance
        showSnackbar(
          `Purchase quantity exceeds the declaration balance.`,
          "error"
        );
      }
    }
  };

  const handleRemoveProduct = (index: number) => () => {
    setAddedProducts((prevProducts) =>
      prevProducts.filter((_, i) => i !== index)
    );
  };

  const handleEditProduct = (index: number) => () => {
    const productToEdit = addedProducts[index];
    setAddedProducts((prevProducts) =>
      prevProducts.filter((_, i) => i !== index)
    );
    setFormData((prevData: any) => {
      return {
        ...prevData,
        productId: productToEdit.productId,
        declarationId: productToEdit.declarationId,
        purchaseQuantity: productToEdit.purchaseQuantity,
        purchaseUnitPrice: productToEdit.purchaseUnitPrice,
      };
    });
  };

  const handleSubmit = () => {
    const formDataToSend = {
      number: formData.number,
      date: formData.date,
      truckNumber: formData.truckNumber,
      exchangeRate: formData.exchangeRate,
      transportCost: formData.transportCost,
      eslCustomCost: formData.eslCustomCost,
      supplierId: formData.supplierId,
      transitFees: formData.transitFees,
      purchaseProducts: addedProducts,
    };

    dispatch(createPurchase(formDataToSend));
    dispatch(getWaybillNumber());
    setFormData({
      number: waybillNumber,
      date: null,
      truckNumber: "",
      exchangeRate: null,
      transportCost: null,
      eslCustomCost: null,
      supplierId: null,
      transitFees: null,
      productId: "",
      declarationId: "",
      purchaseQuantity: null,
      purchaseUnitPrice: null,
    });
    setAddedProducts([]);
    setIsFormSubmitted(true);
    setTouched({});
    handleClose();
  };

  const handleCancel = () => {
    setFormData({
      number: waybillNumber,
      date: null,
      truckNumber: "",
      exchangeRate: null,
      transportCost: null,
      eslCustomCost: null,
      supplierId: null,
      transitFees: null,
      productId: "",
      declarationId: "",
      purchaseQuantity: null,
      purchaseUnitPrice: null,
    });
    setAddedProducts([]);
    setTouched({});
    handleClose();
    dispatch(getWaybillNumber());
  };

  const isPurchaseFormValid = () => {
    return (
      formData.number !== null &&
      formData.date !== null &&
      addedProducts.length > 0 &&
      addedProducts.every(
        (product) =>
          product.purchaseQuantity !== null &&
          product.purchaseUnitPrice !== null
      )
    );
  };

  const isAddProductButtonDisabled = () => {
    return (
      !formData.productId ||
      formData.productId === "" ||
      formData.declarationId === "" ||
      formData.purchaseQuantity === null ||
      formData.purchaseQuantity <= 0 ||
      formData.purchaseUnitPrice === null ||
      formData.purchaseUnitPrice <= 0
    );
  };

  useEffect(() => {
    // Filter products based on the selected declaration's declarationProducts
    if (formData.declarationId) {
      const selectedDeclaration = declarations.find(
        (d: { id: any }) => d.id === formData.declarationId
      );

      if (selectedDeclaration) {
        const declarationProducts = selectedDeclaration.declarationProducts;
        const productIds = declarationProducts.map(
          (product: { product: { id: any } }) => product.product.id
        );

        const productsForDeclaration = products.filter((product: { id: any }) =>
          productIds.includes(product.id)
        );

        setFilteredProducts(productsForDeclaration);
      }
    } else {
      setFilteredProducts([]);
    }
  }, [formData.declarationId, declarations, products]);

  const selectedSupplier = suppliers.find(
    (s: any) => s.id === formData.supplierId
  );
  const supplierCurrency = selectedSupplier ? selectedSupplier.currency : "";

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
            width: 1000,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, marginBottom: 2 }}
          >
            Purchase Form
          </Typography>
          <div style={{ display: "flex", gap: "2.5rem" }}>
            <div style={{ maxWidth: "33%" }}>
              <TextField
                style={{ marginTop: "0" }}
                name="number"
                label="Purchase/ Waybill Number"
                variant="outlined"
                type="number"
                fullWidth
                margin="normal"
                onChange={handleChange}
                value = {formData.number}
                required
                error={touched.number && !formData.number}
                onBlur={() => setTouched({ ...touched, number: true })}
              />
              {touched.number && !formData.number && (
                <FormHelperText error>
                  Purchase number is required
                </FormHelperText>
              )}

              <TextField
                name="date"
                label="Purchase Date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                error={touched.date && !formData.date}
                onBlur={() => setTouched({ ...touched, date: true })}
              />

              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="supplier-label">Supplier</InputLabel>
                <Select
                  labelId="supplier-label"
                  id="supplier"
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  label="Supplier"
                  required
                >
                  {suppliers.map((supplier: any) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {supplierCurrency === "USD" && (
                <TextField
                  name="exchangeRate"
                  label="Exchange rate"
                  variant="outlined"
                  type="number"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  required
                  error={touched.exchangeRate && !formData.exchangeRate}
                  onBlur={() => setTouched({ ...touched, exchangeRate: true })}
                />
              )}
              {touched.exchangeRate && !formData.exchangeRate && (
                <FormHelperText error>Exchange rate is required</FormHelperText>
              )}
            </div>

            <div style={{ maxWidth: "33%" }}>
              <Autocomplete
                options={drivers}
                getOptionLabel={(option) => option.truckNumber}
                value={
                  drivers.find(
                    (d: { truckNumber: string }) =>
                      d.truckNumber === formData.truckNumber
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "truckNumber",
                      value: newValue ? newValue.truckNumber : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ marginBottom: 1 }}
                    label="Truck Number"
                    variant="outlined"
                    fullWidth
                    required
                    error={touched.truckNumber && !formData.truckNumber}
                    onBlur={() => setTouched({ ...touched, truckNumber: true })}
                  />
                )}
              />

              <TextField
                name="transportCost"
                label="Transport Cost"
                variant="outlined"
                type="number"
                fullWidth
                margin="normal"
                onChange={handleChange}
                required
                error={touched.transportCost && !formData.transportCost}
                onBlur={() => setTouched({ ...touched, transportCost: true })}
              />
              {touched.transportCost && !formData.transportCost && (
                <FormHelperText error>
                  Transport cost is required
                </FormHelperText>
              )}
              <TextField
                name="eslCustomCost"
                label="ESL custom cost"
                variant="outlined"
                type="number"
                fullWidth
                margin="normal"
                onChange={handleChange}
                required
                error={touched.eslCustomCost && !formData.eslCustomCost}
                onBlur={() => setTouched({ ...touched, eslCustomCost: true })}
              />
              {touched.eslCustomCost && !formData.eslCustomCost && (
                <FormHelperText error>
                  ESL custom cost is required
                </FormHelperText>
              )}

              <TextField
                name="transitFees"
                label="Transit fees"
                variant="outlined"
                type="number"
                fullWidth
                margin="normal"
                onChange={handleChange}
                required
                error={touched.transitFees && !formData.transitFees}
                onBlur={() => setTouched({ ...touched, transitFees: true })}
              />
              {touched.transitFees && !formData.transitFees && (
                <FormHelperText error>Transit fee is required</FormHelperText>
              )}
            </div>
            <div style={{ maxWidth: "33%" }}>
              <Typography sx={{ marginBottom: 2 }}>Add Products</Typography>
              <div style={{ marginBottom: 15 }}>
                <Autocomplete
                  options={declarations.filter((declaration: any) =>
                    declaration?.declarationProducts?.some(
                      (product: any) => product.declarationBalance !== 0
                    )
                  )}
                  getOptionLabel={(option) => option.number}
                  value={
                    declarations.find(
                      (d: { id: any }) => d.id === formData.declarationId
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "declarationId",
                        value: newValue ? newValue.id : "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ marginBottom: 3 }}
                      {...params}
                      label="Declaration Number"
                      variant="outlined"
                      fullWidth
                      required
                      error={touched.productId && !formData.declarationId}
                    />
                  )}
                />

                <Autocomplete
                  options={filteredProducts}
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
                      label="Product"
                      variant="outlined"
                      fullWidth
                      required
                      error={touched.productId && !formData.productId}
                      sx={{ marginBottom: 1 }}
                    />
                  )}
                />

                <TextField
                  name="purchaseQuantity"
                  label="Purchase Quantity"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={
                    formData.purchaseQuantity === null
                      ? ""
                      : formData.purchaseQuantity
                  }
                  onChange={handleChange}
                  required
                  error={touched.purchaseQuantity && !formData.purchaseQuantity}
                />

                <TextField
                  name="purchaseUnitPrice"
                  label="Purchase Unit Price (USD)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={
                    formData.purchaseUnitPrice === null
                      ? ""
                      : formData.purchaseUnitPrice
                  }
                  onChange={handleChange}
                  required
                  error={
                    touched.purchaseUnitPrice && !formData.purchaseUnitPrice
                  }
                />
              </div>
            </div>
          </div>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddProduct}
            disabled={isAddProductButtonDisabled()}
            sx={{
              mt: 2,
              borderRadius: 2,
              color: "#2196F3",
              border: "2px solid #2196F3",
            }}
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
                const declarationNumber =
                  declarations.find((d: any) => d.id === product.declarationId)
                    ?.number || "";

                return (
                  <div key={index}>
                    <Typography variant="body1" component="div">
                      Product Name: {productName}, Quantity:{" "}
                      {product.purchaseQuantity}, Purchase Quantity:{" "}
                      {product.purchaseUnitPrice}, Declaration Number:{" "}
                      {declarationNumber}
                    </Typography>
                    <IconButton
                      onClick={handleEditProduct(index)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleRemoveProduct(index)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                );
              })}
            </Card>
          )}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap:'10px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!isPurchaseFormValid()}
            >
              Submit
            </Button>

            <Button variant="outlined" color="warning" onClick={handleCancel}>
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
export default PurchaseForm;
