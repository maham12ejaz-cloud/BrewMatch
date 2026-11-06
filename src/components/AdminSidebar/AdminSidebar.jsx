import {
    LayoutDashboard,
    Coffee,
    ShoppingBag,
    Users,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';

import {
    useLocation,
    useNavigate
} from 'react-router-dom';

import logo from '../../assets/logo.png';

function AdminSidebar() {

    const location = useLocation();
    const navigate = useNavigate();


    // =========================
    // ADMIN LOGOUT
    // =========================

    const handleLogout = () => {

        // Remove ONLY admin session
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');

        // Go to admin login
        window.location.href = '/admin/login';
    };


    // =========================
    // CHECK ACTIVE PAGE
    // =========================

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };


    // =========================
    // DASHBOARD ACTIVE
    // =========================

    const isDashboardActive =
        location.pathname === '/admin' ||
        location.pathname === '/admin/dashboard';


    return (

        <aside className="admin-sidebar">


            {/* =========================
                LOGO
            ========================= */}

            <div className="admin-logo">

                <img
                    src={logo}
                    alt="BrewMatch"
                    className="admin-logo-image"
                />

            </div>


            {/* =========================
                MAIN NAVIGATION
            ========================= */}

            <nav className="admin-sidebar-nav">


                {/* =========================
                    DASHBOARD
                ========================= */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isDashboardActive
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        navigate('/admin/dashboard')
                    }
                >

                    <LayoutDashboard
                        size={19}
                        strokeWidth={2}
                    />

                    <span>
                        Dashboard
                    </span>

                </button>


                {/* =========================
                    COFFEES
                ========================= */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/coffees')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        navigate('/admin/coffees')
                    }
                >

                    <Coffee
                        size={19}
                        strokeWidth={2}
                    />

                    <span>
                        Coffees
                    </span>

                </button>


                {/* =========================
                    ORDERS
                ========================= */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/orders')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        navigate('/admin/orders')
                    }
                >

                    <ShoppingBag
                        size={19}
                        strokeWidth={2}
                    />

                    <span>
                        Orders
                    </span>

                </button>


                {/* =========================
                    USERS
                ========================= */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/users')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        navigate('/admin/users')
                    }
                >

                    <Users
                        size={19}
                        strokeWidth={2}
                    />

                    <span>
                        Users
                    </span>

                </button>


                {/* =========================
                    ANALYTICS
                ========================= */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/analytics')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        navigate('/admin/analytics')
                    }
                >

                    <BarChart3
                        size={19}
                        strokeWidth={2}
                    />

                    <span>
                        Analytics
                    </span>

                </button>

            </nav>


            {/* =========================
                BOTTOM NAVIGATION
            ========================= */}

            <div className="admin-sidebar-bottom">


                {/* =========================
                    SETTINGS
                ========================= */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/settings')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        navigate('/admin/settings')
                    }
                >

                    <Settings
                        size={19}
                        strokeWidth={2}
                    />

                    <span>
                        Settings
                    </span>

                </button>


                {/* =========================
                    LOGOUT
                ========================= */}

                <button
                    type="button"
                    className="admin-logout-button"
                    onClick={handleLogout}
                >

                    <LogOut
                        size={19}
                        strokeWidth={2}
                    />

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>
    );
}

export default AdminSidebar;