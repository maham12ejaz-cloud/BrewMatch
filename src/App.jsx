import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import AdminSidebar from './components/AdminSidebar/AdminSidebar';

import Home from './pages/Home/Home';
import Quiz from './pages/Quiz/Quiz';
import Result from './pages/Result/Result';
import Coffees from './pages/Coffees/Coffees';
import CoffeeDetails from './pages/CoffeeDetails/CoffeeDetails';

import Cart from './pages/Cart/Cart';
import Favourites from './pages/Favourites/Favourites';
import Checkout from './pages/Checkout/Checkout';
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation';

import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Profile from './pages/Profile/Profile';

import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';

import AdminLogin from './pages/AdminLogin/AdminLogin';

import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminCoffees from './pages/AdminCoffees/AdminCoffees';
import AdminOrders from './pages/AdminOrders/AdminOrders';
import AdminUsers from './pages/AdminUsers/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics/AdminAnalytics';
import AdminSettings from './pages/AdminSettings/AdminSettings';


/* =========================
   ADMIN LAYOUT
========================= */

function AdminLayout() {

    return (

        <div className="admin-layout">

            <AdminSidebar />

            <div className="admin-layout-content">

                <Routes>

                    {/* ADMIN HOME */}
                    <Route
                        path="/"
                        element={
                            <AdminDashboard />
                        }
                    />

                    {/* ADMIN DASHBOARD */}
                    <Route
                        path="/dashboard"
                        element={
                            <AdminDashboard />
                        }
                    />

                    {/* ADMIN COFFEES */}
                    <Route
                        path="/coffees"
                        element={
                            <AdminCoffees />
                        }
                    />

                    {/* ADMIN ORDERS */}
                    <Route
                        path="/orders"
                        element={
                            <AdminOrders />
                        }
                    />

                    {/* ADMIN USERS */}
                    <Route
                        path="/users"
                        element={
                            <AdminUsers />
                        }
                    />

                    {/* ADMIN ANALYTICS */}
                    <Route
                        path="/analytics"
                        element={
                            <AdminAnalytics />
                        }
                    />

                    {/* ADMIN SETTINGS */}
                    <Route
                        path="/settings"
                        element={
                            <AdminSettings />
                        }
                    />

                </Routes>

            </div>

        </div>
    );
}


/* =========================
   APP LAYOUT
========================= */

function AppLayout() {

    const location = useLocation();

    const isAdminPage =
        location.pathname.startsWith('/admin');


    return (
        <>

            {/* PUBLIC NAVBAR */}

            {!isAdminPage && (
                <Navbar />
            )}


            <Routes>

                {/* =========================
                    PUBLIC ROUTES
                ========================= */}

                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />

                <Route
                    path="/signup"
                    element={
                        <Signup />
                    }
                />

                <Route
                    path="/forgot-password"
                    element={
                        <ForgotPassword />
                    }
                />

                <Route
                    path="/reset-password"
                    element={
                        <ResetPassword />
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <Profile />
                    }
                />

                <Route
                    path="/quiz"
                    element={
                        <Quiz />
                    }
                />

                <Route
                    path="/result"
                    element={
                        <Result />
                    }
                />

                <Route
                    path="/coffees"
                    element={
                        <Coffees />
                    }
                />

                <Route
                    path="/coffee/:id"
                    element={
                        <CoffeeDetails />
                    }
                />

                <Route
                    path="/favorites"
                    element={
                        <Favourites />
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <Cart />
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <Checkout />
                    }
                />

                <Route
                    path="/order-confirmation"
                    element={
                        <OrderConfirmation />
                    }
                />


                {/* =========================
                    ADMIN LOGIN
                ========================= */}

                <Route
                    path="/admin/login"
                    element={
                        <AdminLogin />
                    }
                />


                {/* =========================
                    ADMIN ROUTES
                ========================= */}

                <Route
                    path="/admin/*"
                    element={
                        <AdminLayout />
                    }
                />

            </Routes>


            {/* PUBLIC FOOTER */}

            {!isAdminPage && (
                <Footer />
            )}

        </>
    );
}


/* =========================
   APP
========================= */

function App() {

    return (

        <BrowserRouter>

            <AppLayout />

        </BrowserRouter>
    );
}

export default App;