import { Link, useHistory } from "react-router-dom";

import { useContext, useState } from "react";
import { API, setAuthToken } from "../../config/api";
import { UserContext } from "../../contexts/userContext";

import "../../style/global.css";

function RegisterForm(props) {
  const { switcher } = props;
  const [, dispatch] = useContext(UserContext);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
  });

  const { nama, email, password } = form;

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
      const response = await API.post(
        "/register",
        JSON.stringify(form),
        config
      );

      dispatch({
        type: "REGISTER_SUCCESS",
        payload: response.data.data.user,
      });

      setAuthToken(response.data.data.user.token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="card mt-5">
          <div className="card-body p-2">
            <div className="form-group">
              <input
                value={nama}
                onChange={(e) => onChange(e)}
                type="text"
                className="form-control"
                name="nama"
                placeholder="nama"
              />
            </div>
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
            <button
              type="submit"
              name=""
              id=""
              className="btn btn-primary btn-sm btn-block"
            >
              Daftar
            </button>
          </div>
          <div className="card-footer text-center py-2 mt-3">
            Sudah punya akun?{" "}
            <button onClick={switcher} className="btn btn-link">
              Login
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default RegisterForm;
