import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import Giris from './user/pages/Giris';
import Kayit from './user/pages/Kayit';
import UserAppointments from './appointments/pages/UserAppointments';
import UpdateAppointment from './appointments/pages/UpdateAppointment';

const logo = require('./shared/assets/saglik.png');

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <div>
            <img src={logo} width='100%' alt=''/>
          </div>
        </Route>
        <Route path="/:userId/appointments" exact>
          <UserAppointments />
        </Route>
        <Route path="/appointments/:appointmentId">
          <UpdateAppointment />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
        <div>
          <img src={logo} width='100%' alt='' />
        </div>
        </Route>
        <Route path="/giris" exact>
          <Giris />
        </Route>
        <Route path="/kayit" exact>
          <Kayit />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
