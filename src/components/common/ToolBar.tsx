import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';


const Navbar = () => {
  return (
    <div style={{ display: 'flex' }}>
      <AppBar position="fixed" style={{ zIndex: 1200, backgroundColor: 'white', boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)' }}>
        <Toolbar>
          <Typography color={'blue'} variant="h6" noWrap style={{ flexGrow: 1 }}>
            F.O.R
          </Typography>
          
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="primary"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <main style={{ flexGrow: 1, padding: '16px' }}>
        <Toolbar />
      </main>
    </div>
  );
};

export default Navbar;
