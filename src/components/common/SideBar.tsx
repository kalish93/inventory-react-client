import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArticleIcon from '@mui/icons-material/Article';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();

  const isLinkActive = (pathname: string) => location.pathname === pathname;

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          marginTop: "64px",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItem
          button
          component={Link}
          to="/dashboard"
          key="Dashboard"
          selected={isLinkActive("/dashboard")}
        >
          <ListItemIcon>
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
          <ListItemIcon>
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
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>

        <ListItem button component={Link} to="/customers" key="Customers" selected={isLinkActive('/customers')}>
          <ListItemIcon>
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
          <ListItemIcon>
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
          <ListItemIcon>
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
          <ListItemIcon>
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
          <ListItemIcon>
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
          <ListItemIcon>
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
          <ListItemIcon>
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
          <ListItemIcon>
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
          <ListItemIcon>
            <AccountBalanceWalletIcon />
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
          <ListItemIcon>
            <AccountBalanceWalletIcon />
          </ListItemIcon>
          <ListItemText primary="Cash Of Accounts" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
