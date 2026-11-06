import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import './ResetPassword.css';

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = searchParams.get('email') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        if (!email) {
            setError('Invalid password reset request.');
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:5000/api/users/reset-password',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        newPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to reset password.'
                );
            }

            setSuccess(true);
            setMessage(
                data.message || 'Password reset successfully.'
            );

            setNewPassword('');
            setConfirmPassword('');

        } catch (err) {
            setError(
                err.message ||
                'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-page">

            <div className="reset-password-card">

                {!success ? (
                    <>
                        <div className="reset-password-icon">
                            🔐
                        </div>

                        <h1>Reset Password</h1>

                        <p className="reset-password-subtitle">
                            Create a new password for your account.
                        </p>

                        <div className="reset-email-box">
                            <span>Email</span>
                            <strong>{email}</strong>
                        </div>

                        <form
                            onSubmit={handleResetPassword}
                            className="reset-password-form"
                        >

                            <div className="reset-input-group">

                                <label>
                                    New Password
                                </label>

                                <div className="password-input-wrapper">

                                    <input
                                        type={
                                            showNewPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowNewPassword(
                                                !showNewPassword
                                            )
                                        }
                                    >
                                        {showNewPassword ? '🙈' : '👁️'}
                                    </button>

                                </div>

                            </div>


                            <div className="reset-input-group">

                                <label>
                                    Confirm Password
                                </label>

                                <div className="password-input-wrapper">

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword
                                            ? '🙈'
                                            : '👁️'}
                                    </button>

                                </div>

                            </div>


                            {error && (
                                <div className="reset-error">
                                    {error}
                                </div>
                            )}


                            <button
                                type="submit"
                                className="reset-password-button"
                                disabled={loading}
                            >
                                {loading
                                    ? 'Updating...'
                                    : 'Update Password'}
                            </button>

                        </form>


                        <button
                            className="back-login-button"
                            onClick={() => navigate('/login')}
                        >
                            ← Back to Login
                        </button>
                    </>
                ) : (

                    <div className="reset-success">

                        <div className="success-icon">
                            ✓
                        </div>

                        <h1>Password Updated</h1>

                        <p>
                            Your password has been updated
                            successfully.
                        </p>

                        {message && (
                            <div className="success-message">
                                {message}
                            </div>
                        )}

                        <button
                            className="reset-password-button"
                            onClick={() => navigate('/login')}
                        >
                            Go to Login
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
}

export default ResetPassword;