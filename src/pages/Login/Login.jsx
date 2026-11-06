import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  Eye,
  EyeOff
} from 'lucide-react';

import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || 'Invalid email or password.'
        );

        return;
      }

      // ==========================================
      // ADMIN LOGIN BLOCK
      // ==========================================

      if (data.user?.role === 'admin') {
        setError(
          'Admin account detected. Please use the Admin Login page.'
        );

        return;
      }

      // ==========================================
      // SAVE USER LOGIN
      // ==========================================

      localStorage.setItem(
        'token',
        data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      // ==========================================
      // UPDATE NAVBAR
      // ==========================================

      window.dispatchEvent(
        new Event('auth-change')
      );

      // ==========================================
      // LOGIN SUCCESS TOAST
      // ==========================================

      window.dispatchEvent(
        new Event('login-success')
      );

      // Go to coffees page
      navigate('/coffees');

    } catch (error) {
      console.error('Login error:', error);

      setError(
        'Unable to connect to the server.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      <div className="login-card">

        {/* =========================
            LOGIN HEADER
        ========================= */}

        <div className="login-header">

          <span className="login-label">
            BREWMATCH
          </span>

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to continue your coffee journey.
          </p>

        </div>


        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        {/* =========================
            LOGIN FORM
        ========================= */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* EMAIL */}

          <div className="login-form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="login-form-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff />
                ) : (
                  <Eye />
                )}
              </button>

            </div>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? 'Logging in...'
              : 'Login'}
          </button>

        </form>


        {/* =========================
            SIGNUP LINK
        ========================= */}

        <div className="login-signup">

          <span>
            Don't have an account?
          </span>

          <Link to="/signup">
            Create Account
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Login;