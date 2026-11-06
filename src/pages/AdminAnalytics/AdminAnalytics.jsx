import { useEffect, useMemo, useState } from 'react';

import {
    BarChart3,
    TrendingUp,
    ShoppingBag,
    Users,
    Wallet,
    Coffee,
    PackageCheck,
    RefreshCw,
    ArrowUpRight,
    DollarSign
} from 'lucide-react';

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';

import './AdminAnalytics.css';


const TOOLTIP_COLORS = [
    '#6f4e37',
    '#9b7355',
    '#b9977b',
    '#c9ad95'
];


function CustomRevenueTooltip({
    active,
    payload,
    label
}) {
    if (
        !active ||
        !payload ||
        payload.length === 0
    ) {
        return null;
    }

    const revenue =
        payload.find(
            item => item.dataKey === 'revenue'
        )?.value || 0;

    const orders =
        payload.find(
            item => item.dataKey === 'orders'
        )?.value || 0;

    return (
        <div className="analytics-custom-tooltip">

            <div className="tooltip-date">
                {label}
            </div>

            <div className="tooltip-divider" />

            <div className="tooltip-row">

                <div className="tooltip-label">
                    <span className="tooltip-dot revenue-dot" />

                    <span>
                        Revenue
                    </span>
                </div>

                <strong>
                    Rs. {Number(
                        revenue
                    ).toLocaleString()}
                </strong>

            </div>

            <div className="tooltip-row">

                <div className="tooltip-label">
                    <span className="tooltip-dot orders-dot" />

                    <span>
                        Orders
                    </span>
                </div>

                <strong>
                    {orders}
                </strong>

            </div>

        </div>
    );
}


function CustomUserTooltip({
    active,
    payload,
    label
}) {
    if (
        !active ||
        !payload ||
        payload.length === 0
    ) {
        return null;
    }

    const users =
        payload[0]?.value || 0;

    return (
        <div className="analytics-custom-tooltip user-tooltip">

            <div className="tooltip-date">
                {label}
            </div>

            <div className="tooltip-divider" />

            <div className="tooltip-row">

                <div className="tooltip-label">
                    <span className="tooltip-dot users-dot" />

                    <span>
                        New Users
                    </span>
                </div>

                <strong>
                    {users}
                </strong>

            </div>

        </div>
    );
}


function CustomStatusTooltip({
    active,
    payload
}) {
    if (
        !active ||
        !payload ||
        payload.length === 0
    ) {
        return null;
    }

    const item = payload[0];

    return (
        <div className="analytics-custom-tooltip status-tooltip">

            <div className="tooltip-status-title">
                {item.name}
            </div>

            <div className="tooltip-divider" />

            <div className="tooltip-row">

                <div className="tooltip-label">
                    <span className="tooltip-dot status-tooltip-dot" />

                    <span>
                        Orders
                    </span>
                </div>

                <strong>
                    {item.value}
                </strong>

            </div>

        </div>
    );
}


function AdminAnalytics() {

    const [analytics, setAnalytics] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [revenueView, setRevenueView] =
        useState('daily');


    const loadAnalytics = async () => {

        try {

            const token =
                localStorage.getItem('adminToken');

            if (!token) {
                throw new Error(
                    'Please login as admin first.'
                );
            }

            const response = await fetch(
                'http://localhost:5000/api/admin/analytics',
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

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    'Failed to load analytics'
                );
            }

            setAnalytics(data);
            setError('');

        } catch (error) {

            console.error(
                'Analytics fetch error:',
                error
            );

            setError(
                error.message ||
                'Unable to load analytics'
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        const timer = setTimeout(() => {
            loadAnalytics();
        }, 0);

        return () => {
            clearTimeout(timer);
        };

    }, []);


    const handleRefresh = () => {

        setLoading(true);
        loadAnalytics();

    };


    const revenueData = useMemo(() => {

        if (!analytics) {
            return [];
        }

        if (revenueView === 'daily') {

            return analytics.daily_revenue.map(
                item => ({
                    label:
                        new Date(
                            item.date
                        ).toLocaleDateString(
                            'en-US',
                            {
                                month: 'short',
                                day: 'numeric'
                            }
                        ),

                    revenue:
                        Number(
                            item.revenue
                        ),

                    orders:
                        Number(
                            item.orders
                        )
                })
            );

        }


        if (revenueView === 'weekly') {

            return analytics.weekly_revenue.map(
                item => ({
                    label:
                        `Week ${item.week}`,

                    revenue:
                        Number(
                            item.revenue
                        ),

                    orders:
                        Number(
                            item.orders
                        )
                })
            );

        }


        return analytics.monthly_revenue.map(
            item => ({
                label:
                    new Date(
                        `${item.month}-01T00:00:00`
                    ).toLocaleDateString(
                        'en-US',
                        {
                            month: 'short',
                            year: 'numeric'
                        }
                    ),

                revenue:
                    Number(
                        item.revenue
                    ),

                orders:
                    Number(
                        item.orders
                    )
            })
        );

    }, [analytics, revenueView]);


    const statusData = useMemo(() => {

        if (!analytics) {
            return [];
        }

        return analytics.order_status.map(
            item => ({
                name: item.status,
                value: Number(item.count)
            })
        );

    }, [analytics]);


    const popularCoffeeData = useMemo(() => {

        if (!analytics) {
            return [];
        }

        return analytics.popular_coffees.map(
            item => ({
                name: item.coffee_name,

                quantity:
                    Number(
                        item.quantity_sold
                    ),

                revenue:
                    Number(
                        item.revenue
                    )
            })
        );

    }, [analytics]);


    const userGrowthData = useMemo(() => {

        if (!analytics) {
            return [];
        }

        return analytics.user_growth.map(
            item => ({
                month:
                    new Date(
                        `${item.month}-01T00:00:00`
                    ).toLocaleDateString(
                        'en-US',
                        {
                            month: 'short'
                        }
                    ),

                users:
                    Number(
                        item.users
                    )
            })
        );

    }, [analytics]);


    const formatCurrency = value => {

        return `Rs. ${Number(
            value || 0
        ).toLocaleString()}`;

    };


    const getRevenueTitle = () => {

        if (revenueView === 'daily') {
            return 'Daily Revenue';
        }

        if (revenueView === 'weekly') {
            return 'Weekly Revenue';
        }

        return 'Monthly Revenue';

    };


    const totalStatusOrders =
        statusData.reduce(
            (
                total,
                item
            ) =>
                total + item.value,
            0
        );


    const totalCoffeeRevenue =
        popularCoffeeData.reduce(
            (
                total,
                item
            ) =>
                total + item.revenue,
            0
        );


    if (loading) {

        return (
            <div className="admin-analytics-page">

                <div className="analytics-loading">

                    <div className="analytics-loader">
                        <RefreshCw size={27} />
                    </div>

                    <h2>
                        Loading Analytics
                    </h2>

                    <p>
                        Preparing your BrewMatch insights...
                    </p>

                </div>

            </div>
        );

    }


    if (error) {

        return (
            <div className="admin-analytics-page">

                <div className="analytics-error">

                    <div className="analytics-error-icon">
                        <BarChart3 size={34} />
                    </div>

                    <h2>
                        Unable to Load Analytics
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={handleRefresh}
                    >
                        <RefreshCw size={17} />
                        Try Again
                    </button>

                </div>

            </div>
        );

    }


    return (
        <div className="admin-analytics-page">

            {/* HEADER */}

            <div className="admin-analytics-header">

                <div className="analytics-heading">

                    <div className="analytics-heading-icon">
                        <BarChart3 size={22} />
                    </div>

                    <div>

                        <span className="analytics-eyebrow">
                            BREWMATCH BUSINESS INSIGHTS
                        </span>

                        <h1>
                            Analytics Overview
                        </h1>

                        <p>
                            Understand your sales,
                            customers and coffee
                            performance.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="analytics-refresh-button"
                    onClick={handleRefresh}
                >
                    <RefreshCw size={17} />
                    Refresh Data
                </button>

            </div>


            {/* SUMMARY CARDS */}

            <div className="analytics-summary-grid">

                <div className="analytics-summary-card">

                    <div className="summary-card-top">

                        <div className="summary-icon revenue">
                            <Wallet size={20} />
                        </div>

                        <span className="summary-badge">
                            Revenue
                        </span>

                    </div>

                    <div className="summary-content">

                        <span>
                            Total Revenue
                        </span>

                        <strong>
                            {formatCurrency(
                                analytics.summary.total_revenue
                            )}
                        </strong>

                        <small>
                            Excluding cancelled orders
                        </small>

                    </div>

                </div>


                <div className="analytics-summary-card">

                    <div className="summary-card-top">

                        <div className="summary-icon orders">
                            <ShoppingBag size={20} />
                        </div>

                        <span className="summary-badge">
                            Orders
                        </span>

                    </div>

                    <div className="summary-content">

                        <span>
                            Total Orders
                        </span>

                        <strong>
                            {analytics.summary.total_orders}
                        </strong>

                        <small>
                            Orders placed so far
                        </small>

                    </div>

                </div>


                <div className="analytics-summary-card">

                    <div className="summary-card-top">

                        <div className="summary-icon users">
                            <Users size={20} />
                        </div>

                        <span className="summary-badge">
                            Customers
                        </span>

                    </div>

                    <div className="summary-content">

                        <span>
                            Total Users
                        </span>

                        <strong>
                            {analytics.summary.total_users}
                        </strong>

                        <small>
                            Registered users
                        </small>

                    </div>

                </div>


                <div className="analytics-summary-card">

                    <div className="summary-card-top">

                        <div className="summary-icon average">
                            <TrendingUp size={20} />
                        </div>

                        <span className="summary-badge">
                            Average
                        </span>

                    </div>

                    <div className="summary-content">

                        <span>
                            Average Order Value
                        </span>

                        <strong>
                            {formatCurrency(
                                analytics.summary.average_order_value
                            )}
                        </strong>

                        <small>
                            Average revenue per order
                        </small>

                    </div>

                </div>

            </div>


            {/* REVENUE */}

            <section className="analytics-panel revenue-panel">

                <div className="analytics-panel-header">

                    <div>

                        <div className="panel-heading-row">

                            <div className="panel-heading-icon">
                                <DollarSign size={18} />
                            </div>

                            <span className="panel-label">
                                REVENUE PERFORMANCE
                            </span>

                        </div>

                        <h2>
                            {getRevenueTitle()}
                        </h2>

                        <p>
                            Monitor how your coffee sales
                            are performing over time.
                        </p>

                    </div>


                    <div className="analytics-tabs">

                        <button
                            type="button"
                            className={
                                revenueView === 'daily'
                                    ? 'active'
                                    : ''
                            }
                            onClick={() =>
                                setRevenueView('daily')
                            }
                        >
                            Daily
                        </button>

                        <button
                            type="button"
                            className={
                                revenueView === 'weekly'
                                    ? 'active'
                                    : ''
                            }
                            onClick={() =>
                                setRevenueView('weekly')
                            }
                        >
                            Weekly
                        </button>

                        <button
                            type="button"
                            className={
                                revenueView === 'monthly'
                                    ? 'active'
                                    : ''
                            }
                            onClick={() =>
                                setRevenueView('monthly')
                            }
                        >
                            Monthly
                        </button>

                    </div>

                </div>


                <div className="revenue-mini-stats">

                    <div>

                        <span>
                            Revenue
                        </span>

                        <strong>
                            {formatCurrency(
                                revenueData.reduce(
                                    (
                                        total,
                                        item
                                    ) =>
                                        total +
                                        item.revenue,
                                    0
                                )
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Orders
                        </span>

                        <strong>
                            {revenueData.reduce(
                                (
                                    total,
                                    item
                                ) =>
                                    total +
                                    item.orders,
                                0
                            )}
                        </strong>

                    </div>

                </div>


                <div className="analytics-chart revenue-chart">

                    {revenueData.length > 0 ? (

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <AreaChart
                                data={revenueData}
                                margin={{
                                    top: 20,
                                    right: 15,
                                    left: 0,
                                    bottom: 5
                                }}
                            >

                                <defs>

                                    <linearGradient
                                        id="premiumRevenueGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >

                                        <stop
                                            offset="0%"
                                            stopColor="#6f4e37"
                                            stopOpacity={0.25}
                                        />

                                        <stop
                                            offset="100%"
                                            stopColor="#6f4e37"
                                            stopOpacity={0}
                                        />

                                    </linearGradient>

                                </defs>


                                <CartesianGrid
                                    stroke="#eee5dd"
                                    strokeDasharray="4 5"
                                    vertical={false}
                                />


                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    tick={{
                                        fill: '#9a8678',
                                        fontSize: 10
                                    }}
                                />


                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    width={75}
                                    tick={{
                                        fill: '#9a8678',
                                        fontSize: 10
                                    }}
                                    tickFormatter={
                                        value =>
                                            `Rs. ${value}`
                                    }
                                />


                                <Tooltip
                                    cursor={{
                                        stroke: '#b9977b',
                                        strokeWidth: 1,
                                        strokeDasharray: '4 4'
                                    }}
                                    content={
                                        <CustomRevenueTooltip />
                                    }
                                />


                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#6f4e37"
                                    strokeWidth={3}
                                    fill="url(#premiumRevenueGradient)"
                                    dot={{
                                        r: 4,
                                        fill: '#ffffff',
                                        stroke: '#6f4e37',
                                        strokeWidth: 2
                                    }}
                                    activeDot={{
                                        r: 7,
                                        fill: '#6f4e37',
                                        stroke: '#ffffff',
                                        strokeWidth: 3
                                    }}
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    ) : (

                        <div className="empty-chart">

                            <BarChart3 size={35} />

                            <p>
                                No revenue data available
                                for this period.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* TWO COLUMNS */}

            <div className="analytics-two-column">

                {/* ORDER STATUS */}

                <section className="analytics-panel">

                    <div className="analytics-panel-header">

                        <div>

                            <div className="panel-heading-row">

                                <div className="panel-heading-icon">
                                    <PackageCheck size={18} />
                                </div>

                                <span className="panel-label">
                                    ORDER BREAKDOWN
                                </span>

                            </div>

                            <h2>
                                Order Status
                            </h2>

                        </div>

                    </div>


                    <div className="status-chart-wrapper">

                        {statusData.length > 0 ? (

                            <>

                                <div className="status-donut">

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <PieChart>

                                            <Pie
                                                data={statusData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={105}
                                                paddingAngle={4}
                                                stroke="none"
                                            >

                                                {statusData.map(
                                                    (
                                                        entry,
                                                        index
                                                    ) => (

                                                        <Cell
                                                            key={
                                                                `status-${index}`
                                                            }
                                                            fill={
                                                                TOOLTIP_COLORS[
                                                                    index %
                                                                    TOOLTIP_COLORS.length
                                                                ]
                                                            }
                                                        />

                                                    )
                                                )}

                                            </Pie>


                                            <Tooltip
                                                content={
                                                    <CustomStatusTooltip />
                                                }
                                            />

                                        </PieChart>

                                    </ResponsiveContainer>


                                    <div className="donut-center">

                                        <strong>
                                            {totalStatusOrders}
                                        </strong>

                                        <span>
                                            Orders
                                        </span>

                                    </div>

                                </div>


                                <div className="status-list">

                                    {statusData.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                className="status-list-item"
                                                key={item.name}
                                            >

                                                <div className="status-name">

                                                    <span
                                                        className={
                                                            `status-dot status-dot-${index}`
                                                        }
                                                    />

                                                    <span>
                                                        {item.name}
                                                    </span>

                                                </div>

                                                <strong>
                                                    {item.value}
                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>

                            </>

                        ) : (

                            <div className="empty-chart">

                                <PackageCheck size={35} />

                                <p>
                                    No order status
                                    data available.
                                </p>

                            </div>

                        )}

                    </div>

                </section>


                {/* POPULAR COFFEES */}

                <section className="analytics-panel">

                    <div className="analytics-panel-header">

                        <div>

                            <div className="panel-heading-row">

                                <div className="panel-heading-icon">
                                    <Coffee size={18} />
                                </div>

                                <span className="panel-label">
                                    BEST SELLERS
                                </span>

                            </div>

                            <h2>
                                Popular Coffees
                            </h2>

                        </div>

                    </div>


                    <div className="popular-coffee-list">

                        {popularCoffeeData.length > 0 ? (

                            popularCoffeeData.map(
                                (
                                    coffee,
                                    index
                                ) => {

                                    const percentage =
                                        totalCoffeeRevenue > 0
                                            ? (
                                                coffee.revenue /
                                                totalCoffeeRevenue
                                            ) * 100
                                            : 0;

                                    return (

                                        <div
                                            className="popular-coffee-item"
                                            key={coffee.name}
                                        >

                                            <div className="coffee-rank-large">
                                                {index + 1}
                                            </div>


                                            <div className="coffee-performance">

                                                <div className="coffee-performance-top">

                                                    <strong>
                                                        {coffee.name}
                                                    </strong>

                                                    <span>
                                                        {coffee.quantity}
                                                        {' '}
                                                        sold
                                                    </span>

                                                </div>


                                                <div className="coffee-progress">

                                                    <div
                                                        className="coffee-progress-fill"
                                                        style={{
                                                            width:
                                                                `${Math.min(
                                                                    percentage,
                                                                    100
                                                                )}%`
                                                        }}
                                                    />

                                                </div>


                                                <div className="coffee-performance-bottom">

                                                    <span>
                                                        {percentage.toFixed(
                                                            0
                                                        )}
                                                        %
                                                        of revenue
                                                    </span>

                                                    <strong>
                                                        {formatCurrency(
                                                            coffee.revenue
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>

                                    );

                                }
                            )

                        ) : (

                            <div className="empty-chart">

                                <Coffee size={35} />

                                <p>
                                    No coffee sales
                                    data available.
                                </p>

                            </div>

                        )}

                    </div>

                </section>

            </div>


            {/* USER GROWTH */}

            <section className="analytics-panel">

                <div className="analytics-panel-header">

                    <div>

                        <div className="panel-heading-row">

                            <div className="panel-heading-icon">
                                <Users size={18} />
                            </div>

                            <span className="panel-label">
                                CUSTOMER INSIGHTS
                            </span>

                        </div>

                        <h2>
                            User Growth
                        </h2>

                        <p>
                            Track the growth of registered
                            BrewMatch users.
                        </p>

                    </div>

                </div>


                <div className="analytics-chart user-growth-chart">

                    {userGrowthData.length > 0 ? (

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart
                                data={userGrowthData}
                                margin={{
                                    top: 20,
                                    right: 15,
                                    left: 0,
                                    bottom: 5
                                }}
                            >

                                <CartesianGrid
                                    stroke="#eee5dd"
                                    strokeDasharray="4 5"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    tick={{
                                        fill: '#9a8678',
                                        fontSize: 10
                                    }}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{
                                        fill: '#9a8678',
                                        fontSize: 10
                                    }}
                                />

                                <Tooltip
                                    cursor={{
                                        fill: 'rgba(111, 78, 55, 0.05)'
                                    }}
                                    content={
                                        <CustomUserTooltip />
                                    }
                                />

                                <Bar
                                    dataKey="users"
                                    fill="#7b5840"
                                    radius={[
                                        8,
                                        8,
                                        2,
                                        2
                                    ]}
                                    barSize={38}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    ) : (

                        <div className="empty-chart">

                            <Users size={35} />

                            <p>
                                No user growth data
                                available.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* TOP PERFORMANCE TABLE */}

            <section className="analytics-panel">

                <div className="analytics-panel-header">

                    <div>

                        <div className="panel-heading-row">

                            <div className="panel-heading-icon">
                                <ArrowUpRight size={18} />
                            </div>

                            <span className="panel-label">
                                SALES PERFORMANCE
                            </span>

                        </div>

                        <h2>
                            Top Coffee Performance
                        </h2>

                    </div>

                </div>


                <div className="analytics-table-wrapper">

                    <table className="analytics-table">

                        <thead>

                            <tr>

                                <th>
                                    Rank
                                </th>

                                <th>
                                    Coffee
                                </th>

                                <th>
                                    Quantity Sold
                                </th>

                                <th>
                                    Revenue
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {popularCoffeeData.map(
                                (
                                    coffee,
                                    index
                                ) => (

                                    <tr
                                        key={coffee.name}
                                    >

                                        <td>

                                            <span
                                                className={
                                                    `table-rank rank-${index + 1}`
                                                }
                                            >
                                                {index + 1}
                                            </span>

                                        </td>


                                        <td>

                                            <div className="table-coffee">

                                                <div className="table-coffee-icon">
                                                    <Coffee size={16} />
                                                </div>

                                                <strong>
                                                    {coffee.name}
                                                </strong>

                                            </div>

                                        </td>


                                        <td>
                                            {coffee.quantity}
                                        </td>


                                        <td>

                                            <strong className="table-revenue">
                                                {formatCurrency(
                                                    coffee.revenue
                                                )}
                                            </strong>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>
    );
}

export default AdminAnalytics;