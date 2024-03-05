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

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

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
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      {/* <Divider /> */}
      <List>
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
          <ListItemText primary="Cash Of Accounts" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
