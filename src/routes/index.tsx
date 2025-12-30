import React from 'react';
// import {useSelector} from 'react-redux';

import HomeDrawer from './home-drawer.navigator';
// import AuthStack from './auth-stack.navigator';

export function Routes(props) {
  // const state = useSelector(state => state.authentication);

  // eslint-disable-next-line curly
  // if (state.login_user) return <HomeDrawer />;
  return <HomeDrawer />;

  // return <AuthStack />;
}
