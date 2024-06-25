import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useSignOut from "react-auth-kit/hooks/useSignOut";

function AdminNavBar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const auth = useAuthUser();

  const signOut = useSignOut();

  return (
    <>
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
      >
        <div className="d-flex align-items-center justify-content-between">
          <i className="bi bi-list toggle-sidebar-btn" onClick={handleShow} />
          <a href="/admin/home" className="logo d-flex align-items-center p-2">
            <img src="../public/images/logo.png" alt="" />
            <span className="d-none d-lg-block">QR Attendance</span>
          </a>
        </div>
        {/* End Logo */}
        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item dropdown pe-3">
              <a
                className="nav-link nav-profile d-flex align-items-center pe-0"
                href=" "
                data-bs-toggle="dropdown"
              >
                <img
                    src="../public/images/logo.png"
                    alt="Profile"
                    className="rounded-circle"
                    />
                <span className="d-none d-md-block ps-2">{auth?.name} ({auth?.role})</span>
              </a>
              {/* End Profile Iamge Icon */}
            </li>
            {/* End Profile Nav */}
          </ul>
        </nav>
        {/* End Icons Navigation */}
      </header>
      {/* End Header */}

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <a
              href="/admin/home"
              className="logo d-flex align-items-center p-2"
            >
              <img src="../public/images/logo.png" alt="" />
              <span className="d-lg-block">QR Attendance</span>
            </a>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="sidebar-nav" id="sidebar-nav">
            <li className="nav-item">
              <a className="nav-link collapsed" href="/admin/home">
                <i className="bi bi-grid" />
                <span>Dashboard</span>
              </a>
            </li>

            {auth?.role === "SuperAdmin" || auth?.role === "Admin" || auth?.role === "Encoder"? (
              <li className="nav-item">
                <a className="nav-link collapsed" href="/admin/instructors">
                  <i className="bi bi-person" />
                  <span>Instructors</span>
                </a>
              </li>
            ) : null}

            {auth?.role === "SuperAdmin" || auth?.role === "Admin" ? (
              <li className="nav-item">
                <a className="nav-link collapsed" href="/admin/attendance">
                  <i className="bi bi-layout-text-window-reverse" />
                  <span>Attendance Record</span>
                </a>
              </li>
            ) : null}

            {auth?.role === "SuperAdmin" || auth?.role === "Scanner" ? (
              <li className="nav-item">
                <a className="nav-link collapsed" href="/admin/logs">
                  <i className="bi bi-book" />
                  <span>Log Record</span>
                </a>
              </li>
            ) : null}

            {auth?.role === "Scanner" ? (
              <li className="nav-item">
                <a className="nav-link collapsed" href="/admin/scanner">
                  <i className="bi bi-qr-code" />
                  <span>Entrance Scanner</span>
                </a>
              </li>
            ) : null}

            {auth?.role === "SuperAdmin" ? (
              <li className="nav-item">
                <a className="nav-link collapsed" href="/admin/usermanagement">
                  <i className="bi bi-person-circle" />
                  <span>User Management</span>
                </a>
              </li>
            ) : null}

            <li className="nav-item">
              <a
                className="nav-link collapsed"
                href="/"
                onClick={() => signOut()}
              >
                <i className="bi bi-box-arrow-left" />
                <span>Sign Out</span>
              </a>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AdminNavBar;
