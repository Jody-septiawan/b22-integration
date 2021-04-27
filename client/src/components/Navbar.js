import { useContext } from 'react';
import { UserContext } from "../contexts/userContext";

import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

function NavbarComponent() {
    const [state, dispatch] = useContext(UserContext);

    console.log(state);

    let history = useHistory();

    const loginClick = () => {
        history.push('/login');
    };

    const handleLogout = () => {
        dispatch({
            type: "LOGOUT",
        });
    };

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand as={Link} to="/">Integration</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/axios">Axios</Nav.Link>
                        <Nav.Link as={Link} to="/react-query">React-Query</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        <isLoginTrue />
                        {!state.isLogin ?
                            (
                                <>
                                    <Button onClick={loginClick} className="btn-sm py-1 btn-secondary mr-2">Login</Button>
                                </>
                            ) :
                            (
                                <>
                                    <span className="mt-1 mr-2">Hai, {state?.user?.name}</span><Button onClick={handleLogout} className="btn-sm py-1 btn-danger mr-2">Logout</Button>
                                </>
                            )
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}

export default NavbarComponent;