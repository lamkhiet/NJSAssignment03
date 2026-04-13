import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from 'react-router-dom';
import UserAPI from "../API/UserAPI";
import { AuthContext } from "../Context/AuthContext";

import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState([]);
  const { loading, error, dispatch } = useContext(AuthContext);
  // const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    dispatch({ type: "LOGIN_START" });

    try {
      const data = { email, password };
      const response = await UserAPI.postLogin(data);

      const loggedInUser = {
        token: response.token,
        _id: response.userId,
        fullname: response.fullname,
        email: email,
        role: response.role,
      };

      dispatch({ type: "LOGIN_SUCCESS", payload: loggedInUser });
      alert("Đăng nhập thành công! Chào mừng " + response.fullname);
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed!");
      const errorMessage = err.response?.data?.message || "Login Failed!";

      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      alert(errorMessage);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="login">
            <div className="heading">
              <h2>Sign in</h2>
              <form action="#">
                <div className="input-group input-group-lg">
                  <span className="input-group-addon">
                    <i className="fa fa-user"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-group input-group-lg">
                  <span className="input-group-addon">
                    <i className="fa fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="button" className="float" onClick={handleSubmit}>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
