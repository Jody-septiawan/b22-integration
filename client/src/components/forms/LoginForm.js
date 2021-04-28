import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import "../../style/global.css";

import { UserContext } from "../../contexts/userContext";

import { API, setAuthToken } from "../../config/api";

function LoginForm(props) {
  const { switcher } = props;
  const [, dispatch] = useContext(UserContext);
  const router = useHistory();

  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = form;

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({
        email,
        password,
      });

      const response = await API.post("/login", body, config);

      setMessage(response.data.message);

      setAuthToken(response.data.data.user.token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.data.user,
      });

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        onSubmit(e);
      }}
    >
      <div className="card mt-5">
        <div className="card-body p-2">
          {message && (
            <div className="alert alert-danger py-1" role="alert">
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
              placeholder="email"
            />
          </div>
          <div className="form-group">
            <input
              value={password}
              onChange={(e) => onChange(e)}
              type="password"
              className="form-control"
              name="password"
              placeholder="password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm btn-block">
            Login
          </button>
        </div>
        <div className="card-footer text-center py-2 mt-3">
          Belum punya akun?{" "}
          <button onClick={switcher} className="btn btn-link">
            Register
          </button>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
