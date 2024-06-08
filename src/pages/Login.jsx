import React from 'react'

function Login() {
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
                        <form className="row g-3 needs-validation" noValidate="">
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
                                name="username"
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
                                className="form-control"
                                id="yourPassword"
                                required=""
                            />
                            <div className="invalid-feedback">
                                Please enter your password!
                            </div>
                            </div>
                            <div className="col-12 mb-4">
                            <button className="btn btn-primary w-100" type="submit">
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
  )
}

export default Login
