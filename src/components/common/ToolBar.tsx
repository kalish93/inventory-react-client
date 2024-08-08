import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Toolbar,
  IconButton,
  Typography,
  styled,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/user/userActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

interface NavBarProps {
  showDrawer: boolean;
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Navbar = ({ showDrawer, setShowDrawer }: NavBarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerOpen = () => {
    setShowDrawer(true);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigateToChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <>
      <AppBar
        open={showDrawer}
        position="fixed"
        style={{
          zIndex: 12,
          boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)",
          padding: 4,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(showDrawer && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            color={"white"}
            variant="h5"
            noWrap
            style={{ flexGrow: 1 }}
          >
            F.O.R Automatisation
          </Typography>

          {user && user.username && (
            <>
              <Typography color={"white"} noWrap>
                {user.username}
              </Typography>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenuOpen}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="actions-menu"
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose} // Automatically closes the menu when clicking outside
                PaperProps={{
                  style: {
                    width: "20ch",
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <MenuItem onClick={navigateToChangePassword}>
                  Change Password
                </MenuItem>
                <MenuItem style={{ color: "#AA0000" }} onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
