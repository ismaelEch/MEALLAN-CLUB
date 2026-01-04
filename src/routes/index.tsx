import React from 'react';
import {useSelector} from 'react-redux';

import HomeDrawer from './home-drawer.navigator';
 import AuthStack from './auth-stack.navigator';

export function Routes(props) {
  
  const { login_user, is_guest } = useSelector(
    (state: any) => state.authentication,
  );

  // Accès à l'app si connecté OU invité
  if (login_user || is_guest) {
    return <HomeDrawer />;
  }

  return <AuthStack />;




}
