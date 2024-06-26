import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const { isAuthenticated, logoutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <span className='flex-grow font-bold text-xl'>
          FINANCE MANAGER
        </span>
        {isAuthenticated && (
          <>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleMenu} sx={{ display: { md: 'none' } }}>
              <Menu />
            </IconButton>
            <div className='flex gap-10 max-md:hidden'>
              <div className='flex gap-2'>
                  <Button color="inherit" component={Link} to="/dashboard">Главная</Button>
                  <Button color="inherit" component={Link} to="/transactions">Операции</Button>
                  <Button color="inherit" component={Link} to="/plans">Планирование</Button>
                  <Button color="inherit" component={Link} to="/reports">Отчётность</Button>
              </div>
              <Button color="inherit" variant='outlined' onClick={logoutUser}>Выйти</Button>
            </div>
            <Drawer anchor="right" open={isMenuOpen} onClose={toggleMenu}>
              <List>
                <ListItem component={Link} to="/dashboard" onClick={toggleMenu}>
                  <ListItemText primary="Главная" />
                </ListItem>
                <ListItem component={Link} to="/transactions" onClick={toggleMenu}>
                  <ListItemText primary="Операции" />
                </ListItem>
                <ListItem component={Link} to="/plans" onClick={toggleMenu}>
                  <ListItemText primary="Планирование" />
                </ListItem>
                <ListItem component={Link} to="/reports" onClick={toggleMenu}>
                  <ListItemText primary="Отчётность" />
                </ListItem>
                <ListItem onClick={logoutUser}>
                  <ListItemText primary="Выйти" />
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
