import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

function NavBar() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const auth = useAuthUser()

    const signOut = useSignOut()

  return (
    <>
        <header id="header" className="header fixed-top d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
            <i className="bi bi-list toggle-sidebar-btn" onClick={handleShow}/>
            <a href="/home" className="logo d-flex align-items-center p-2">
                <img src="src/assets/img/logo.png" alt="" />
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
                    src="src/assets/img/profile-img.jpg"
                    alt="Profile"
                    className="rounded-circle"
                    />
                    <span className="d-none d-md-block ps-2">
                    {auth?.name}
                    </span>
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
                    <a href="/home" className="logo d-flex align-items-center p-2">
                        <img src="src/assets/img/logo.png" alt="" />
                        <span className="d-lg-block">QR Attendance</span>
                    </a>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ul className="sidebar-nav" id="sidebar-nav">
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/home">
                        <i className="bi bi-grid" />
                        <span>Dashboard</span>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/students">
                        <i className="bi bi-people" />
                        <span>Students</span>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/attendance">
                        <i className="bi bi-layout-text-window-reverse" />
                        <span>Attendance Records</span>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" href=" ">
                        <i className="bi bi-qr-code" />
                        <span>Scanner</span>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/" onClick={() => signOut()}>
                        <i className="bi bi-box-arrow-left" />
                        <span>Sign Out</span>
                        </a>
                    </li>
                </ul>
            </Offcanvas.Body>
        </Offcanvas>
    </>
  )
}

export default NavBar
