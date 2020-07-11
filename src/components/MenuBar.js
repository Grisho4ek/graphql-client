import React, { useContext } from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';

const MenuBar = () => {
  const { user, logout } = useContext(AuthContext);

  const menuBar = user ? (
    <Menu pointing secondary size='massive' color='teal'>
      <Menu.Item name={user.username} as={NavLink} to='/' exact />
      <Menu.Menu position='right'>
        <Menu.Item name='logout' as={Link} to='/' onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size='massive' color='teal'>
      <Menu.Item name='home' as={NavLink} to='/' exact active />
      <Menu.Menu position='right'>
        <Menu.Item name='login' as={NavLink} to='/login' exact />
        <Menu.Item name='register' as={NavLink} to='/register' exact />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
};

export default MenuBar;
