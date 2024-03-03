import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Toolbar, IconButton, Typography, styled } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/user/userActions";
import { useDispatch, useSelector } from "react-redux";
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
  const handleDrawerOpen = () => {
    setShowDrawer(true);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div style={{ display: "flex" }}>
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

          {/* <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="primary"
          >
            <AccountCircle />
          </IconButton> */}
          {user && user.username && (
            <>
              <Typography color={"white"} noWrap>
                {user.username}
              </Typography>
              <IconButton
                edge="end"
                aria-label="logout"
                aria-haspopup="true"
                color="inherit"
                onClick={handleLogout}
              >
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <main style={{ flexGrow: 1, padding: "16px" }}>
        <Toolbar />
      </main>
    </div>
  );
};

export default Navbar;
