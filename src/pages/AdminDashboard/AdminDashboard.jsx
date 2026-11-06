import { useEffect, useState } from 'react';

import {
    Coffee,
    Users,
    ShoppingBag,
    CircleDollarSign,
    UserRound,
    Activity,
    ArrowUpRight
} from 'lucide-react';

import './AdminDashboard.css';

function AdminDashboard() {

    const [stats, setStats] = useState({
        total_users: 0,
        total_coffees: 0,
        total_orders: 0,
        total_revenue: 0
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');


    // =========================
    // GET DASHBOARD STATS
    // =========================

    useEffect(() => {

        const fetchDashboardStats = async () => {

            try {

                // Get ADMIN token
                const token =
                    localStorage.getItem('adminToken');

                if (!token) {

                    setError(
                        'Please login as admin first.'
                    );

                    setLoading(false);

                    return;
                }

                const response = await fetch(
                    'http://localhost:5000/api/admin/stats',
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
                        'Failed to load dashboard'
                    );
                }

                setStats(
                    data.stats
                );

            } catch (error) {

                console.error(
                    'Dashboard error:',
                    error
                );

                setError(
                    error.message
                );

            } finally {

                setLoading(false);
            }
        };

        fetchDashboardStats();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <main className="admin-dashboard-page">

                <div className="admin-dashboard-loading">
                    Loading dashboard...
                </div>

            </main>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <main className="admin-dashboard-page">

                <div className="admin-dashboard-error">
                    {error}
                </div>

            </main>
        );
    }


    // =========================
    // DASHBOARD
    // =========================

    return (

        <main className="admin-dashboard-page">

            <section className="admin-main-content">

                {/* =========================
                    TOP HEADER
                ========================= */}

                <header className="admin-top-header">

                    <div>

                        <p className="admin-dashboard-label">
                            BREWMATCH ADMIN
                        </p>

                        <h1>
                            Welcome back, Admin
                        </h1>

                        <p className="admin-header-description">
                            Here's what's happening
                            with your coffee website today.
                        </p>

                    </div>


                    {/* ADMIN PROFILE */}

                    <div className="admin-header-profile">

                        <div className="admin-profile-avatar">

                            <UserRound
                                size={20}
                                strokeWidth={2}
                            />

                        </div>

                        <div>

                            <strong>
                                Administrator
                            </strong>

                            <span>
                                Admin
                            </span>

                        </div>

                    </div>

                </header>


                {/* =========================
                    STATS
                ========================= */}

                <section className="admin-stats-grid">

                    {/* USERS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-card-top">

                            <div className="admin-stat-icon">

                                <Users
                                    size={21}
                                    strokeWidth={2}
                                />

                            </div>

                            <span className="admin-stat-badge">
                                Users
                            </span>

                        </div>

                        <p>
                            Total Users
                        </p>

                        <h2>
                            {stats.total_users}
                        </h2>

                    </div>


                    {/* COFFEES */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-card-top">

                            <div className="admin-stat-icon">

                                <Coffee
                                    size={21}
                                    strokeWidth={2}
                                />

                            </div>

                            <span className="admin-stat-badge">
                                Menu
                            </span>

                        </div>

                        <p>
                            Total Coffees
                        </p>

                        <h2>
                            {stats.total_coffees}
                        </h2>

                    </div>


                    {/* ORDERS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-card-top">

                            <div className="admin-stat-icon">

                                <ShoppingBag
                                    size={21}
                                    strokeWidth={2}
                                />

                            </div>

                            <span className="admin-stat-badge">
                                Orders
                            </span>

                        </div>

                        <p>
                            Total Orders
                        </p>

                        <h2>
                            {stats.total_orders}
                        </h2>

                    </div>


                    {/* REVENUE */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-card-top">

                            <div className="admin-stat-icon">

                                <CircleDollarSign
                                    size={21}
                                    strokeWidth={2}
                                />

                            </div>

                            <span className="admin-stat-badge">
                                Revenue
                            </span>

                        </div>

                        <p>
                            Total Revenue
                        </p>

                        <h2>
                            Rs.{' '}
                            {Number(
                                stats.total_revenue
                            ).toLocaleString()}
                        </h2>

                    </div>

                </section>


                {/* =========================
                    OVERVIEW
                ========================= */}

                <section className="admin-overview-section">

                    <div className="admin-overview-header">

                        <div>

                            <p className="admin-section-label">
                                OVERVIEW
                            </p>

                            <h2>
                                BrewMatch Overview
                            </h2>

                        </div>

                        <span className="admin-overview-status">

                            <Activity
                                size={15}
                                strokeWidth={2}
                            />

                            System Active

                        </span>

                    </div>


                    <div className="admin-overview-content">

                        <div className="admin-overview-message">

                            <div className="admin-overview-icon">

                                <Coffee
                                    size={25}
                                    strokeWidth={2}
                                />

                            </div>

                            <div>

                                <h3>
                                    Your coffee shop is
                                    ready to manage.
                                </h3>

                                <p>
                                    Use the sidebar to
                                    manage coffees,
                                    orders and users.
                                    More analytics and
                                    AI features will be
                                    available here soon.
                                </p>

                            </div>

                        </div>


                        <div className="admin-overview-arrow">

                            <ArrowUpRight
                                size={20}
                                strokeWidth={2}
                            />

                        </div>

                    </div>

                </section>

            </section>

        </main>
    );
}

export default AdminDashboard;