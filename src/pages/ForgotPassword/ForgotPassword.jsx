import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './ForgotPassword.css';

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://localhost:5000/api/users/forgot-password',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email: cleanEmail
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            'Unable to find your account.'
        );

        return;
      }

      if (data.success) {
        setUser(data.user);

        setSuccess(
          'Account found successfully!'
        );
      }
    } catch (error) {
      console.error(
        'Forgot password error:',
        error
      );

      setError(
        'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!user) {
      return;
    }

    navigate(
      `/reset-password?email=${encodeURIComponent(
        user.email
      )}`
    );
  };

  return (
    <main className="forgot-password-page">

      <div className="forgot-password-card">

        {/* HEADER */}

        <div className="forgot-password-header">

          <span className="forgot-password-label">
            BREWMATCH
          </span>

          <h1>Forgot Password?</h1>

          <p>
            Enter your email address and we'll
            help you reset your password.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="forgot-password-error">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="forgot-password-success">
            {success}
          </div>
        )}

        {/* FORM */}

        {!user && (
          <form
            className="forgot-password-form"
            onSubmit={handleSubmit}
          >

            <div className="forgot-form-group">

              <label htmlFor="forgot-email">
                Email Address
              </label>

              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                required
              />

            </div>

            <button
              type="submit"
              className="forgot-submit-button"
              disabled={loading}
            >
              {loading
                ? 'Checking...'
                : 'Continue'}
            </button>

          </form>
        )}

        {/* ACCOUNT FOUND */}

        {user && (
          <div className="account-found">

            <div className="account-found-icon">
              ✓
            </div>

            <h2>
              Account Found
            </h2>

            <p>
              We found an account for:
            </p>

            <strong>
              {user.email}
            </strong>

            <button
              type="button"
              className="forgot-submit-button"
              onClick={handleContinue}
            >
              Continue to Reset Password
            </button>

          </div>
        )}

        {/* BACK TO LOGIN */}

        <button
          type="button"
          className="back-login-button"
          onClick={() => navigate('/login')}
        >
          ← Back to Login
        </button>

      </div>

    </main>
  );
}

export default ForgotPassword;