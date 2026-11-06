import { useEffect, useMemo, useState } from 'react';

import {
    Search,
    RefreshCw,
    Eye,
    X,
    Package,
    UserRound,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    ChevronDown,
    CheckCircle
} from 'lucide-react';

import './AdminOrders.css';

const API_URL = 'http://localhost:5000/api/admin/orders';

const STATUS_OPTIONS = [
    'All',
    'Pending',
    'Confirmed',
    'Preparing',
    'Delivered',
    'Cancelled'
];

function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('newest');

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const [error, setError] = useState('');

    // ========================================
    // TOAST
    // ========================================

    const [toast, setToast] = useState({
        show: false,
        message: ''
    });

    // ========================================
    // SHOW TOAST
    // ========================================

    const showToast = (message) => {
        setToast({
            show: true,
            message
        });
    };

    // ========================================
    // CLOSE TOAST
    // ========================================

    const closeToast = () => {
        setToast({
            show: false,
            message: ''
        });
    };

    // ========================================
    // FETCH ORDERS
    // ========================================

    const fetchOrders = async (isRefresh = false) => {

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {

            const token =
                localStorage.getItem('adminToken');

            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            });

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    'Failed to fetch orders'
                );
            }

            setOrders(
                Array.isArray(data.orders)
                    ? data.orders
                    : []
            );

            setError('');

        } catch (err) {

            console.error(
                'Fetch admin orders error:',
                err
            );

            setError(
                err.message ||
                'Failed to fetch orders'
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };

    // ========================================
    // INITIAL LOAD
    // ========================================

    useEffect(() => {

        let cancelled = false;

        const loadOrders = async () => {

            try {

                const token =
                    localStorage.getItem(
                        'adminToken'
                    );

                const response =
                    await fetch(
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
                        'Failed to fetch orders'
                    );
                }

                if (cancelled) {
                    return;
                }

                setOrders(
                    Array.isArray(data.orders)
                        ? data.orders
                        : []
                );

                setError('');

            } catch (err) {

                if (cancelled) {
                    return;
                }

                console.error(
                    'Initial orders fetch error:',
                    err
                );

                setError(
                    err.message ||
                    'Failed to fetch orders'
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadOrders();

        return () => {
            cancelled = true;
        };

    }, []);

    // ========================================
    // UPDATE ORDER STATUS
    // ========================================

    const updateOrderStatus = async (
        orderId,
        status
    ) => {

        setUpdatingOrderId(orderId);
        setError('');

        try {

            const token =
                localStorage.getItem(
                    'adminToken'
                );

            const response =
                await fetch(
                    `http://localhost:5000/api/admin/orders/${orderId}/status`,
                    {
                        method: 'PUT',

                        headers: {
                            'Content-Type':
                                'application/json',

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            status
                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    'Failed to update order status'
                );
            }

            setOrders(
                (previousOrders) =>
                    previousOrders.map(
                        (order) =>
                            order.order_id ===
                            orderId
                                ? {
                                    ...order,
                                    status
                                }
                                : order
                    )
            );

            setSelectedOrder(
                (previousOrder) => {

                    if (
                        !previousOrder ||
                        previousOrder.order_id !==
                            orderId
                    ) {
                        return previousOrder;
                    }

                    return {
                        ...previousOrder,
                        status
                    };
                }
            );

            showToast(
                `Order #${orderId} status updated to ${status}.`
            );

        } catch (err) {

            console.error(
                'Update order status error:',
                err
            );

            setError(
                err.message ||
                'Failed to update order status'
            );

        } finally {

            setUpdatingOrderId(null);
        }
    };

    // ========================================
    // FILTER + SORT
    // ========================================

    const filteredOrders = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();

        const result =
            orders.filter((order) => {

                const matchesSearch =
                    !searchValue ||
                    String(order.order_id)
                        .toLowerCase()
                        .includes(searchValue) ||
                    (
                        order.customer_name ||
                        ''
                    )
                        .toLowerCase()
                        .includes(searchValue) ||
                    (
                        order.customer_email ||
                        ''
                    )
                        .toLowerCase()
                        .includes(searchValue) ||
                    (
                        order.customer_phone ||
                        ''
                    )
                        .toLowerCase()
                        .includes(searchValue);

                const matchesStatus =
                    statusFilter === 'All' ||
                    order.status === statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            });

        result.sort((a, b) => {

            const dateA =
                new Date(
                    a.created_at
                ).getTime();

            const dateB =
                new Date(
                    b.created_at
                ).getTime();

            if (sortOrder === 'oldest') {
                return dateA - dateB;
            }

            return dateB - dateA;
        });

        return result;

    }, [
        orders,
        search,
        statusFilter,
        sortOrder
    ]);

    // ========================================
    // FORMAT DATE
    // ========================================

    const formatDate = (date) => {

        if (!date) {
            return '—';
        }

        return new Date(
            date
        ).toLocaleDateString(
            'en-US',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }
        );
    };

    const formatTime = (date) => {

        if (!date) {
            return '';
        }

        return new Date(
            date
        ).toLocaleTimeString(
            'en-US',
            {
                hour: 'numeric',
                minute: '2-digit'
            }
        );
    };

    // ========================================
    // FORMAT MONEY
    // ========================================

    const formatAmount = (amount) => {

        return `Rs. ${Number(
            amount || 0
        ).toLocaleString(
            'en-PK',
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )}`;
    };

    // ========================================
    // STATUS CLASS
    // ========================================

    const getStatusClass = (status) => {

        return status
            .toLowerCase()
            .replace(/\s+/g, '-');
    };

    // ========================================
    // RESET FILTERS
    // ========================================

    const resetFilters = () => {

        setSearch('');
        setStatusFilter('All');
        setSortOrder('newest');
    };

    // ========================================
    // CLOSE DETAILS
    // ========================================

    const closeDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="admin-orders-page">

            {/* ========================================
                HEADER
            ======================================== */}

            <header className="admin-orders-header">

                <div>
                    <p className="admin-orders-label">
                        ORDER MANAGEMENT
                    </p>

                    <h1>
                        Orders
                    </h1>

                    <p className="admin-orders-description">
                        View and manage customer orders.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-orders-refresh-button"
                    onClick={() =>
                        fetchOrders(true)
                    }
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? 'admin-orders-spin'
                                : ''
                        }
                    />

                    {refreshing
                        ? 'Refreshing...'
                        : 'Refresh'}
                </button>

            </header>

            {/* ========================================
                ERROR
            ======================================== */}

            {error && (
                <div className="admin-orders-alert error">
                    {error}

                    <button
                        type="button"
                        onClick={() =>
                            setError('')
                        }
                    >
                        <X size={15} />
                    </button>
                </div>
            )}

            {/* ========================================
                RIGHT SIDE TOAST
            ======================================== */}

            {toast.show && (
                <div className="admin-order-toast">

                    <div className="admin-order-toast-icon">
                        <CheckCircle
                            size={19}
                            strokeWidth={2}
                        />
                    </div>

                    <div className="admin-order-toast-content">

                        <strong>
                            {toast.message}
                        </strong>

                    </div>

                    <button
                        type="button"
                        className="admin-order-toast-close"
                        onClick={closeToast}
                        aria-label="Close notification"
                    >
                        <X size={16} />
                    </button>

                </div>
            )}

            {/* ========================================
                SUMMARY
            ======================================== */}

            <div className="admin-orders-summary">

                <div className="admin-orders-summary-card">

                    <div className="admin-orders-summary-icon">
                        <Package size={20} />
                    </div>

                    <div>
                        <span>
                            Total Orders
                        </span>

                        <strong>
                            {orders.length}
                        </strong>
                    </div>

                </div>

                <div className="admin-orders-summary-card">

                    <div className="admin-orders-summary-icon">
                        <Package size={20} />
                    </div>

                    <div>
                        <span>
                            Pending
                        </span>

                        <strong>
                            {
                                orders.filter(
                                    (order) =>
                                        order.status ===
                                        'Pending'
                                ).length
                            }
                        </strong>
                    </div>

                </div>

                <div className="admin-orders-summary-card">

                    <div className="admin-orders-summary-icon">
                        <Package size={20} />
                    </div>

                    <div>
                        <span>
                            Preparing
                        </span>

                        <strong>
                            {
                                orders.filter(
                                    (order) =>
                                        order.status ===
                                        'Preparing'
                                ).length
                            }
                        </strong>
                    </div>

                </div>

                <div className="admin-orders-summary-card">

                    <div className="admin-orders-summary-icon">
                        <Package size={20} />
                    </div>

                    <div>
                        <span>
                            Delivered
                        </span>

                        <strong>
                            {
                                orders.filter(
                                    (order) =>
                                        order.status ===
                                        'Delivered'
                                ).length
                            }
                        </strong>
                    </div>

                </div>

            </div>

            {/* ========================================
                FILTERS
            ======================================== */}

            <section className="admin-orders-controls">

                <div className="admin-orders-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search by order ID, customer, email or phone..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>

                <div className="admin-orders-filter">

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >
                        {STATUS_OPTIONS.map(
                            (status) => (
                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status === 'All'
                                        ? 'All Statuses'
                                        : status}
                                </option>
                            )
                        )}
                    </select>

                    <ChevronDown
                        size={16}
                    />

                </div>

                <div className="admin-orders-filter">

                    <select
                        value={sortOrder}
                        onChange={(event) =>
                            setSortOrder(
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
                    </select>

                    <ChevronDown
                        size={16}
                    />

                </div>

                <button
                    type="button"
                    className="admin-orders-reset"
                    onClick={resetFilters}
                >
                    Reset
                </button>

            </section>

            {/* ========================================
                RESULTS COUNT
            ======================================== */}

            <div className="admin-orders-results-row">

                <span>
                    Showing{' '}
                    <strong>
                        {filteredOrders.length}
                    </strong>{' '}
                    of{' '}
                    <strong>
                        {orders.length}
                    </strong>{' '}
                    orders
                </span>

            </div>

            {/* ========================================
                TABLE
            ======================================== */}

            <section className="admin-orders-table-card">

                {loading ? (

                    <div className="admin-orders-state">

                        <div className="admin-orders-loader"></div>

                        <p>
                            Loading orders...
                        </p>

                    </div>

                ) : filteredOrders.length === 0 ? (

                    <div className="admin-orders-state">

                        <Package size={42} />

                        <h3>
                            No orders found
                        </h3>

                        <p>
                            Try changing your search
                            or filters.
                        </p>

                    </div>

                ) : (

                    <div className="admin-orders-table-wrapper">

                        <table className="admin-orders-table">

                            <thead>
                                <tr>

                                    <th>
                                        Order
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Items
                                    </th>

                                    <th>
                                        Total
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {filteredOrders.map(
                                    (order) => (

                                        <tr
                                            key={
                                                order.order_id
                                            }
                                        >

                                            <td>

                                                <span className="admin-order-id">
                                                    #
                                                    {
                                                        order.order_id
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <div className="admin-order-customer">

                                                    <div className="admin-order-avatar">
                                                        <UserRound
                                                            size={17}
                                                        />
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {
                                                                order.customer_name ||
                                                                'Guest Customer'
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                order.customer_email ||
                                                                'No email'
                                                            }
                                                        </span>
                                                    </div>

                                                </div>

                                            </td>

                                            <td>

                                                <span className="admin-order-items-count">
                                                    {
                                                        order.items?.length ||
                                                        0
                                                    }{' '}
                                                    item
                                                    {
                                                        (
                                                            order.items?.length ||
                                                            0
                                                        ) !== 1
                                                            ? 's'
                                                            : ''
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <strong className="admin-order-total">
                                                    {
                                                        formatAmount(
                                                            order.total_amount
                                                        )
                                                    }
                                                </strong>

                                            </td>

                                            <td>

                                                <select
                                                    className={`admin-order-status-select ${getStatusClass(
                                                        order.status
                                                    )}`}
                                                    value={
                                                        order.status
                                                    }
                                                    disabled={
                                                        updatingOrderId ===
                                                        order.order_id
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateOrderStatus(
                                                            order.order_id,
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                >

                                                    {STATUS_OPTIONS
                                                        .filter(
                                                            (
                                                                status
                                                            ) =>
                                                                status !==
                                                                'All'
                                                        )
                                                        .map(
                                                            (
                                                                status
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        status
                                                                    }
                                                                    value={
                                                                        status
                                                                    }
                                                                >
                                                                    {
                                                                        status
                                                                    }
                                                                </option>
                                                            )
                                                        )}

                                                </select>

                                            </td>

                                            <td>

                                                <div className="admin-order-date">

                                                    <span>
                                                        {
                                                            formatDate(
                                                                order.created_at
                                                            )
                                                        }
                                                    </span>

                                                    <small>
                                                        {
                                                            formatTime(
                                                                order.created_at
                                                            )
                                                        }
                                                    </small>

                                                </div>

                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="admin-order-view-button"
                                                    onClick={() =>
                                                        setSelectedOrder(
                                                            order
                                                        )
                                                    }
                                                >
                                                    <Eye
                                                        size={16}
                                                    />

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

            {/* ========================================
                ORDER DETAILS MODAL
            ======================================== */}

            {selectedOrder && (

                <div
                    className="admin-order-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeDetails();
                        }

                    }}
                >

                    <div className="admin-order-modal">

                        <div className="admin-order-modal-header">

                            <div>
                                <p>
                                    ORDER DETAILS
                                </p>

                                <h2>
                                    Order #
                                    {
                                        selectedOrder.order_id
                                    }
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeDetails}
                                className="admin-order-modal-close"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* CUSTOMER */}

                        <div className="admin-order-detail-section">

                            <h3>
                                Customer Information
                            </h3>

                            <div className="admin-order-customer-details">

                                <div>
                                    <UserRound
                                        size={17}
                                    />

                                    <span>
                                        {
                                            selectedOrder.customer_name ||
                                            'Guest Customer'
                                        }
                                    </span>
                                </div>

                                <div>
                                    <Mail
                                        size={17}
                                    />

                                    <span>
                                        {
                                            selectedOrder.customer_email ||
                                            'No email'
                                        }
                                    </span>
                                </div>

                                <div>
                                    <Phone
                                        size={17}
                                    />

                                    <span>
                                        {
                                            selectedOrder.customer_phone ||
                                            'No phone'
                                        }
                                    </span>
                                </div>

                                <div>
                                    <MapPin
                                        size={17}
                                    />

                                    <span>
                                        {
                                            selectedOrder.delivery_address ||
                                            'No delivery address'
                                        }
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* ORDER INFO */}

                        <div className="admin-order-detail-section">

                            <h3>
                                Order Information
                            </h3>

                            <div className="admin-order-information-grid">

                                <div>
                                    <span>
                                        Status
                                    </span>

                                    <strong
                                        className={`admin-order-status-badge ${getStatusClass(
                                            selectedOrder.status
                                        )}`}
                                    >
                                        {
                                            selectedOrder.status
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Order Date
                                    </span>

                                    <strong>
                                        <CalendarDays
                                            size={15}
                                        />

                                        {
                                            formatDate(
                                                selectedOrder.created_at
                                            )
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        {
                                            formatAmount(
                                                selectedOrder.total_amount
                                            )
                                        }
                                    </strong>
                                </div>

                            </div>

                        </div>

                        {/* ITEMS */}

                        <div className="admin-order-detail-section">

                            <h3>
                                Ordered Coffees
                            </h3>

                            <div className="admin-order-items">

                                {selectedOrder.items?.map(
                                    (item) => (

                                        <div
                                            className="admin-order-item"
                                            key={
                                                item.order_item_id
                                            }
                                        >

                                            <div className="admin-order-item-image">

                                                {item.coffee_image ? (
                                                    <img
                                                        src={
                                                            item.coffee_image
                                                        }
                                                        alt={
                                                            item.coffee_name
                                                        }
                                                    />
                                                ) : (
                                                    <Package
                                                        size={22}
                                                    />
                                                )}

                                            </div>

                                            <div className="admin-order-item-info">

                                                <strong>
                                                    {
                                                        item.coffee_name
                                                    }
                                                </strong>

                                                <span>
                                                    Qty:{' '}
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                            </div>

                                            <div className="admin-order-item-price">

                                                <span>
                                                    {
                                                        formatAmount(
                                                            item.unit_price
                                                        )
                                                    }{' '}
                                                    ×{' '}
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                                <strong>
                                                    {
                                                        formatAmount(
                                                            item.subtotal
                                                        )
                                                    }
                                                </strong>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                        {/* STATUS UPDATE */}

                        <div className="admin-order-modal-footer">

                            <div>

                                <span>
                                    Update Status
                                </span>

                                <select
                                    value={
                                        selectedOrder.status
                                    }
                                    disabled={
                                        updatingOrderId ===
                                        selectedOrder.order_id
                                    }
                                    onChange={(event) =>
                                        updateOrderStatus(
                                            selectedOrder.order_id,
                                            event.target.value
                                        )
                                    }
                                >

                                    {STATUS_OPTIONS
                                        .filter(
                                            (status) =>
                                                status !== 'All'
                                        )
                                        .map(
                                            (status) => (
                                                <option
                                                    key={
                                                        status
                                                    }
                                                    value={
                                                        status
                                                    }
                                                >
                                                    {status}
                                                </option>
                                            )
                                        )}

                                </select>

                            </div>

                            <button
                                type="button"
                                onClick={closeDetails}
                                className="admin-order-close-button"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminOrders;