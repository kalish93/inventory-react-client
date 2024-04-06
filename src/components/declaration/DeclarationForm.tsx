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
  SelectChangeEvent,
  Autocomplete,
  Card,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { AppDispatch } from "../../app/store";
import { createDeclaration } from "../../features/declaration/declarationAction";
import { getProducts } from "../../features/product/productActions";
import {
  CreateDeclaration,
  CreateDeclarationProduct,
} from "../../models/declaration";

import dayjs from "dayjs";
import { selectDeclaration } from "../../features/declaration/declarationSlice";
interface DeclarationFormProps {
  open: boolean;
  handleClose: () => void;
}

const DeclarationForm: React.FC<DeclarationFormProps> = ({
  open,
  handleClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectDeclaration);
  const products = useSelector((state: any) => state.product.products.items);

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
        showSnackbar("Declaration created successfully.", "success");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [formData, setFormData] = useState<CreateDeclaration>({
    number: "",
    date: null,
    declarationProducts: [
      { productId: "", declarationQuantity: null, totalIncomeTax: null },
    ],
  });
  const [touched, setTouched] = useState<{
    number?: boolean;
    date?: boolean;
    declarationProducts?: {
      [key: number]: {
        productId?: boolean;
        declarationQuantity?: boolean;
        totalIncomeTax?: boolean;
      };
    };
  }>({});

  const [addedProducts, setAddedProducts] = useState<
    CreateDeclarationProduct[]
  >([]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProductChange =
    (index: number, field: keyof CreateDeclarationProduct) =>
    (e: SelectChangeEvent<string>) => {
      const newProducts = [...formData.declarationProducts];
      newProducts[index] = {
        ...newProducts[index],
        [field]: e.target.value as string,
      };
      setFormData((prevData: any) => ({
        ...prevData,
        declarationProducts: newProducts,
      }));
    };

  const handleAddProduct = () => {
    const newProduct = {
      productId: formData.declarationProducts[0].productId,
      declarationQuantity: formData.declarationProducts[0].declarationQuantity,
      totalIncomeTax: formData.declarationProducts[0].totalIncomeTax,
    };

    setAddedProducts((prevProducts) => [...prevProducts, newProduct]);
    setFormData((prevData: any) => ({
      ...prevData,
      declarationProducts: [
        { productId: "", declarationQuantity: null, totalIncomeTax: null },
      ],
    }));
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
      const newDeclarationProducts = [...prevData.declarationProducts];
      newDeclarationProducts[index] = { ...productToEdit };
      return {
        ...prevData,
        declarationProducts: newDeclarationProducts,
      };
    });
  };

  const handleSubmit = () => {
    const formDataToSend = {
      number: formData.number,
      date: formData.date,
      declarationProducts: addedProducts,
    };

    dispatch(createDeclaration(formDataToSend));
    setFormData({
      number: "",
      date: null,
      declarationProducts: [
        {
          productId: "",
          declarationQuantity: null,
          totalIncomeTax: null,
        },
      ],
    });
    setAddedProducts([]);
    setIsFormSubmitted(true);
    setTouched({});
    handleClose();
  };

  const handleCancel = () => {
    setFormData({
      number: "",
      date: null,
      declarationProducts: [
        {
          productId: "",
          declarationQuantity: null,
          totalIncomeTax: null,
        },
      ],
    });
    setAddedProducts([]);
    setTouched({});
    handleClose();
  };

  const handleProductFormChange =
    (index: number, field: keyof CreateDeclarationProduct) =>
    (e: React.ChangeEvent<{ value: unknown }>) => {
      const newProducts = [...formData.declarationProducts];
      newProducts[index] = {
        ...newProducts[index],
        [field]: e.target.value as string | number,
      };
      setFormData((prevData) => ({
        ...prevData,
        declarationProducts: newProducts,
      }));
    };

  const isDeclarationFormValid = () => {
    return (
      formData.number.trim() !== "" &&
      formData.date !== null &&
      addedProducts.length > 0
    );
  };

  const isAddProductButtonDisabled = () => {
    return formData.declarationProducts.some(
      (product) =>
        !product.productId ||
        product.productId === "" ||
        product.declarationQuantity === null ||
        product.declarationQuantity <= 0 ||
        product.totalIncomeTax === null
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
            width: 500,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Declaration Form
          </Typography>
          <TextField
            name="number"
            label="Declaration Number"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
            error={touched.number && !formData.number}
            onBlur={() => setTouched({ ...touched, number: true })}
          />
          {touched.number && !formData.number && (
            <FormHelperText error>
              Declaration number is required
            </FormHelperText>
          )}

          <TextField
            name="date"
            label="Declaration Date"
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
          <Typography>Add Products</Typography>
          {formData.declarationProducts.map((product: any, index: any) => (
            <div key={index}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => option.name}
                value={
                  products.find(
                    (p: { id: any }) => p.id === product.productId
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleProductChange(
                    index,
                    "productId"
                  )({
                    target: { value: newValue ? newValue.id : "" },
                  } as SelectChangeEvent<string>);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product"
                    variant="outlined"
                    fullWidth
                    required
                    error={
                      touched.declarationProducts?.[index]?.productId &&
                      !product.productId
                    }
                    sx={{ marginBottom: 1 }}
                  />
                )}
              />

              <TextField
                name={`declarationQuantity-${index}`}
                label="Quantity"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={
                  product.declarationQuantity === null
                    ? ""
                    : product.declarationQuantity
                }
                onChange={handleProductFormChange(index, "declarationQuantity")}
                required
                error={
                  touched.declarationProducts?.[index]?.declarationQuantity &&
                  !product.declarationQuantity
                }
              />

              <TextField
                name={`totalIncomeTax-${index}`}
                label="Income Tax"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={
                  product.totalIncomeTax === null ? "" : product.totalIncomeTax
                }
                onChange={handleProductFormChange(index, "totalIncomeTax")}
                required
                error={
                  touched.declarationProducts?.[index]?.totalIncomeTax &&
                  !product.totalIncomeTax
                }
              />
            </div>
          ))}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddProduct}
            disabled={isAddProductButtonDisabled()}
            sx={{ borderRadius: 20, mt: 2 }}
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
                      Product Name: {productName},Declaration Quantity:{" "}
                      {product.declarationQuantity},Total Income Tax:{" "}
                      {product.totalIncomeTax}
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

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!isDeclarationFormValid()}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>

          <Button
            variant="outlined"
            color="warning"
            onClick={handleCancel}
            sx={{ marginLeft: 1, mt: 2 }}
          >
            Cancel
          </Button>
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

export default DeclarationForm;
