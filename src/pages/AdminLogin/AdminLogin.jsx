import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

import './AdminLogin.css';

function AdminLogin() {
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
      // CHECK ADMIN ROLE
      // ==========================================

      if (data.user?.role !== 'admin') {
        setError(
          'This login is only available for administrators.'
        );

        return;
      }

      // ==========================================
      // SAVE ADMIN LOGIN SEPARATELY
      // ==========================================

      localStorage.setItem(
        'adminToken',
        data.token
      );

      localStorage.setItem(
        'adminUser',
        JSON.stringify(data.user)
      );

      // ==========================================
      // GO TO ADMIN DASHBOARD
      // ==========================================

      navigate('/admin/dashboard');

    } catch (error) {
      console.error(
        'Admin login error:',
        error
      );

      setError(
        'Unable to connect to the server.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">

      <div className="admin-login-card">

        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-login-header">

          <div className="admin-login-icon">
            <ShieldCheck size={28} />
          </div>

          <span className="admin-login-label">
            BREWMATCH ADMIN
          </span>

          <h1>
            Admin Login
          </h1>

          <p>
            Sign in to manage your BrewMatch platform.
          </p>

        </div>


        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}


        {/* =========================
            FORM
        ========================= */}

        <form
          className="admin-login-form"
          onSubmit={handleLogin}
        >

          {/* EMAIL */}

          <div className="admin-login-form-group">

            <label htmlFor="admin-email">
              Email Address
            </label>

            <input
              id="admin-email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="admin-login-form-group">

            <label htmlFor="admin-password">
              Password
            </label>

            <div className="admin-password-wrapper">

              <input
                id="admin-password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Enter admin password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="admin-password-toggle"
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
            className="admin-login-button"
            disabled={loading}
          >

            {loading
              ? 'Signing in...'
              : 'Admin Login'}

          </button>

        </form>

      </div>

    </main>
  );
}

export default AdminLogin;