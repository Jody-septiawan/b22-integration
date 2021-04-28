import { Link, useHistory } from "react-router-dom";
import { useState, useContext } from 'react';
import "../style/global.css";

import { UserContext } from "../contexts/userContext";

import { API, setAuthToken } from "../config/api";

function Login() {
    const router = useHistory();
    const [, dispatch] = useContext(UserContext);

    const [message, setMessage] = useState('');

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const { email, password } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    };

    const onSubmit = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const body = JSON.stringify({
                email,
                password
            });

            const response = await API.post("/login", body, config);

            setMessage(response.data.message);

            setAuthToken(response.data.data.user.token);

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: response.data.data.user
            });

            router.push("/");

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="page-login bg-secondary">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                        </div>
                        <div className="col-md-4">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                onSubmit(e);
                            }}>
                                <div className="card mt-5">
                                    <div className="card-header text-center py-2 mb-3">
                                        Login Page
                                    </div>
                                    <div className="card-body p-2">
                                        {message && (
                                            <div class="alert alert-danger py-1" role="alert">
                                                <small>{message}</small>
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <input
                                                value={email}
                                                onChange={(e) => onChange(e)}
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                placeholder="email" />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                value={password}
                                                onChange={(e) => onChange(e)}
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                placeholder="password" />
                                        </div>
                                        <button type="submit" name="" id="" className="btn btn-primary btn-sm btn-block">Login</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;