import { useEffect, useMemo, useState } from 'react';

import {
    Users,
    UserRound,
    ShieldCheck,
    Search,
    RotateCcw,
    ArrowUpDown,
    X,
    Mail,
    Phone,
    CalendarDays,
    Hash,
    CircleUserRound
} from 'lucide-react';

import './AdminUsers.css';

const API_URL = 'http://localhost:5000/api/admin/users';

function AdminUsers() {

    // ========================================
    // STATE
    // ========================================

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    const [roleFilter, setRoleFilter] = useState('all');

    const [sortOption, setSortOption] = useState(
        'newest'
    );

    const [selectedUser, setSelectedUser] =
        useState(null);


    // ========================================
    // FETCH USERS
    // ========================================

    useEffect(() => {

        let cancelled = false;

        const loadUsers = async () => {

            try {

                setLoading(true);

                setError('');

                const token =
                    localStorage.getItem('adminToken');

                const response = await fetch(
                    API_URL,
                    {
                        method: 'GET',

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
                        'Failed to fetch users'
                    );
                }

                if (cancelled) {
                    return;
                }

                setUsers(
                    Array.isArray(data.users)
                        ? data.users
                        : []
                );

            } catch (fetchError) {

                if (cancelled) {
                    return;
                }

                console.error(
                    'Fetch users error:',
                    fetchError
                );

                setError(
                    fetchError.message ||
                    'Failed to load users'
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadUsers();

        return () => {
            cancelled = true;
        };

    }, []);


    // ========================================
    // SUMMARY COUNTS
    // ========================================

    const totalUsers = users.length;

    const regularUsers = users.filter(
        (user) => user.role === 'user'
    ).length;

    const adminUsers = users.filter(
        (user) => user.role === 'admin'
    ).length;


    // ========================================
    // FILTER + SEARCH + SORT
    // ========================================

    const filteredUsers = useMemo(() => {

        let result = [...users];

        const search =
            searchTerm
                .trim()
                .toLowerCase();


        // Search
        if (search) {

            result = result.filter((user) => {

                return (
                    String(user.id)
                        .toLowerCase()
                        .includes(search) ||

                    String(user.name || '')
                        .toLowerCase()
                        .includes(search) ||

                    String(user.email || '')
                        .toLowerCase()
                        .includes(search) ||

                    String(user.phone || '')
                        .toLowerCase()
                        .includes(search)
                );
            });
        }


        // Role filter
        if (roleFilter !== 'all') {

            result = result.filter(
                (user) =>
                    user.role === roleFilter
            );
        }


        // Sorting
        result.sort((a, b) => {

            if (
                sortOption === 'newest'
            ) {
                return (
                    new Date(b.created_at) -
                    new Date(a.created_at)
                );
            }

            if (
                sortOption === 'oldest'
            ) {
                return (
                    new Date(a.created_at) -
                    new Date(b.created_at)
                );
            }

            if (
                sortOption === 'nameAsc'
            ) {
                return String(a.name || '')
                    .localeCompare(
                        String(b.name || '')
                    );
            }

            if (
                sortOption === 'nameDesc'
            ) {
                return String(b.name || '')
                    .localeCompare(
                        String(a.name || '')
                    );
            }

            return 0;
        });

        return result;

    }, [
        users,
        searchTerm,
        roleFilter,
        sortOption
    ]);


    // ========================================
    // RESET FILTERS
    // ========================================

    const handleReset = () => {

        setSearchTerm('');

        setRoleFilter('all');

        setSortOption('newest');
    };


    // ========================================
    // FORMAT DATE
    // ========================================

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return '—';
        }

        const date =
            new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return '—';
        }

        return date.toLocaleDateString(
            'en-US',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }
        );
    };


    // ========================================
    // FORMAT ROLE
    // ========================================

    const formatRole = (role) => {

        if (role === 'admin') {
            return 'Admin';
        }

        return 'User';
    };


    // ========================================
    // RENDER
    // ========================================

    return (
        <main className="admin-users-page">

            {/* ==================================
                HEADER
            ================================== */}

            <section className="admin-users-header">

                <div>
                    <p className="admin-users-label">
                        USER MANAGEMENT
                    </p>

                    <h1>
                        Users
                    </h1>

                    <p className="admin-users-subtitle">
                        View and manage registered
                        BrewMatch users.
                    </p>
                </div>

            </section>


            {/* ==================================
                SUMMARY CARDS
            ================================== */}

            <section className="admin-users-stats">

                <div className="admin-users-stat-card">

                    <div className="admin-users-stat-icon">
                        <Users
                            size={21}
                            strokeWidth={2}
                        />
                    </div>

                    <div>
                        <span>
                            Total Users
                        </span>

                        <strong>
                            {totalUsers}
                        </strong>
                    </div>

                </div>


                <div className="admin-users-stat-card">

                    <div className="admin-users-stat-icon">
                        <UserRound
                            size={21}
                            strokeWidth={2}
                        />
                    </div>

                    <div>
                        <span>
                            Regular Users
                        </span>

                        <strong>
                            {regularUsers}
                        </strong>
                    </div>

                </div>


                <div className="admin-users-stat-card">

                    <div className="admin-users-stat-icon">
                        <ShieldCheck
                            size={21}
                            strokeWidth={2}
                        />
                    </div>

                    <div>
                        <span>
                            Admins
                        </span>

                        <strong>
                            {adminUsers}
                        </strong>
                    </div>

                </div>

            </section>


            {/* ==================================
                FILTERS
            ================================== */}

            <section className="admin-users-toolbar">

                <div className="admin-users-search">

                    <Search
                        size={18}
                        strokeWidth={2}
                    />

                    <input
                        type="text"
                        placeholder="Search by name, email, phone or ID..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />

                </div>


                <div className="admin-users-filter-group">

                    <select
                        value={roleFilter}
                        onChange={(event) =>
                            setRoleFilter(
                                event.target.value
                            )
                        }
                    >
                        <option value="all">
                            All Roles
                        </option>

                        <option value="user">
                            Users
                        </option>

                        <option value="admin">
                            Admins
                        </option>
                    </select>


                    <select
                        value={sortOption}
                        onChange={(event) =>
                            setSortOption(
                                event.target.value
                            )
                        }
                    >
                        <option value="newest">
                            Newest First
                        </option>

                        <option value="oldest">
                            Oldest First
                        </option>

                        <option value="nameAsc">
                            Name A-Z
                        </option>

                        <option value="nameDesc">
                            Name Z-A
                        </option>
                    </select>


                    <button
                        type="button"
                        className="admin-users-reset"
                        onClick={handleReset}
                    >
                        <RotateCcw
                            size={16}
                        />

                        Reset
                    </button>

                </div>

            </section>


            {/* ==================================
                RESULTS INFO
            ================================== */}

            <div className="admin-users-results-info">

                <span>
                    Showing{' '}
                    <strong>
                        {filteredUsers.length}
                    </strong>{' '}
                    of{' '}
                    <strong>
                        {totalUsers}
                    </strong>{' '}
                    users
                </span>

                <div className="admin-users-sort-info">
                    <ArrowUpDown
                        size={15}
                    />

                    <span>
                        Sorted by{' '}
                        {sortOption === 'newest'
                            ? 'Newest'
                            : sortOption === 'oldest'
                                ? 'Oldest'
                                : sortOption === 'nameAsc'
                                    ? 'Name A-Z'
                                    : 'Name Z-A'}
                    </span>
                </div>

            </div>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (
                <div className="admin-users-error">
                    {error}
                </div>
            )}


            {/* ==================================
                TABLE
            ================================== */}

            <section className="admin-users-table-card">

                {loading ? (

                    <div className="admin-users-loading">
                        Loading users...
                    </div>

                ) : filteredUsers.length === 0 ? (

                    <div className="admin-users-empty">

                        <Users
                            size={38}
                            strokeWidth={1.6}
                        />

                        <h3>
                            No users found
                        </h3>

                        <p>
                            Try changing your
                            search or filters.
                        </p>

                    </div>

                ) : (

                    <div className="admin-users-table-wrapper">

                        <table className="admin-users-table">

                            <thead>
                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        User
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                    <th>
                                        Joined
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>
                            </thead>


                            <tbody>

                                {filteredUsers.map(
                                    (user) => (

                                        <tr
                                            key={user.id}
                                        >

                                            <td>
                                                <span className="admin-users-id">
                                                    #{user.id}
                                                </span>
                                            </td>


                                            <td>

                                                <div className="admin-user-name-cell">

                                                    <div className="admin-user-avatar">
                                                        <CircleUserRound
                                                            size={19}
                                                        />
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {user.name ||
                                                                'Unnamed User'}
                                                        </strong>

                                                        <span>
                                                            {user.role ===
                                                                'admin'
                                                                ? 'Administrator'
                                                                : 'Customer'}
                                                        </span>
                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <span className="admin-user-email">
                                                    {user.email ||
                                                        '—'}
                                                </span>

                                            </td>


                                            <td>
                                                {user.phone ||
                                                    '—'}
                                            </td>


                                            <td>

                                                <span
                                                    className={`admin-user-role ${
                                                        user.role ===
                                                        'admin'
                                                            ? 'admin'
                                                            : 'user'
                                                    }`}
                                                >

                                                    {user.role ===
                                                    'admin' ? (
                                                        <ShieldCheck
                                                            size={14}
                                                        />
                                                    ) : (
                                                        <UserRound
                                                            size={14}
                                                        />
                                                    )}

                                                    {formatRole(
                                                        user.role
                                                    )}

                                                </span>

                                            </td>


                                            <td>
                                                {formatDate(
                                                    user.created_at
                                                )}
                                            </td>


                                            <td>

                                                <button
                                                    type="button"
                                                    className="admin-user-view-button"
                                                    onClick={() =>
                                                        setSelectedUser(
                                                            user
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* ==================================
                USER DETAILS MODAL
            ================================== */}

            {selectedUser && (

                <div
                    className="admin-user-modal-overlay"
                    onClick={() =>
                        setSelectedUser(null)
                    }
                >

                    <div
                        className="admin-user-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="admin-user-modal-header">

                            <div>

                                <p>
                                    USER DETAILS
                                </p>

                                <h2>
                                    {selectedUser.name ||
                                        'Unnamed User'}
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="admin-user-modal-close"
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                                aria-label="Close"
                            >
                                <X
                                    size={20}
                                />
                            </button>

                        </div>


                        <div className="admin-user-modal-profile">

                            <div className="admin-user-modal-avatar">
                                <CircleUserRound
                                    size={34}
                                />
                            </div>

                            <div>

                                <strong>
                                    {selectedUser.name ||
                                        'Unnamed User'}
                                </strong>

                                <span
                                    className={`admin-user-role ${
                                        selectedUser.role ===
                                        'admin'
                                            ? 'admin'
                                            : 'user'
                                    }`}
                                >
                                    {selectedUser.role ===
                                    'admin'
                                        ? 'Admin'
                                        : 'User'}
                                </span>

                            </div>

                        </div>


                        <div className="admin-user-details-grid">

                            <div className="admin-user-detail-item">

                                <div className="admin-user-detail-icon">
                                    <Hash
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        User ID
                                    </span>

                                    <strong>
                                        #{selectedUser.id}
                                    </strong>
                                </div>

                            </div>


                            <div className="admin-user-detail-item">

                                <div className="admin-user-detail-icon">
                                    <Mail
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {selectedUser.email ||
                                            '—'}
                                    </strong>
                                </div>

                            </div>


                            <div className="admin-user-detail-item">

                                <div className="admin-user-detail-icon">
                                    <Phone
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Phone
                                    </span>

                                    <strong>
                                        {selectedUser.phone ||
                                            'Not provided'}
                                    </strong>
                                </div>

                            </div>


                            <div className="admin-user-detail-item">

                                <div className="admin-user-detail-icon">
                                    <CalendarDays
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Joined
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedUser.created_at
                                        )}
                                    </strong>
                                </div>

                            </div>

                        </div>


                        <div className="admin-user-modal-footer">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </main>
    );
}

export default AdminUsers;