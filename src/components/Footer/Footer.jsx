
import { Link } from 'react-router-dom';

import {
  Home,
  Coffee,
  Heart,
  ShoppingCart
} from 'lucide-react';

import './Footer.css';

import logo from '../../assets/logo.png';

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}

        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            <img src={logo} alt="BrewMatch" />
          </Link>

          <p>
            Find the coffee that perfectly
            matches your taste.
          </p>

        </div>


        {/* Quick Links */}

        <div className="footer-links">

          <h3>Quick Links</h3>

          <div className="footer-links-list">

            <Link to="/">
              <Home className="footer-link-icon" />
              <span>Home</span>
            </Link>

            <Link to="/quiz">
              <Coffee className="footer-link-icon" />
              <span>Find My Coffee</span>
            </Link>

            <Link to="/coffees">
              <Coffee className="footer-link-icon" />
              <span>Coffees</span>
            </Link>

            <Link to="/favorites">
              <Heart className="footer-link-icon" />
              <span>Favorites</span>
            </Link>

            <Link to="/cart">
              <ShoppingCart className="footer-link-icon" />
              <span>Cart</span>
            </Link>

          </div>

        </div>

      </div>


      {/* Footer Bottom */}

      <div className="footer-bottom">

        <p>
          © 2026 BrewMatch. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;
