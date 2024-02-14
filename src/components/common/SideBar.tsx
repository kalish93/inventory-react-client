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
      </List>
    </Drawer>
  );
};

export default Sidebar;
