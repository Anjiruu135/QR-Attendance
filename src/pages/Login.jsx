import React, { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
import useSignIn from 'react-auth-kit/hooks/useSignIn';

function Login() {
  const [loginData, setLoginData] = useState({
    instructor_id: "",
    password: "",
  });

  const signIn = useSignIn();

  axios.defaults.withCredentials = true;

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/login`,
        loginData
      );
  
      if (response.status === 200) {
        const { message, instructor_id, token, user_name, section, user_type, role } = response.data;
  
        if (message === "Login successful for user" || message === "Login successful for admin") {
          Swal.fire({
            title: "Login Successful!",
            text: `Welcome ${user_type.charAt(0).toUpperCase() + user_type.slice(1)}!`,
            icon: "success",
          });
          signIn({
            auth: {
              token: token,
              type: 'Bearer',
            },
            userState: {
              name: user_name,
              uid: instructor_id,
              section: section,
              user_type: user_type.toLowerCase(),
              role: role,
            },
          });
          window.location.href = user_type.toLowerCase() === 'admin' ? "/admin/home" : "/home";
        } else if (message === "Invalid Login") {
          Swal.fire({
            icon: "error",
            title: "Invalid Login!",
            text: "Incorrect User ID or Password!",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };  

  return (
    <>
      <main>
        <div className="container">
          <section className="section register min-vh-25 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex justify-content-center py-4">
                    <a
                      href="index.html"
                      className="logo d-flex align-items-center w-auto"
                    >
                      <img src="src/assets/img/logo.png" alt="" />
                      <span className="d-none d-lg-block">QR Attendance</span>
                    </a>
                  </div>
                  {/* End Logo */}
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">
                          Login to Your Account
                        </h5>
                        <p className="text-center small">
                          Enter your username &amp; password to login
                        </p>
                      </div>
                      <form
                        className="row g-3 needs-validation"
                        noValidate=""
                        onSubmit={handleLoginSubmit}
                      >
                        <div className="col-12">
                          <label htmlFor="yourUsername" className="form-label">
                            Username
                          </label>
                          <div className="input-group has-validation">
                            <span
                              className="input-group-text"
                              id="inputGroupPrepend"
                            >
                              @
                            </span>
                            <input
                              type="text"
                              name="instructor_id"
                              placeholder="Username"
                              value={loginData.instructor_id}
                              onChange={handleLoginChange}
                              className="form-control"
                              id="yourUsername"
                              required=""
                            />
                            <div className="invalid-feedback">
                              Please enter your username.
                            </div>
                          </div>
                        </div>
                        <div className="col-12 mb-4">
                          <label htmlFor="yourPassword" className="form-label">
                            Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            placeholder="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            className="form-control"
                            id="yourPassword"
                            required=""
                          />
                          <div className="invalid-feedback">
                            Please enter your password!
                          </div>
                        </div>
                        <div className="col-12 mb-4">
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                          >
                            Login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="credits">
                    {/* All the links in the footer should remain intact. */}
                    {/* You can delete the links only if you purchased the pro version. */}
                    {/* Licensing information: https://bootstrapmade.com/license/ */}
                    {/* Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ */}
                    Designed by{" "}
                    <a href="https://bootstrapmade.com/">BootstrapMade</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      {/* End #main */}
    </>
  );
}

export default Login;
