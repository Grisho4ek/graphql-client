import React from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const MenuBar = () => {
  return (
    <Menu pointing secondary size='massive' color='teal'>
      <Menu.Item name='home' as={NavLink} to='/' exact />
      <Menu.Menu position='right'>
        <Menu.Item name='login' as={NavLink} to='/login' exact />
        <Menu.Item name='register' as={NavLink} to='/register' exact />
      </Menu.Menu>
    </Menu>
  );
};

export default MenuBar;
