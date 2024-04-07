import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  styled,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArticleIcon from "@mui/icons-material/Article";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaidIcon from "@mui/icons-material/Paid";
import { Link, useLocation } from "react-router-dom";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";
import logo from '../../assets/logo-1.png'
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PaymentIcon from '@mui/icons-material/Payment';

// const drawerWidth = 240;

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));

const drawerWidth = 255;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", // Align logo and close icon
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Logo = styled("img")({
  maxHeight: 64,
});

interface SideBarProps {
  showDrawer: boolean;
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ showDrawer, setShowDrawer }: SideBarProps) => {
  const location = useLocation();
  const handleDrawerClose = () => {
    setShowDrawer(false);
  };

  const isLinkActive = (pathname: string) => location.pathname === pathname;

  return (
    <Drawer
      open={showDrawer}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
    >
      <DrawerHeader style={{marginBottom:'10px', marginTop:'10px'}}>
  <Logo src={logo} alt="Logo" />

    <IconButton onClick={handleDrawerClose}>
      <ChevronLeftIcon />
    </IconButton>

</DrawerHeader>

      <List>
        {(hasPermission(PERMISSIONS.GenerateBankTransactionReport)||
          hasPermission(PERMISSIONS.GenerateCustomerAgingReport)||
          hasPermission(PERMISSIONS.GetAllExpenses)) && (
          <ListItem
            button
            component={Link}
            to="/"
            key="Dashboard"
            selected={isLinkActive("/")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        )}

        {hasPermission(PERMISSIONS.GetInventory) && (
          <ListItem
            button
            component={Link}
            to="/inventory"
            key="Inventory"
            selected={isLinkActive("/inventory")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItem>
        )}

        {hasPermission(PERMISSIONS.GetUsers) && (
          <ListItem
            button
            component={Link}
            to="/users"
            key="Users"
            selected={isLinkActive("/users")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
        )}

        {hasPermission(PERMISSIONS.GetCustomers) && (
          <ListItem
            button
            component={Link}
            to="/customers"
            key="Customers"
            selected={isLinkActive("/customers")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItem>
        )}
        {hasPermission(PERMISSIONS.GetDrivers) && (
          <ListItem
            button
            component={Link}
            to="/drivers"
            key="drivers"
            selected={isLinkActive("/drivers")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <LocalShippingIcon />
            </ListItemIcon>
            <ListItemText primary="Drivers" />
          </ListItem>
        )}
        {hasPermission(PERMISSIONS.GetStores) && (
          <ListItem
            button
            component={Link}
            to="/stores"
            key="stores"
            selected={isLinkActive("/stores")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <WarehouseIcon />
            </ListItemIcon>
            <ListItemText primary="Stores" />
          </ListItem>
        )}
        {hasPermission(PERMISSIONS.GetSuppliers) && (
          <ListItem
            button
            component={Link}
            to="/suppliers"
            key="Suppliers"
            selected={isLinkActive("/suppliers")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <HandshakeIcon />
            </ListItemIcon>
            <ListItemText primary="Suppliers" />
          </ListItem>
        )}

        {hasPermission(PERMISSIONS.GetProducts) && (
          <ListItem
            button
            component={Link}
            to="/products"
            key="Products"
            selected={isLinkActive("/products")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
        )}

        {hasPermission(PERMISSIONS.GetDeclarations) && (
          <ListItem
            button
            component={Link}
            to="/declarations"
            key="Declarations"
            selected={isLinkActive("/declarations")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="Declarations" />
          </ListItem>
        )}

        {hasPermission(PERMISSIONS.GetPurchases) && (
          <ListItem
            button
            component={Link}
            to="/purchases"
            key="Purchases"
            selected={isLinkActive("/purchases")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <ShoppingBasketIcon />
            </ListItemIcon>
            <ListItemText primary="Purchases" />
          </ListItem>
        )}

        {hasPermission(PERMISSIONS.GetSales) && (
          <ListItem
            button
            component={Link}
            to="/sales"
            key="Sales"
            selected={isLinkActive("/sales")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Sales" />
          </ListItem>
        )}
        {hasPermission(PERMISSIONS.GetCaTransactions) && (
          <ListItem
            button
            component={Link}
            to="/ca-transactions"
            key="CATransactions"
            selected={isLinkActive("/ca-transactions")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <PaidIcon />
            </ListItemIcon>
            <ListItemText primary="CA Transactions" />
          </ListItem>
        )}

        {hasPermission(PERMISSIONS.CreateCaTransaction) && (
          <ListItem
            button
            component={Link}
            to="/operation-expence-payment"
            key="ExpensesPaymentForm"
            selected={isLinkActive("/operation-expence-payment")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText primary="Add Operation Expenses Payment" />
          </ListItem>
        )}

        {(hasPermission(PERMISSIONS.GetAllChartOfAccounts) ||
          hasPermission(PERMISSIONS.GetAllAccountTypes) ||
          hasPermission(PERMISSIONS.GetAllAccountSubTypes)) && (
          <ListItem
            button
            component={Link}
            to="/cash-of-accounts"
            key="CashOfAccounts"
            selected={isLinkActive("/cash-of-accounts")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <AccountBalanceWalletIcon />
            </ListItemIcon>
            <ListItemText primary="Chart Of Accounts" />
          </ListItem>
        )}
        {hasPermission(PERMISSIONS.GetBanks) && (
          <ListItem
            button
            component={Link}
            to="/banks"
            key="Banks"
            selected={isLinkActive("/banks")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <PaidIcon />
            </ListItemIcon>
            <ListItemText primary="Banks" />
          </ListItem>
        )}
        {hasPermission(PERMISSIONS.GetProvisions) && (
          <ListItem
            button
            component={Link}
            to="/provisions"
            key="Provisions"
            selected={isLinkActive("/provisions")}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <FactCheckIcon />
            </ListItemIcon>
            <ListItemText primary="Provisions" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
