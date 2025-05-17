import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold text-primary fs-3" to="/">
          JobPortal
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Common Links */}
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-dark" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-dark" to="/job-listings">Jobs</Link>
            </li>

            {user ? (
              <>
                {/* Employer-Specific Links */}
                {user.role === "employer" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link fw-semibold text-dark" to="/employer-dashboard">
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="btn btn-success text-white fw-semibold ms-3" to="/post-job">
                        + Post Job
                      </Link>
                    </li>
                  </>
                )}

                {/* Jobseeker-Specific Links */}
                {user.role === "jobseeker" && (
                  <li className="nav-item">
                    <Link className="nav-link fw-semibold text-dark" to="/my-applications">
                      My Applications
                    </Link>
                  </li>
                )}

                {/* User Info & Logout */}
                {user?.name && user?.role && (
                  <li className="nav-item">
                    <span className="nav-link fw-bold text-primary">
                      {user.name} ({user.role.toUpperCase()})
                    </span>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-outline-primary ms-3 fw-semibold" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-primary fw-semibold ms-3" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
