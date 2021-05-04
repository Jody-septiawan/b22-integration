import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserContext } from "./contexts/userContext";

import { QueryClient, QueryClientProvider } from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools'

import { API, setAuthToken } from './config/api';

import "bootstrap/dist/css/bootstrap.min.css";

import Home from './pages/Home';
import Login from './pages/Login';
import Axios from './pages/Axios';
import ReactQuery from './pages/ReactQuery';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import PrivateRoute from './components/route/PrivateRoute';
import TodoDetail from './pages/TodoDetail';

// init token pada axios setiap kali aplikasi direfresh
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [, dispatch] = useContext(UserContext);

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR"
        })
      };

      let payload = response.data.data.user;
      payload.token = localStorage.token;

      dispatch({
        type: "AUTH_SUCCESS",
        payload
      })

    } catch (error) {
      dispatch({
        type: "AUTH_ERROR"
      })
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <>
      <QueryClientProvider client={client}>
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/todo/:id" component={TodoDetail} />
              <PrivateRoute exact path="/axios" component={Axios} />
              <PrivateRoute exact path="/react-query" component={ReactQuery} />
              <Route exact path="/" component={Home} />
            </Switch>
          </div>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
