import { useEffect, useState } from 'react';

import {
    UserRound,
    Mail,
    Phone,
    Lock,
    Save,
    Eye,
    EyeOff,
    KeyRound,
    CheckCircle,
    X
} from 'lucide-react';

import './AdminSettings.css';

function AdminSettings() {

    // =========================
    // PROFILE STATE
    // =========================

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // =========================
    // PASSWORD STATE
    // =========================

    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // =========================
    // PAGE STATES
    // =========================

    const [loading, setLoading] = useState(true);

    const [savingProfile, setSavingProfile] =
        useState(false);

    const [savingPassword, setSavingPassword] =
        useState(false);

    // =========================
    // MESSAGES
    // =========================

    const [profileError, setProfileError] =
        useState('');

    const [passwordError, setPasswordError] =
        useState('');

    // =========================
    // TOAST
    // =========================

    const [toast, setToast] = useState({
        show: false,
        message: ''
    });

    // =========================
    // PASSWORD VISIBILITY
    // =========================

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    // =========================
    // SHOW TOAST
    // =========================

    const showToast = (message) => {
        setToast({
            show: true,
            message
        });
    };


    // =========================
    // CLOSE TOAST
    // =========================

    const closeToast = () => {
        setToast({
            show: false,
            message: ''
        });
    };


    // =========================
    // GET ADMIN PROFILE
    // =========================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token =
                    localStorage.getItem('adminToken');

                if (!token) {

                    setProfileError(
                        'Please login as admin first.'
                    );

                    setLoading(false);

                    return;
                }

                const response = await fetch(
                    'http://localhost:5000/api/users/profile',
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'Failed to load profile.'
                    );
                }

                const user =
                    data.user ||
                    data.profile;

                setProfile({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || ''
                });

            } catch (error) {

                console.error(
                    'Admin profile error:',
                    error
                );

                setProfileError(
                    error.message ||
                    'Failed to load profile.'
                );

            } finally {

                setLoading(false);
            }
        };

        fetchProfile();

    }, []);


    // =========================
    // PROFILE INPUT CHANGE
    // =========================

    const handleProfileChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value
        }));

        setProfileError('');
    };


    // =========================
    // PASSWORD INPUT CHANGE
    // =========================

    const handlePasswordChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setPassword((previous) => ({
            ...previous,
            [name]: value
        }));

        setPasswordError('');
    };


    // =========================
    // UPDATE PROFILE
    // =========================

    const handleProfileSubmit = async (event) => {

        event.preventDefault();

        setSavingProfile(true);

        setProfileError('');

        try {

            const token =
                localStorage.getItem('adminToken');

            if (!token) {

                throw new Error(
                    'Please login again.'
                );
            }

            const updatedProfile = {
                name: profile.name.trim(),
                email: profile.email.trim(),
                phone: profile.phone.trim()
            };

            const response = await fetch(
                'http://localhost:5000/api/users/profile',
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json',

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify(
                        updatedProfile
                    )
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'Failed to update profile.'
                );
            }

            // =========================
            // UPDATE ADMIN USER
            // =========================

            const savedAdmin =
                JSON.parse(
                    localStorage.getItem('adminUser') ||
                    'null'
                );

            if (savedAdmin) {

                localStorage.setItem(
                    'adminUser',
                    JSON.stringify({
                        ...savedAdmin,
                        ...updatedProfile
                    })
                );
            }

            showToast(
                'Profile updated successfully.'
            );

        } catch (error) {

            console.error(
                'Update profile error:',
                error
            );

            setProfileError(
                error.message ||
                'Failed to update profile.'
            );

        } finally {

            setSavingProfile(false);
        }
    };


    // =========================
    // CHANGE PASSWORD
    // =========================

    const handlePasswordSubmit = async (event) => {

        event.preventDefault();

        setPasswordError('');


        // =========================
        // VALIDATE PASSWORD
        // =========================

        if (
            !password.currentPassword ||
            !password.newPassword ||
            !password.confirmPassword
        ) {

            setPasswordError(
                'Please fill in all password fields.'
            );

            return;
        }


        if (password.newPassword.length < 6) {

            setPasswordError(
                'New password must be at least 6 characters.'
            );

            return;
        }


        if (
            password.newPassword !==
            password.confirmPassword
        ) {

            setPasswordError(
                'New password and confirm password do not match.'
            );

            return;
        }


        if (
            password.currentPassword ===
            password.newPassword
        ) {

            setPasswordError(
                'New password must be different from your current password.'
            );

            return;
        }


        setSavingPassword(true);

        try {

            const token =
                localStorage.getItem('adminToken');

            if (!token) {

                throw new Error(
                    'Please login again.'
                );
            }

            const response = await fetch(
                'http://localhost:5000/api/users/change-password',
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json',

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        currentPassword:
                            password.currentPassword,

                        newPassword:
                            password.newPassword
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'Failed to change password.'
                );
            }

            setPassword({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            showToast(
                'Password changed successfully.'
            );

        } catch (error) {

            console.error(
                'Change password error:',
                error
            );

            setPasswordError(
                error.message ||
                'Failed to change password.'
            );

        } finally {

            setSavingPassword(false);
        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <main className="admin-settings-page">

                <div className="admin-settings-loading">
                    Loading profile...
                </div>

            </main>
        );
    }


    // =========================
    // PAGE
    // =========================

    return (

        <main className="admin-settings-page">

            {/* =========================
                TOAST
            ========================= */}

            {toast.show && (

                <div className="admin-settings-toast">

                    <div className="admin-settings-toast-icon">

                        <CheckCircle
                            size={19}
                            strokeWidth={2}
                        />

                    </div>

                    <div className="admin-settings-toast-content">

                        <strong>
                            {toast.message}
                        </strong>

                    </div>

                    <button
                        type="button"
                        className="admin-settings-toast-close"
                        onClick={closeToast}
                        aria-label="Close notification"
                    >

                        <X size={16} />

                    </button>

                </div>
            )}


            {/* =========================
                HEADER
            ========================= */}

            <header className="admin-settings-header">

                <p className="admin-settings-label">
                    BREWMATCH ADMIN
                </p>

                <h1>
                    Profile Settings
                </h1>

                <p className="admin-settings-description">
                    Manage your administrator profile
                    and account security.
                </p>

            </header>


            {/* =========================
                PROFILE CARD
            ========================= */}

            <section className="admin-settings-card">

                <div className="admin-settings-card-header">

                    <div className="admin-settings-profile-icon">

                        <UserRound
                            size={25}
                        />

                    </div>

                    <div>

                        <h2>
                            Personal Information
                        </h2>

                        <p>
                            Update your admin account
                            details.
                        </p>

                    </div>

                </div>


                {/* =========================
                    PROFILE FORM
                ========================= */}

                <form
                    className="admin-settings-form"
                    onSubmit={handleProfileSubmit}
                >

                    {/* NAME */}

                    <div className="admin-settings-field">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <div className="admin-settings-input-wrapper">

                            <UserRound
                                size={18}
                            />

                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleProfileChange}
                                placeholder="Enter your name"
                                required
                            />

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="admin-settings-field">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <div className="admin-settings-input-wrapper">

                            <Mail
                                size={18}
                            />

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                placeholder="Enter your email"
                                required
                            />

                        </div>

                    </div>


                    {/* PHONE */}

                    <div className="admin-settings-field">

                        <label htmlFor="phone">
                            Phone Number
                        </label>

                        <div className="admin-settings-input-wrapper">

                            <Phone
                                size={18}
                            />

                            <input
                                id="phone"
                                type="text"
                                name="phone"
                                value={profile.phone}
                                onChange={handleProfileChange}
                                placeholder="Enter your phone number"
                            />

                        </div>

                    </div>


                    {/* PROFILE ERROR */}

                    {profileError && (

                        <div className="admin-settings-form-error">
                            {profileError}
                        </div>

                    )}


                    {/* PROFILE SAVE */}

                    <div className="admin-settings-actions">

                        <button
                            type="submit"
                            className="admin-settings-save"
                            disabled={savingProfile}
                        >

                            <Save
                                size={18}
                            />

                            {savingProfile
                                ? 'Saving...'
                                : 'Save Changes'
                            }

                        </button>

                    </div>

                </form>

            </section>


            {/* =========================
                PASSWORD CARD
            ========================= */}

            <section className="admin-settings-card">

                <div className="admin-settings-card-header">

                    <div className="admin-settings-profile-icon">

                        <KeyRound
                            size={25}
                        />

                    </div>

                    <div>

                        <h2>
                            Change Password
                        </h2>

                        <p>
                            Update your administrator
                            account password.
                        </p>

                    </div>

                </div>


                {/* =========================
                    PASSWORD FORM
                ========================= */}

                <form
                    className="admin-settings-form"
                    onSubmit={handlePasswordSubmit}
                >

                    {/* CURRENT PASSWORD */}

                    <div className="admin-settings-field">

                        <label htmlFor="currentPassword">
                            Current Password
                        </label>

                        <div className="admin-settings-input-wrapper">

                            <Lock
                                size={18}
                            />

                            <input
                                id="currentPassword"
                                type={
                                    showCurrentPassword
                                        ? 'text'
                                        : 'password'
                                }
                                name="currentPassword"
                                value={
                                    password.currentPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                placeholder="Enter current password"
                                required
                            />

                            <button
                                type="button"
                                className="admin-password-toggle"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                aria-label={
                                    showCurrentPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >

                                {showCurrentPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}

                            </button>

                        </div>

                    </div>


                    {/* NEW PASSWORD */}

                    <div className="admin-settings-field">

                        <label htmlFor="newPassword">
                            New Password
                        </label>

                        <div className="admin-settings-input-wrapper">

                            <Lock
                                size={18}
                            />

                            <input
                                id="newPassword"
                                type={
                                    showNewPassword
                                        ? 'text'
                                        : 'password'
                                }
                                name="newPassword"
                                value={
                                    password.newPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                placeholder="Enter new password"
                                required
                            />

                            <button
                                type="button"
                                className="admin-password-toggle"
                                onClick={() =>
                                    setShowNewPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                aria-label={
                                    showNewPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >

                                {showNewPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}

                            </button>

                        </div>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="admin-settings-field">

                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>

                        <div className="admin-settings-input-wrapper">

                            <Lock
                                size={18}
                            />

                            <input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? 'text'
                                        : 'password'
                                }
                                name="confirmPassword"
                                value={
                                    password.confirmPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                placeholder="Confirm new password"
                                required
                            />

                            <button
                                type="button"
                                className="admin-password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >

                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}

                            </button>

                        </div>

                    </div>


                    {/* PASSWORD ERROR */}

                    {passwordError && (

                        <div className="admin-settings-form-error">
                            {passwordError}
                        </div>

                    )}


                    {/* PASSWORD SAVE */}

                    <div className="admin-settings-actions">

                        <button
                            type="submit"
                            className="admin-settings-save"
                            disabled={savingPassword}
                        >

                            <Lock
                                size={18}
                            />

                            {savingPassword
                                ? 'Updating...'
                                : 'Update Password'
                            }

                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}

export default AdminSettings;