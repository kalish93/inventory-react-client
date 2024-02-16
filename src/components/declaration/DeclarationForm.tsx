import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { AppDispatch } from "../../app/store";
import { createDeclaration } from "../../features/declaration/declarationAction";
import { getProducts } from "../../features/product/productActions";

interface DeclarationFormProps {
  open: boolean;
  handleClose: () => void;
}

const DeclarationForm: React.FC<DeclarationFormProps> = ({
  open,
  handleClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: any) => state.product.products.items);
  const [formData, setFormData] = useState({
    number: "",
    date: new Date(),
    declarationProducts: [
      { productId: "", declarationQuantity: 0, totalIncomeTax: 0 },
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

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProductFormChange =
    (index: number, field: keyof (typeof formData)["declarationProducts"][0]) =>
    (e: React.ChangeEvent<{ value: unknown }>) => {
      const newProducts = [...formData.declarationProducts];
      newProducts[index] = {
        ...newProducts[index],
        [field]: e.target.value as string,
      };
      setFormData((prevData) => ({
        ...prevData,
        declarationProducts: newProducts,
      }));
    };

  const handleProductChange =
    (index: number, field: keyof (typeof formData)["declarationProducts"][0]) =>
    (e: SelectChangeEvent<string>) => {
      const newProducts = [...formData.declarationProducts];
      newProducts[index] = {
        ...newProducts[index],
        [field]: e.target.value,
      };
      setFormData((prevData) => ({
        ...prevData,
        declarationProducts: newProducts,
      }));
    };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleProductBlur =
    (index: number, field: keyof (typeof formData)["declarationProducts"][0]) =>
    () => {
      setTouched((prevTouched: any) => {
        const declarationProducts = {
          ...(prevTouched.declarationProducts || {}),
        } as {
          [key: number]: {
            productId: boolean;
            declarationQuantity: boolean;
            totalIncomeTax: boolean;
          };
        };

        declarationProducts[index] = {
          ...(declarationProducts[index] || {}),
          [field]: true,
        };

        return {
          ...prevTouched,
          declarationProducts,
        };
      });
    };

  const handleAddProduct = () => {
    setFormData((prevData) => ({
      ...prevData,
      declarationProducts: [
        ...prevData.declarationProducts,
        { productId: "", declarationQuantity: 0, totalIncomeTax: 0 },
      ],
    }));
  };

  const handleRemoveProduct = (index: number) => () => {
    const newProducts = [...formData.declarationProducts];
    newProducts.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      declarationProducts: newProducts,
    }));
  };

  const handleSubmit = () => {
    dispatch(createDeclaration(formData));
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
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
          label="Number"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.number && !formData.number}
          onBlur={() => handleBlur("number")}
        />
        {touched.number && !formData.number && (
          <FormHelperText error>Declaration number is required</FormHelperText>
        )}
        <TextField
          name="date"
          label="Date"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.date && !formData.date}
          onBlur={() => handleBlur("date")}
        />
        {touched.date && !formData.date && (
          <FormHelperText error>Declaration date is required</FormHelperText>
        )}

        {formData.declarationProducts.map((product, index) => (
          <div key={index}>
            <Select
              name={`productId-${index}`}
              label="Product ID"
              variant="outlined"
              fullWidth
              value={product.productId}
              onChange={handleProductChange(index, "productId")}
              required
              error={
                touched.declarationProducts?.[index]?.productId &&
                !product.productId
              }
              onBlur={handleProductBlur(index, "productId")}
            >
              <MenuItem value="" disabled>
                Select Product
              </MenuItem>
              {products.map((product: any) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              name={`declarationQuantity-${index}`}
              label="Quantity"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={product.declarationQuantity}
              onChange={handleProductFormChange(index, "declarationQuantity")}
              required
              error={
                touched.declarationProducts?.[index]?.declarationQuantity &&
                !product.declarationQuantity
              }
              onBlur={handleProductBlur(index, "declarationQuantity")}
            />
            {touched.declarationProducts?.[index]?.declarationQuantity &&
              !product.declarationQuantity && (
                <FormHelperText error>
                  Declaration Quantity is required
                </FormHelperText>
              )}

            <TextField
              name={`totalIncomeTax-${index}`}
              label="Income Tax"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={product.totalIncomeTax}
              onChange={handleProductFormChange(index, "totalIncomeTax")}
              required
              error={
                touched.declarationProducts?.[index]?.totalIncomeTax &&
                !product.totalIncomeTax
              }
              onBlur={handleProductBlur(index, "totalIncomeTax")}
            />
            {touched.declarationProducts?.[index]?.totalIncomeTax &&
              !product.totalIncomeTax && (
                <FormHelperText error>
                  Total Income Tax is required
                </FormHelperText>
              )}

            <Button
              variant="outlined"
              color="warning"
              onClick={handleRemoveProduct(index)}
              sx={{ marginLeft: 1 }}
            >
              Remove Product
            </Button>
          </div>
        ))}

        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Add Product
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={
            !formData.number ||
            !formData.date ||
            formData.declarationProducts.some(
              (product) =>
                !product.productId ||
                !product.declarationQuantity ||
                !product.totalIncomeTax
            )
          }
        >
          Submit
        </Button>

        <Button
          variant="outlined"
          color="warning"
          onClick={handleCancel}
          sx={{ marginLeft: 1 }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default DeclarationForm;
