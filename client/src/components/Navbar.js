import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/userContext";

import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import FormModal from "./modal/FormModal";
import LoginForm from "./forms/LoginForm";
import RegisterForm from "./forms/RegisterForm";

function NavbarComponent() {
  const [state, dispatch] = useContext(UserContext);
  const location = useLocation();
  const isLogin = location?.state && location?.state?.isLogin;
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (!state.isLogin) {
      setShowLogin(true);
    }

    return () => {
      setShowLogin(false);
      setShowRegister(false);
    };
  }, [state.isLogin, isLogin]);

  const handleOpenModalRegister = () => {
    setShowRegister(true);
  };
  const handleCloseModalRegister = () => {
    setShowRegister(false);
  };

  const handleOpenModalLogin = () => {
    setShowLogin(true);
  };
  const handleCloseModalLogin = () => {
    setShowLogin(false);
  };

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  const switchToRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const switchToLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          Integration
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/axios">
              Axios
            </Nav.Link>
            <Nav.Link as={Link} to="/react-query">
              React-Query
            </Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            {!state.isLogin ? (
              <>
                <Button
                  onClick={handleOpenModalLogin}
                  className="btn-sm py-1 btn-secondary m-2"
                >
                  Login
                </Button>
                <Button
                  onClick={handleOpenModalRegister}
                  className="btn-sm py-1 btn-secondary m-2"
                >
                  register
                </Button>
              </>
            ) : (
              <>
                <span className="mt-1 mr-2">Hai, {state?.user?.name}</span>
                <Button
                  onClick={handleLogout}
                  className="btn-sm py-1 btn-danger mr-2"
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <FormModal
        title="login"
        show={showLogin}
        handleClose={handleCloseModalLogin}
      >
        <LoginForm switcher={switchToRegister} />
      </FormModal>
      <FormModal
        title="register"
        show={showRegister}
        handleClose={handleCloseModalRegister}
      >
        <RegisterForm switcher={switchToLogin} />
      </FormModal>
    </>
  );
}

export default NavbarComponent;
