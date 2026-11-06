import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    CheckCircle,
    Pencil,
    Eye,
    EyeOff,
    Lock,
    Coffee,
    UserRound,
    Mail,
    Phone,
    ShieldCheck,
    KeyRound
} from 'lucide-react';

import './Profile.css';

function Profile() {
    const navigate = useNavigate();

    // =========================
    // PROFILE STATES
    // =========================

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [editing, setEditing] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [saving, setSaving] = useState(false);

    // =========================
    // PASSWORD STATES
    // =========================

    const [changingPassword, setChangingPassword] =
        useState(false);

    const [currentPassword, setCurrentPassword] =
        useState('');

    const [newPassword, setNewPassword] =
        useState('');

    const [confirmPassword, setConfirmPassword] =
        useState('');

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [passwordSaving, setPasswordSaving] =
        useState(false);

    // =========================
    // SUCCESS TOAST
    // =========================

    const showSuccessToast = (message) => {
        setSuccess(message);

        setTimeout(() => {
            setSuccess('');
        }, 3000);
    };

    // =========================
    // FETCH PROFILE
    // =========================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');
                setSuccess('');

                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(
                    'http://localhost:5000/api/users/profile',
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message ||
                        'Unable to load your profile.'
                    );
                    return;
                }

                if (data.success) {
                    setUser(data.user);

                    setName(data.user.name || '');
                    setEmail(data.user.email || '');
                    setPhone(data.user.phone || '');
                } else {
                    setError(
                        'Unable to load your profile.'
                    );
                }

            } catch (error) {
                console.error(
                    'Profile error:',
                    error
                );

                setError(
                    'Unable to connect to the server.'
                );

            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    // =========================
    // EDIT PROFILE
    // =========================

    const handleEdit = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setPhone(user?.phone || '');

        setError('');
        setSuccess('');

        setEditing(true);
        setChangingPassword(false);
    };

    // =========================
    // CANCEL EDIT
    // =========================

    const handleCancel = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setPhone(user?.phone || '');

        setError('');
        setSuccess('');

        setEditing(false);
    };

    // =========================
    // SAVE PROFILE
    // =========================

    const handleSave = async (e) => {
        e.preventDefault();

        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanPhone = phone.trim();

        if (!cleanName) {
            setError('Name is required.');
            return;
        }

        if (!cleanEmail) {
            setError('Email is required.');
            return;
        }

        try {
            setSaving(true);

            setError('');
            setSuccess('');

            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(
                'http://localhost:5000/api/users/profile',
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        name: cleanName,
                        email: cleanEmail,
                        phone: cleanPhone
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    'Unable to update your profile.'
                );

                return;
            }

            if (data.success) {
                const updatedUser = data.user;

                setUser(updatedUser);

                setName(updatedUser.name || '');
                setEmail(updatedUser.email || '');
                setPhone(updatedUser.phone || '');

                localStorage.setItem(
                    'user',
                    JSON.stringify(updatedUser)
                );

                window.dispatchEvent(
                    new Event('auth-change')
                );

                setEditing(false);

                showSuccessToast(
                    'Profile updated successfully!'
                );

            } else {
                setError(
                    data.message ||
                    'Unable to update your profile.'
                );
            }

        } catch (error) {
            console.error(
                'Update profile error:',
                error
            );

            setError(
                'Unable to connect to the server.'
            );

        } finally {
            setSaving(false);
        }
    };

    // =========================
    // OPEN CHANGE PASSWORD
    // =========================

    const handleOpenPassword = () => {
        setEditing(false);

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);

        setError('');
        setSuccess('');

        setChangingPassword(true);
    };

    // =========================
    // CANCEL PASSWORD CHANGE
    // =========================

    const handleCancelPassword = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);

        setError('');
        setSuccess('');

        setChangingPassword(false);
    };

    // =========================
    // CHANGE PASSWORD
    // =========================

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (!currentPassword) {
            setError(
                'Please enter your current password.'
            );

            return;
        }

        if (!newPassword) {
            setError(
                'Please enter a new password.'
            );

            return;
        }

        if (newPassword.length < 8) {
            setError(
                'New password must be at least 8 characters.'
            );

            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                'New password and confirm password do not match.'
            );

            return;
        }

        if (currentPassword === newPassword) {
            setError(
                'New password should be different from your current password.'
            );

            return;
        }

        try {
            setPasswordSaving(true);

            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(
                'http://localhost:5000/api/users/change-password',
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    'Unable to change password.'
                );

                return;
            }

            if (data.success) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');

                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmPassword(false);

                setChangingPassword(false);

                showSuccessToast(
                    'Password changed successfully!'
                );

            } else {
                setError(
                    data.message ||
                    'Unable to change password.'
                );
            }

        } catch (error) {
            console.error(
                'Change password error:',
                error
            );

            setError(
                'Unable to connect to the server.'
            );

        } finally {
            setPasswordSaving(false);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <main className="profile-page">

                <div className="profile-message">

                    <h1>
                        Loading Profile...
                    </h1>

                    <p>
                        Please wait while we load your profile.
                    </p>

                </div>

            </main>
        );
    }

    // =========================
    // ERROR WITHOUT USER
    // =========================

    if (error && !user) {
        return (
            <main className="profile-page">

                <div className="profile-message">

                    <h1>
                        Profile
                    </h1>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </button>

                </div>

            </main>
        );
    }

    // =========================
    // MAIN PROFILE
    // =========================

    return (
        <main className="profile-page">

            {/* =========================
                SUCCESS TOAST
            ========================= */}

            {success && (
                <div className="profile-success-toast">

                    <span className="profile-success-icon">
                        <CheckCircle
                            size={18}
                            strokeWidth={2.2}
                        />
                    </span>

                    <span>
                        {success}
                    </span>

                </div>
            )}

            <div className="profile-container">

                {/* =========================
                    PROFILE HEADER
                ========================= */}

                <div className="profile-header">

                    <span className="profile-label">
                        BREWMATCH
                    </span>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your personal information
                        and account security.
                    </p>

                </div>


                {/* =========================
                    ERROR MESSAGE
                ========================= */}

                {error && user && (
                    <div className="profile-error">
                        {error}
                    </div>
                )}


                {/* =========================
                    PROFILE CARD
                ========================= */}

                <div className="profile-card">

                    {/* =========================
                        AVATAR
                    ========================= */}

                    <div className="profile-avatar">

                        {user?.name
                            ? user.name
                                .charAt(0)
                                .toUpperCase()
                            : 'U'}

                    </div>


                    {/* =========================
                        NORMAL PROFILE VIEW
                    ========================= */}

                    {!editing && !changingPassword && (
                        <>

                            <div className="profile-user-heading">

                                <h2>
                                    {user?.name || 'User'}
                                </h2>

                                <p>
                                    {user?.email || ''}
                                </p>

                            </div>


                            {/* PERSONAL INFORMATION */}

                            <div className="profile-section">

                                <div className="profile-section-heading">

                                    <h3>
                                        <UserRound
                                            size={18}
                                            strokeWidth={2}
                                        />

                                        Personal Information
                                    </h3>

                                    <p>
                                        Your basic account information.
                                    </p>

                                </div>


                                <div className="profile-info">

                                    <div className="profile-info-item">

                                        <span>
                                            <UserRound
                                                size={16}
                                                strokeWidth={2}
                                            />

                                            Full Name
                                        </span>

                                        <strong>
                                            {user?.name ||
                                                'Not available'}
                                        </strong>

                                    </div>


                                    <div className="profile-info-item">

                                        <span>
                                            <Mail
                                                size={16}
                                                strokeWidth={2}
                                            />

                                            Email Address
                                        </span>

                                        <strong>
                                            {user?.email ||
                                                'Not available'}
                                        </strong>

                                    </div>


                                    <div className="profile-info-item">

                                        <span>
                                            <Phone
                                                size={16}
                                                strokeWidth={2}
                                            />

                                            Phone Number
                                        </span>

                                        <strong>
                                            {user?.phone ||
                                                'Not provided'}
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* ACCOUNT SECURITY */}

                            <div className="profile-section">

                                <div className="profile-section-heading">

                                    <h3>
                                        <ShieldCheck
                                            size={18}
                                            strokeWidth={2}
                                        />

                                        Account Security
                                    </h3>

                                    <p>
                                        Manage your password and account
                                        security.
                                    </p>

                                </div>


                                <div className="security-card">

                                    <div className="security-card-content">

                                        <strong>
                                            <Lock
                                                size={17}
                                                strokeWidth={2}
                                            />

                                            Password
                                        </strong>

                                        <p>
                                            Keep your password updated
                                            for better account security.
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        className="security-button"
                                        onClick={
                                            handleOpenPassword
                                        }
                                    >
                                        <KeyRound
                                            size={16}
                                            strokeWidth={2}
                                        />

                                        Change Password
                                    </button>

                                </div>

                            </div>


                            {/* PROFILE ACTIONS */}

                            <div className="profile-actions">

                                <button
                                    type="button"
                                    className="profile-edit-button"
                                    onClick={handleEdit}
                                >
                                    <Pencil
                                        size={16}
                                        strokeWidth={2}
                                    />

                                    Edit Profile
                                </button>


                                <button
                                    type="button"
                                    className="profile-coffee-button"
                                    onClick={() =>
                                        navigate('/coffees')
                                    }
                                >
                                    <Coffee
                                        size={16}
                                        strokeWidth={2}
                                    />

                                    Explore Coffees
                                </button>

                            </div>

                        </>
                    )}


                    {/* =========================
                        EDIT PROFILE
                    ========================= */}

                    {editing && (
                        <form
                            className="profile-edit-form"
                            onSubmit={handleSave}
                        >

                            <div className="profile-form-title">

                                <h2>
                                    Edit Profile
                                </h2>

                                <p>
                                    Update your personal information.
                                </p>

                            </div>


                            <div className="profile-form-group">

                                <label htmlFor="profile-name">
                                    Full Name
                                </label>

                                <input
                                    id="profile-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your full name"
                                    required
                                />

                            </div>


                            <div className="profile-form-group">

                                <label htmlFor="profile-email">
                                    Email Address
                                </label>

                                <input
                                    id="profile-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your email"
                                    required
                                />

                            </div>


                            <div className="profile-form-group">

                                <label htmlFor="profile-phone">
                                    Phone Number
                                </label>

                                <input
                                    id="profile-phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your phone number"
                                />

                            </div>


                            <div className="profile-edit-actions">

                                <button
                                    type="button"
                                    className="profile-cancel-button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="profile-save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? 'Saving...'
                                        : 'Save Changes'}
                                </button>

                            </div>

                        </form>
                    )}


                    {/* =========================
                        CHANGE PASSWORD
                    ========================= */}

                    {changingPassword && (
                        <form
                            className="profile-edit-form password-form"
                            onSubmit={
                                handleChangePassword
                            }
                        >

                            <div className="profile-form-title">

                                <h2>
                                    Change Password
                                </h2>

                                <p>
                                    Update your password to keep
                                    your account secure.
                                </p>

                            </div>


                            {/* CURRENT PASSWORD */}

                            <div className="profile-form-group">

                                <label htmlFor="current-password">
                                    Current Password
                                </label>

                                <div className="password-input-wrapper">

                                    <input
                                        id="current-password"
                                        type={
                                            showCurrentPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter current password"
                                        autoComplete="current-password"
                                    />


                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                !showCurrentPassword
                                            )
                                        }
                                        aria-label={
                                            showCurrentPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                    >
                                        {showCurrentPassword
                                            ? <EyeOff
                                                size={18}
                                                strokeWidth={2}
                                            />
                                            : <Eye
                                                size={18}
                                                strokeWidth={2}
                                            />}
                                    </button>

                                </div>

                            </div>


                            {/* NEW PASSWORD */}

                            <div className="profile-form-group">

                                <label htmlFor="new-password">
                                    New Password
                                </label>

                                <div className="password-input-wrapper">

                                    <input
                                        id="new-password"
                                        type={
                                            showNewPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter new password"
                                        autoComplete="new-password"
                                    />


                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowNewPassword(
                                                !showNewPassword
                                            )
                                        }
                                        aria-label={
                                            showNewPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                    >
                                        {showNewPassword
                                            ? <EyeOff
                                                size={18}
                                                strokeWidth={2}
                                            />
                                            : <Eye
                                                size={18}
                                                strokeWidth={2}
                                            />}
                                    </button>

                                </div>


                                <small>
                                    Password must be at least
                                    8 characters.
                                </small>

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="profile-form-group">

                                <label htmlFor="confirm-password">
                                    Confirm New Password
                                </label>

                                <div className="password-input-wrapper">

                                    <input
                                        id="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Confirm new password"
                                        autoComplete="new-password"
                                    />


                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                    >
                                        {showConfirmPassword
                                            ? <EyeOff
                                                size={18}
                                                strokeWidth={2}
                                            />
                                            : <Eye
                                                size={18}
                                                strokeWidth={2}
                                            />}
                                    </button>

                                </div>

                            </div>


                            {/* FORGOT PASSWORD */}

                            <div className="profile-forgot-password">

                                <span>
                                    Forgot your current password?
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            '/forgot-password'
                                        )
                                    }
                                >
                                    Reset Password
                                </button>

                            </div>


                            {/* PASSWORD ACTIONS */}

                            <div className="profile-edit-actions">

                                <button
                                    type="button"
                                    className="profile-cancel-button"
                                    onClick={
                                        handleCancelPassword
                                    }
                                    disabled={passwordSaving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="profile-save-button"
                                    disabled={passwordSaving}
                                >
                                    {passwordSaving
                                        ? 'Updating...'
                                        : 'Update Password'}
                                </button>

                            </div>

                        </form>
                    )}

                </div>

            </div>

        </main>
    );
}

export default Profile;