import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5 Fixed-bottom">
      <div className="container text-center">
        {/* Logo & Branding */}
        <h4 className="fw-bold text-primary">JobPortal</h4>

        {/* Quick Links */}
        <ul className="list-unstyled d-flex justify-content-center gap-4 mt-3">
          <li>
            <Link className="text-light text-decoration-none" to="/">Home</Link>
          </li>
          <li>
            <Link className="text-light text-decoration-none" to="/job-listings">Jobs</Link>
          </li>
          <li>
            <Link className="text-light text-decoration-none" to="/contact">Contact</Link>
          </li>
          <li>
            <Link className="text-light text-decoration-none" to="/about">About Us</Link>
          </li>
        </ul>

        {/* Social Media Icons */}
        <div className="mt-3 d-flex justify-content-center gap-3">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light fs-4">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light fs-4">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light fs-4">
            <FaLinkedin />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light fs-4">
            <FaFacebook />
          </a>
        </div>

        {/* Copyright */}
        <p className="mt-3 mb-0 small">&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
