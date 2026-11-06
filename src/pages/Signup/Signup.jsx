import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  Eye,
  EyeOff
} from 'lucide-react';

import './Signup.css';

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(
        'http://localhost:5000/api/auth/signup',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            name,
            email,
            password,
            phone
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || 'Unable to create account.'
        );

        return;
      }

      setSuccess(
        'Account created successfully! Redirecting to login...'
      );

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      console.error('Signup error:', error);

      setError(
        'Unable to connect to the server.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">

      <div className="signup-card">

        {/* =========================
            SIGNUP HEADER
        ========================= */}

        <div className="signup-header">

          <span className="signup-label">
            BREWMATCH
          </span>

          <h1>
            Create Account
          </h1>

          <p>
            Create your account and start your coffee journey.
          </p>

        </div>


        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {error && (
          <div className="signup-error">
            {error}
          </div>
        )}


        {/* =========================
            SUCCESS MESSAGE
        ========================= */}

        {success && (
          <div className="signup-success">
            {success}
          </div>
        )}


        {/* =========================
            SIGNUP FORM
        ========================= */}

        <form
          className="signup-form"
          onSubmit={handleSignup}
        >

          {/* NAME */}

          <div className="signup-form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

          </div>


          {/* EMAIL */}

          <div className="signup-form-group">

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


          {/* PHONE */}

          <div className="signup-form-group">

            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

          </div>


          {/* PASSWORD */}

          <div className="signup-form-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="signup-password-wrapper">

              <input
                id="password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="signup-password-toggle"
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


          {/* SIGNUP BUTTON */}

          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading
              ? 'Creating Account...'
              : 'Create Account'}
          </button>

        </form>


        {/* =========================
            LOGIN LINK
        ========================= */}

        <div className="signup-login">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Signup;