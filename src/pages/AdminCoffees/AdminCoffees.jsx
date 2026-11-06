import { useEffect, useMemo, useState } from 'react';

import {
    Plus,
    Search,
    SlidersHorizontal,
    ArrowUpDown,
    Pencil,
    Trash2,
    X,
    Save,
    Coffee,
    RefreshCw,
    CheckCircle,
    Undo2
} from 'lucide-react';

import './AdminCoffees.css';

const API_URL = 'http://localhost:5000/api/coffees';

const initialForm = {
    name: '',
    description: '',
    price: '',
    image: '',
    strength: 'Medium',
    taste: '',
    milk: 'Any',
    temperature: 'Both',
    sweetness: 'Slightly Sweet'
};

function AdminCoffees() {

    // =========================
    // COFFEE DATA
    // =========================

    const [coffees, setCoffees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');


    // =========================
    // TOAST
    // =========================

    const [toast, setToast] = useState({
        show: false,
        message: '',
        undo: false
    });

    const [deletedCoffee, setDeletedCoffee] =
        useState(null);

    const [undoLoading, setUndoLoading] =
        useState(false);


    // =========================
    // SEARCH / FILTER / SORT
    // =========================

    const [search, setSearch] = useState('');

    const [strengthFilter, setStrengthFilter] =
        useState('All');

    const [milkFilter, setMilkFilter] =
        useState('All');

    const [temperatureFilter, setTemperatureFilter] =
        useState('All');

    const [sweetnessFilter, setSweetnessFilter] =
        useState('All');

    const [sortBy, setSortBy] =
        useState('name');

    const [sortOrder, setSortOrder] =
        useState('asc');


    // =========================
    // MODAL
    // =========================

    const [showModal, setShowModal] =
        useState(false);

    const [editingCoffee, setEditingCoffee] =
        useState(null);


    // =========================
    // FORM
    // =========================

    const [form, setForm] =
        useState(initialForm);

    const [saving, setSaving] =
        useState(false);


    // =========================
    // DELETE
    // =========================

    const [deletingId, setDeletingId] =
        useState(null);


    // =========================
    // SHOW TOAST
    // =========================

    const showToast = (
        message,
        undo = false
    ) => {

        setToast({
            show: true,
            message,
            undo
        });

    };


    // =========================
    // CLOSE TOAST
    // =========================

    const closeToast = () => {

        setToast({
            show: false,
            message: '',
            undo: false
        });

        setDeletedCoffee(null);
    };


    // =========================
    // FETCH COFFEES
    // =========================

    const fetchCoffees = async () => {

        try {

            setLoading(true);

            setError('');

            const response =
                await fetch(API_URL);

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'Failed to load coffees.'
                );
            }

            setCoffees(
                Array.isArray(data.coffees)
                    ? data.coffees
                    : []
            );

        } catch (error) {

            console.error(
                'Fetch coffees error:',
                error
            );

            setError(
                error.message ||
                'Failed to load coffees.'
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        let cancelled = false;

        const loadCoffees = async () => {

            try {

                const response =
                    await fetch(API_URL);

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'Failed to load coffees.'
                    );
                }

                if (cancelled) {
                    return;
                }

                setCoffees(
                    Array.isArray(data.coffees)
                        ? data.coffees
                        : []
                );

                setError('');

            } catch (error) {

                if (cancelled) {
                    return;
                }

                console.error(
                    'Fetch coffees error:',
                    error
                );

                setError(
                    error.message ||
                    'Failed to load coffees.'
                );

            } finally {

                if (!cancelled) {

                    setLoading(false);
                }
            }
        };

        loadCoffees();

        return () => {
            cancelled = true;
        };

    }, []);


    // =========================
    // FORM CHANGE
    // =========================

    const handleFormChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setError('');
    };


    // =========================
    // OPEN ADD MODAL
    // =========================

    const openAddModal = () => {

        setEditingCoffee(null);

        setForm(initialForm);

        setError('');

        setShowModal(true);
    };


    // =========================
    // OPEN EDIT MODAL
    // =========================

    const openEditModal = (coffee) => {

        setEditingCoffee(coffee);

        setForm({
            name: coffee.name || '',
            description: coffee.description || '',
            price: coffee.price ?? '',
            image: coffee.image || '',
            strength: coffee.strength || 'Medium',
            taste: coffee.taste || '',
            milk: coffee.milk || 'Any',
            temperature:
                coffee.temperature || 'Both',
            sweetness:
                coffee.sweetness || 'Slightly Sweet'
        });

        setError('');

        setShowModal(true);
    };


    // =========================
    // CLOSE MODAL
    // =========================

    const closeModal = () => {

        if (saving) {
            return;
        }

        setShowModal(false);

        setEditingCoffee(null);

        setForm(initialForm);
    };


    // =========================
    // SUBMIT COFFEE
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setSaving(true);

        setError('');

        try {

            const payload = {
                name: form.name.trim(),
                description:
                    form.description.trim(),
                price: Number(form.price),
                image: form.image.trim(),
                strength: form.strength,
                taste: form.taste.trim(),
                milk: form.milk,
                temperature:
                    form.temperature,
                sweetness:
                    form.sweetness
            };


            // =========================
            // ADD
            // =========================

            if (!editingCoffee) {

                const response =
                    await fetch(API_URL, {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify(payload)
                    });

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'Failed to add coffee.'
                    );
                }

                showToast(
                    'Coffee added successfully.'
                );
            }


            // =========================
            // UPDATE
            // =========================

            else {

                const response =
                    await fetch(
                        `${API_URL}/${editingCoffee.id}`,
                        {
                            method: 'PUT',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body:
                                JSON.stringify(payload)
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'Failed to update coffee.'
                    );
                }

                showToast(
                    'Coffee updated successfully.'
                );
            }


            // =========================
            // REFRESH LIST
            // =========================

            await fetchCoffees();

            setShowModal(false);

            setEditingCoffee(null);

            setForm(initialForm);

        } catch (error) {

            console.error(
                'Save coffee error:',
                error
            );

            setError(
                error.message ||
                'Failed to save coffee.'
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================
    // DELETE COFFEE
    // =========================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                'Are you sure you want to delete this coffee?'
            );

        if (!confirmed) {
            return;
        }

        const coffeeToDelete =
            coffees.find(
                (coffee) =>
                    coffee.id === id
            );

        if (!coffeeToDelete) {
            return;
        }

        try {

            setDeletingId(id);

            setError('');

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: 'DELETE'
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'Failed to delete coffee.'
                );
            }

            setCoffees((previous) =>
                previous.filter(
                    (coffee) =>
                        coffee.id !== id
                )
            );

            setDeletedCoffee(
                coffeeToDelete
            );

            showToast(
                'Coffee deleted successfully.',
                true
            );

        } catch (error) {

            console.error(
                'Delete coffee error:',
                error
            );

            setError(
                error.message ||
                'Failed to delete coffee.'
            );

        } finally {

            setDeletingId(null);
        }
    };


    // =========================
    // UNDO DELETE
    // =========================

    const handleUndoDelete = async () => {

        if (!deletedCoffee) {
            return;
        }

        try {

            setUndoLoading(true);

            const {
                ...coffeeData
            } = deletedCoffee;

            const response =
                await fetch(API_URL, {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            coffeeData
                        )
                });

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'Failed to restore coffee.'
                );
            }

            await fetchCoffees();

            setDeletedCoffee(null);

            setToast({
                show: true,
                message:
                    'Coffee restored successfully.',
                undo: false
            });

        } catch (error) {

            console.error(
                'Undo delete error:',
                error
            );

            setError(
                error.message ||
                'Failed to restore coffee.'
            );

            closeToast();

        } finally {

            setUndoLoading(false);
        }
    };


    // =========================
    // FILTER + SORT
    // =========================

    const filteredCoffees = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();

        const result =
            coffees.filter((coffee) => {

                const matchesSearch =
                    !searchValue ||
                    coffee.name
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    coffee.taste
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    coffee.description
                        ?.toLowerCase()
                        .includes(searchValue);

                const matchesStrength =
                    strengthFilter === 'All' ||
                    coffee.strength ===
                        strengthFilter;

                const matchesMilk =
                    milkFilter === 'All' ||
                    coffee.milk === milkFilter;

                const matchesTemperature =
                    temperatureFilter === 'All' ||
                    coffee.temperature ===
                        temperatureFilter;

                const matchesSweetness =
                    sweetnessFilter === 'All' ||
                    coffee.sweetness ===
                        sweetnessFilter;

                return (
                    matchesSearch &&
                    matchesStrength &&
                    matchesMilk &&
                    matchesTemperature &&
                    matchesSweetness
                );
            });


        return result.sort((a, b) => {

            if (sortBy === 'price') {

                const priceA =
                    Number(a.price) || 0;

                const priceB =
                    Number(b.price) || 0;

                return sortOrder === 'asc'
                    ? priceA - priceB
                    : priceB - priceA;
            }


            const nameA =
                (a.name || '').toLowerCase();

            const nameB =
                (b.name || '').toLowerCase();

            return sortOrder === 'asc'
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
        });

    }, [
        coffees,
        search,
        strengthFilter,
        milkFilter,
        temperatureFilter,
        sweetnessFilter,
        sortBy,
        sortOrder
    ]);


    // =========================
    // RESET FILTERS
    // =========================

    const resetFilters = () => {

        setSearch('');

        setStrengthFilter('All');

        setMilkFilter('All');

        setTemperatureFilter('All');

        setSweetnessFilter('All');

        setSortBy('name');

        setSortOrder('asc');
    };


    // =========================
    // SORT TOGGLE
    // =========================

    const toggleSortOrder = () => {

        setSortOrder((previous) =>
            previous === 'asc'
                ? 'desc'
                : 'asc'
        );
    };


    // =========================
    // PAGE
    // =========================

    return (

        <main className="admin-coffees-page">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <header className="admin-coffees-header">

                <div>

                    <p className="admin-coffees-label">
                        BREWMATCH ADMIN
                    </p>

                    <h1>
                        Coffee Management
                    </h1>

                    <p className="admin-coffees-description">
                        Manage your coffee collection,
                        prices and preferences.
                    </p>

                </div>

                <button
                    type="button"
                    className="admin-add-coffee-button"
                    onClick={openAddModal}
                >
                    <Plus size={18} />

                    <span>
                        Add Coffee
                    </span>
                </button>

            </header>


            {/* =========================
                ERROR
            ========================= */}

            {error && !showModal && (

                <div className="admin-coffees-alert error">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setError('')
                        }
                    >
                        <X size={16} />
                    </button>

                </div>

            )}


            {/* =========================
                RIGHT SIDE TOAST
            ========================= */}

            {toast.show && (

                <div className="admin-coffee-toast">

                    <div className="admin-coffee-toast-icon">

                        <CheckCircle
                            size={19}
                            strokeWidth={2}
                        />

                    </div>

                    <div className="admin-coffee-toast-content">

                        <strong>
                            {toast.message}
                        </strong>

                        {toast.undo && (
                            <button
                                type="button"
                                className="admin-coffee-toast-undo"
                                onClick={
                                    handleUndoDelete
                                }
                                disabled={undoLoading}
                            >
                                <Undo2 size={14} />

                                {undoLoading
                                    ? 'Restoring...'
                                    : 'Undo'}
                            </button>
                        )}

                    </div>

                    <button
                        type="button"
                        className="admin-coffee-toast-close"
                        onClick={closeToast}
                        aria-label="Close notification"
                    >
                        <X size={16} />
                    </button>

                </div>

            )}


            {/* =========================
                SEARCH + FILTERS
            ========================= */}

            <section className="admin-coffees-controls">

                <div className="admin-coffees-search">

                    <Search size={18} />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search coffees..."
                    />

                </div>


                <div className="admin-coffees-filter-icon">

                    <SlidersHorizontal
                        size={18}
                    />

                    <span>
                        Filters
                    </span>

                </div>


                <select
                    value={strengthFilter}
                    onChange={(event) =>
                        setStrengthFilter(
                            event.target.value
                        )
                    }
                    aria-label="Filter by strength"
                >
                    <option value="All">
                        All Strengths
                    </option>

                    <option value="Strong">
                        Strong
                    </option>

                    <option value="Medium">
                        Medium
                    </option>

                    <option value="Light">
                        Light
                    </option>
                </select>


                <select
                    value={milkFilter}
                    onChange={(event) =>
                        setMilkFilter(
                            event.target.value
                        )
                    }
                    aria-label="Filter by milk"
                >
                    <option value="All">
                        All Milk
                    </option>

                    <option value="Milk">
                        Milk
                    </option>

                    <option value="No Milk">
                        No Milk
                    </option>

                    <option value="Any">
                        Any
                    </option>
                </select>


                <select
                    value={temperatureFilter}
                    onChange={(event) =>
                        setTemperatureFilter(
                            event.target.value
                        )
                    }
                    aria-label="Filter by temperature"
                >
                    <option value="All">
                        All Temperatures
                    </option>

                    <option value="Hot">
                        Hot
                    </option>

                    <option value="Cold">
                        Cold
                    </option>

                    <option value="Both">
                        Both
                    </option>
                </select>


                <select
                    value={sweetnessFilter}
                    onChange={(event) =>
                        setSweetnessFilter(
                            event.target.value
                        )
                    }
                    aria-label="Filter by sweetness"
                >
                    <option value="All">
                        All Sweetness
                    </option>

                    <option value="Not Sweet">
                        Not Sweet
                    </option>

                    <option value="Slightly Sweet">
                        Slightly Sweet
                    </option>

                    <option value="Very Sweet">
                        Very Sweet
                    </option>

                </select>

            </section>


            {/* =========================
                SORT ROW
            ========================= */}

            <section className="admin-coffees-sort-row">

                <div className="admin-coffees-result-count">

                    <Coffee size={17} />

                    <span>
                        {filteredCoffees.length}
                        {' '}
                        {filteredCoffees.length === 1
                            ? 'coffee'
                            : 'coffees'}
                    </span>

                </div>


                <div className="admin-coffees-sort">

                    <ArrowUpDown size={16} />

                    <span>
                        Sort by
                    </span>

                    <select
                        value={sortBy}
                        onChange={(event) =>
                            setSortBy(
                                event.target.value
                            )
                        }
                    >
                        <option value="name">
                            Name
                        </option>

                        <option value="price">
                            Price
                        </option>

                    </select>

                    <button
                        type="button"
                        className="admin-sort-direction"
                        onClick={toggleSortOrder}
                    >
                        {sortOrder === 'asc'
                            ? 'A → Z'
                            : 'Z → A'}
                    </button>

                    <button
                        type="button"
                        className="admin-reset-filters"
                        onClick={resetFilters}
                    >
                        Reset
                    </button>

                </div>

            </section>


            {/* =========================
                COFFEE LIST
            ========================= */}

            <section className="admin-coffees-card">

                {loading ? (

                    <div className="admin-coffees-loading">

                        <RefreshCw
                            size={22}
                            className="admin-loading-icon"
                        />

                        <span>
                            Loading coffees...
                        </span>

                    </div>

                ) : filteredCoffees.length === 0 ? (

                    <div className="admin-coffees-empty">

                        <div className="admin-empty-icon">

                            <Coffee size={28} />

                        </div>

                        <h3>
                            No coffees found
                        </h3>

                        <p>
                            Try changing your search
                            or filters.
                        </p>

                        <button
                            type="button"
                            onClick={resetFilters}
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <div className="admin-coffees-table-wrapper">

                        <table className="admin-coffees-table">

                            <thead>

                                <tr>

                                    <th>
                                        Coffee
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Strength
                                    </th>

                                    <th>
                                        Taste
                                    </th>

                                    <th>
                                        Milk
                                    </th>

                                    <th>
                                        Temperature
                                    </th>

                                    <th>
                                        Sweetness
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredCoffees.map(
                                    (coffee) => (

                                        <tr
                                            key={
                                                coffee.id
                                            }
                                        >

                                            <td>

                                                <div className="admin-coffee-name-cell">

                                                    <div className="admin-coffee-image">

                                                        {coffee.image ? (

                                                            <img
                                                                src={
                                                                    coffee.image
                                                                }
                                                                alt={
                                                                    coffee.name
                                                                }
                                                                onError={(
                                                                    event
                                                                ) => {
                                                                    event.currentTarget.style.display =
                                                                        'none';
                                                                }}
                                                            />

                                                        ) : (

                                                            <Coffee
                                                                size={21}
                                                            />

                                                        )}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                coffee.name
                                                            }
                                                        </strong>

                                                        <span>
                                                            ID #
                                                            {
                                                                coffee.id
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <span className="admin-coffee-price">

                                                    Rs.{' '}
                                                    {Number(
                                                        coffee.price
                                                    ).toLocaleString(
                                                        'en-PK'
                                                    )}

                                                </span>

                                            </td>


                                            <td>

                                                <span
                                                    className={`admin-coffee-badge strength-${(
                                                        coffee.strength ||
                                                        ''
                                                    ).toLowerCase()}`}
                                                >
                                                    {
                                                        coffee.strength
                                                    }
                                                </span>

                                            </td>


                                            <td>
                                                {
                                                    coffee.taste
                                                }
                                            </td>


                                            <td>
                                                {
                                                    coffee.milk
                                                }
                                            </td>


                                            <td>
                                                {
                                                    coffee.temperature
                                                }
                                            </td>


                                            <td>
                                                {
                                                    coffee.sweetness
                                                }
                                            </td>


                                            <td>

                                                <div className="admin-coffee-actions">

                                                    <button
                                                        type="button"
                                                        className="admin-edit-button"
                                                        onClick={() =>
                                                            openEditModal(
                                                                coffee
                                                            )
                                                        }
                                                        title="Edit coffee"
                                                    >
                                                        <Pencil
                                                            size={16}
                                                        />
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="admin-delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                coffee.id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            coffee.id
                                                        }
                                                        title="Delete coffee"
                                                    >

                                                        {deletingId ===
                                                        coffee.id ? (

                                                            <RefreshCw
                                                                size={16}
                                                                className="admin-loading-icon"
                                                            />

                                                        ) : (

                                                            <Trash2
                                                                size={16}
                                                            />

                                                        )}

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* =========================
                ADD / EDIT MODAL
            ========================= */}

            {showModal && (

                <div
                    className="admin-coffee-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div className="admin-coffee-modal">

                        <div className="admin-coffee-modal-header">

                            <div>

                                <p>
                                    BREWMATCH ADMIN
                                </p>

                                <h2>
                                    {editingCoffee
                                        ? 'Edit Coffee'
                                        : 'Add New Coffee'}
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <form
                            className="admin-coffee-form"
                            onSubmit={handleSubmit}
                        >

                            {error && (

                                <div className="admin-coffee-modal-error">

                                    {error}

                                </div>

                            )}


                            <div className="admin-coffee-form-grid">

                                <div className="admin-coffee-field">

                                    <label htmlFor="name">
                                        Coffee Name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="e.g. Cappuccino"
                                        required
                                    />

                                </div>


                                <div className="admin-coffee-field">

                                    <label htmlFor="price">
                                        Price
                                    </label>

                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="e.g. 450"
                                        min="1"
                                        step="0.01"
                                        required
                                    />

                                </div>


                                <div className="admin-coffee-field admin-coffee-field-full">

                                    <label htmlFor="description">
                                        Description
                                    </label>

                                    <textarea
                                        id="description"
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Describe the coffee..."
                                        rows="3"
                                    />

                                </div>


                                <div className="admin-coffee-field admin-coffee-field-full">

                                    <label htmlFor="image">
                                        Image URL
                                    </label>

                                    <input
                                        id="image"
                                        type="text"
                                        name="image"
                                        value={form.image}
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Enter coffee image URL"
                                    />

                                </div>


                                <div className="admin-coffee-field">

                                    <label htmlFor="strength">
                                        Strength
                                    </label>

                                    <select
                                        id="strength"
                                        name="strength"
                                        value={
                                            form.strength
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        required
                                    >

                                        <option value="Strong">
                                            Strong
                                        </option>

                                        <option value="Medium">
                                            Medium
                                        </option>

                                        <option value="Light">
                                            Light
                                        </option>

                                    </select>

                                </div>


                                <div className="admin-coffee-field">

                                    <label htmlFor="taste">
                                        Taste
                                    </label>

                                    <input
                                        id="taste"
                                        type="text"
                                        name="taste"
                                        value={form.taste}
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="e.g. Chocolate"
                                        required
                                    />

                                </div>


                                <div className="admin-coffee-field">

                                    <label htmlFor="milk">
                                        Milk
                                    </label>

                                    <select
                                        id="milk"
                                        name="milk"
                                        value={form.milk}
                                        onChange={
                                            handleFormChange
                                        }
                                        required
                                    >

                                        <option value="Milk">
                                            Milk
                                        </option>

                                        <option value="No Milk">
                                            No Milk
                                        </option>

                                        <option value="Any">
                                            Any
                                        </option>

                                    </select>

                                </div>


                                <div className="admin-coffee-field">

                                    <label htmlFor="temperature">
                                        Temperature
                                    </label>

                                    <select
                                        id="temperature"
                                        name="temperature"
                                        value={
                                            form.temperature
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        required
                                    >

                                        <option value="Hot">
                                            Hot
                                        </option>

                                        <option value="Cold">
                                            Cold
                                        </option>

                                        <option value="Both">
                                            Both
                                        </option>

                                    </select>

                                </div>


                                <div className="admin-coffee-field admin-coffee-field-full">

                                    <label htmlFor="sweetness">
                                        Sweetness
                                    </label>

                                    <select
                                        id="sweetness"
                                        name="sweetness"
                                        value={
                                            form.sweetness
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        required
                                    >

                                        <option value="Not Sweet">
                                            Not Sweet
                                        </option>

                                        <option value="Slightly Sweet">
                                            Slightly Sweet
                                        </option>

                                        <option value="Very Sweet">
                                            Very Sweet
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="admin-coffee-modal-actions">

                                <button
                                    type="button"
                                    className="admin-coffee-cancel"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-coffee-save"
                                    disabled={saving}
                                >

                                    {saving ? (

                                        <RefreshCw
                                            size={17}
                                            className="admin-loading-icon"
                                        />

                                    ) : editingCoffee ? (

                                        <Save size={17} />

                                    ) : (

                                        <Plus size={17} />

                                    )}

                                    {saving
                                        ? 'Saving...'
                                        : editingCoffee
                                            ? 'Update Coffee'
                                            : 'Add Coffee'}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </main>
    );
}

export default AdminCoffees;