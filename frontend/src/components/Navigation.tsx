import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <SecurityIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Kube Credential System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/issue"
            variant={location.pathname === '/issue' ? 'outlined' : 'text'}
          >
            Issue Credential
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/verify"
            variant={location.pathname === '/verify' ? 'outlined' : 'text'}
          >
            Verify Credential
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;