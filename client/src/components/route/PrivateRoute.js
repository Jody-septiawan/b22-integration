import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";

function PrivateRoute({ component: Component, ...rest }) {
  const [state] = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        state.isLogin ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: {
                isLogin: state.isLogin,
              },
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
