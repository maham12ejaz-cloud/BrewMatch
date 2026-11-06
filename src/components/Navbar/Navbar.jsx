import { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import {
  Home as HomeIcon,
  Coffee,
  Heart,
  ShoppingCart,
  LogIn,
  User,
  LogOut,
  CheckCircle,
  X
} from 'lucide-react';

import './Navbar.css';

import logo from '../../assets/logo.png';


function Navbar() {

  const location = useLocation();
  const navigate = useNavigate();


  // ==========================================
  // GET STORED USER
  // ==========================================

  const getStoredUser = () => {

    const storedUser =
      localStorage.getItem('user');

    if (!storedUser) {
      return null;
    }

    try {

      return JSON.parse(storedUser);

    } catch (error) {

      console.error(
        'User data error:',
        error
      );

      localStorage.removeItem('user');
      localStorage.removeItem('token');

      return null;
    }
  };


  // ==========================================
  // USER STATE
  // ==========================================

  const [user, setUser] =
    useState(getStoredUser);


  // ==========================================
  // TOAST STATE
  // ==========================================

  const [toast, setToast] = useState({
    show: false,
    message: ''
  });


  // ==========================================
  // ACTIVE LINK
  // ==========================================

  const isActive = (path) => {

    return location.pathname === path;

  };


  // ==========================================
  // SHOW TOAST
  // ==========================================

  const showToast = (message) => {

    setToast({
      show: true,
      message
    });

  };


  // ==========================================
  // CLOSE TOAST
  // ==========================================

  const closeToast = () => {

    setToast({
      show: false,
      message: ''
    });

  };


  // ==========================================
  // AUTH STATE LISTENER
  // ==========================================

  useEffect(() => {

    // ----------------------------------------
    // CHECK CURRENT USER
    // ----------------------------------------

    const checkUser = () => {

      const currentUser =
        getStoredUser();

      setUser(currentUser);

    };


    // ----------------------------------------
    // LOGIN SUCCESS
    // ----------------------------------------

    const handleLoginSuccess = () => {

      checkUser();

      showToast(
        'Login successful. Welcome back!'
      );

    };


    // ----------------------------------------
    // AUTH CHANGE
    // ----------------------------------------

    window.addEventListener(
      'auth-change',
      checkUser
    );


    // ----------------------------------------
    // STORAGE CHANGE
    // ----------------------------------------

    window.addEventListener(
      'storage',
      checkUser
    );


    // ----------------------------------------
    // LOGIN SUCCESS EVENT
    // ----------------------------------------

    window.addEventListener(
      'login-success',
      handleLoginSuccess
    );


    // ----------------------------------------
    // INITIAL CHECK
    // ----------------------------------------

    checkUser();


    // ----------------------------------------
    // CLEANUP
    // ----------------------------------------

    return () => {

      window.removeEventListener(
        'auth-change',
        checkUser
      );

      window.removeEventListener(
        'storage',
        checkUser
      );

      window.removeEventListener(
        'login-success',
        handleLoginSuccess
      );

    };

  }, [location.pathname]);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    // Remove normal user session
    localStorage.removeItem('token');
    localStorage.removeItem('user');


    // Update navbar immediately
    setUser(null);


    // Notify other components
    window.dispatchEvent(
      new Event('auth-change')
    );


    // Show logout toast
    showToast(
      'Logged out successfully.'
    );


    // Go to login page
    navigate('/login');

  };


  return (
    <nav className="navbar">


      {/* ======================================
          AUTH TOAST
      ====================================== */}

      {toast.show && (

        <div className="navbar-toast">

          <div className="navbar-toast-icon">

            <CheckCircle
              size={19}
              strokeWidth={2}
            />

          </div>


          <div className="navbar-toast-content">

            <strong>
              {toast.message}
            </strong>

          </div>


          <button
            type="button"
            className="navbar-toast-close"
            onClick={closeToast}
            aria-label="Close notification"
          >

            <X size={16} />

          </button>

        </div>

      )}


      <div className="navbar-container">


        {/* ======================================
            LOGO
        ====================================== */}

        <Link
          to="/"
          className="navbar-logo"
        >

          <img
            src={logo}
            alt="BrewMatch"
          />

        </Link>


        {/* ======================================
            NAVIGATION LINKS
        ====================================== */}

        <ul className="navbar-links">


          {/* HOME */}

          <li>

            <Link
              to="/"
              className={
                isActive('/')
                  ? 'active'
                  : ''
              }
            >

              <HomeIcon
                className="nav-icon"
              />

              <span>
                Home
              </span>

            </Link>

          </li>


          {/* FIND MY COFFEE */}

          <li>

            <Link
              to="/quiz"
              className={
                isActive('/quiz')
                  ? 'active'
                  : ''
              }
            >

              <Coffee
                className="nav-icon"
              />

              <span>
                Find My Coffee
              </span>

            </Link>

          </li>


          {/* COFFEES */}

          <li>

            <Link
              to="/coffees"
              className={
                isActive('/coffees')
                  ? 'active'
                  : ''
              }
            >

              <Coffee
                className="nav-icon"
              />

              <span>
                Coffees
              </span>

            </Link>

          </li>


          {/* FAVORITES */}

          <li>

            <Link
              to="/favorites"
              className={
                isActive('/favorites')
                  ? 'active'
                  : ''
              }
            >

              <Heart
                className="nav-icon"
              />

              <span>
                Favorites
              </span>

            </Link>

          </li>


          {/* CART */}

          <li>

            <Link
              to="/cart"
              className={
                isActive('/cart')
                  ? 'active'
                  : ''
              }
            >

              <ShoppingCart
                className="nav-icon"
              />

              <span>
                Cart
              </span>

            </Link>

          </li>

        </ul>


        {/* ======================================
            AUTH SECTION
        ====================================== */}

        {user ? (

          <div className="navbar-user-section">


            {/* ==================================
                PROFILE
            ================================== */}

            <Link
              to="/profile"
              className={
                isActive('/profile')
                  ? 'navbar-user active'
                  : 'navbar-user'
              }
            >

              <User
                className="user-icon"
              />

              <span>
                {user.name || 'Profile'}
              </span>

            </Link>


            {/* ==================================
                LOGOUT
            ================================== */}

            <button
              type="button"
              className="navbar-logout-button"
              onClick={handleLogout}
            >

              <LogOut
                className="logout-icon"
              />

              <span>
                Logout
              </span>

            </button>

          </div>

        ) : (


          /* ====================================
             LOGIN
          ==================================== */

          <Link
            to="/login"
            className={
              isActive('/login')
                ? 'navbar-login-button active'
                : 'navbar-login-button'
            }
          >

            <LogIn
              className="login-icon"
            />

            <span>
              Login
            </span>

          </Link>

        )}

      </div>

    </nav>
  );
}


export default Navbar;