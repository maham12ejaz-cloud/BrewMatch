import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './CoffeeDetails.css';

import {
  addToCart
} from '../../utils/storage';

import {
  getCoffeeById,
  getFavorites,
  addFavorite,
  removeFavorite
} from '../../utils/api';

function CoffeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coffee, setCoffee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showMessage, setShowMessage] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // =========================
  // FETCH COFFEE
  // =========================

  useEffect(() => {
    const fetchCoffee = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getCoffeeById(id);

        if (data.success) {
          setCoffee(data.coffee);
        } else {
          setError('Coffee not found.');
        }
      } catch (error) {
        console.error('Fetch coffee error:', error);
        setError('Unable to connect to the coffee server.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoffee();
  }, [id]);


  // =========================
  // CHECK FAVORITE
  // =========================

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setIsFavorite(false);
          return;
        }

        const data = await getFavorites(token);

        if (data.success) {
          const favoriteExists = data.favorites.some(
            (item) => item.id === Number(id)
          );

          setIsFavorite(favoriteExists);
        }
      } catch (error) {
        console.error('Check favorite error:', error);
      }
    };

    checkFavorite();
  }, [id]);


  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = () => {
    addToCart(coffee);

    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };


  // =========================
  // HANDLE FAVORITE
  // =========================

  const handleFavorite = async () => {

    const token = localStorage.getItem('token');

    // Guest user
    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setFavoriteLoading(true);
      setError('');

      if (isFavorite) {
        await removeFavorite(coffee.id, token);

        setIsFavorite(false);
      } else {
        await addFavorite(coffee.id, token);

        setIsFavorite(true);
      }

    } catch (error) {
      console.error('Favorite error:', error);
      setError('Unable to update your favorite.');
    } finally {
      setFavoriteLoading(false);
    }
  };


  // =========================
  // LOGIN FROM POPUP
  // =========================

  const handleLoginRedirect = () => {
    setShowLoginPopup(false);
    navigate('/login');
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="coffee-details-page">

        <div className="coffee-not-found">

          <span className="coffee-not-found-label">
            Coffee Collection
          </span>

          <h1>
            Loading Coffee...
          </h1>

          <p>
            Please wait while we load the coffee details.
          </p>

        </div>

      </main>
    );
  }


  // =========================
  // COFFEE NOT FOUND
  // =========================

  if (error && !coffee) {
    return (
      <main className="coffee-details-page">

        <div className="coffee-not-found">

          <span className="coffee-not-found-label">
            Coffee Collection
          </span>

          <h1>
            Coffee Not Found
          </h1>

          <p>
            {error ||
              "Sorry, we couldn't find the coffee you are looking for."}
          </p>

          <button
            className="back-button"
            onClick={() => navigate('/coffees')}
          >
            ← Back to Coffees
          </button>

        </div>

      </main>
    );
  }


  // =========================
  // MAIN PAGE
  // =========================

  return (
    <main className="coffee-details-page">

      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {showMessage && (
        <div className="cart-success-toast">

          <div className="toast-icon">
            ✓
          </div>

          <div className="toast-content">

            <strong>
              Added to Cart
            </strong>

            <span>
              {coffee.name} has been added
              to your cart.
            </span>

          </div>

        </div>
      )}


      {/* =========================
          LOGIN REQUIRED POPUP
      ========================= */}

      {showLoginPopup && (
        <div
          className="login-popup-overlay"
          onClick={() => setShowLoginPopup(false)}
        >

          <div
            className="login-popup"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="login-popup-icon">
              ♡
            </div>

            <h2>
              Login Required
            </h2>

            <p>
              Please login to add coffees
              to your favorites.
            </p>

            <div className="login-popup-actions">

              <button
                type="button"
                className="login-popup-cancel"
                onClick={() => setShowLoginPopup(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="login-popup-login"
                onClick={handleLoginRedirect}
              >
                Login
              </button>

            </div>

          </div>

        </div>
      )}


      {/* =========================
          MAIN CONTAINER
      ========================= */}

      <div className="coffee-details-container">

        {/* =========================
            BACK BUTTON
        ========================= */}

        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back to Coffees
        </button>


        {/* =========================
            IMAGE
        ========================= */}

        <div className="coffee-details-image">

          <img
            src={coffee.image}
            alt={coffee.name}
          />

        </div>


        {/* =========================
            CONTENT
        ========================= */}

        <div className="coffee-details-content">

          <span className="coffee-details-label">
            Coffee Details
          </span>

          <h1>
            {coffee.name}
          </h1>

          <p className="coffee-details-description">
            {coffee.description}
          </p>


          {/* =========================
              COFFEE INFORMATION
          ========================= */}

          <div className="coffee-details-info">

            <div className="detail-item">
              <span>Strength</span>
              <strong>{coffee.strength}</strong>
            </div>

            <div className="detail-item">
              <span>Taste</span>
              <strong>{coffee.taste}</strong>
            </div>

            <div className="detail-item">
              <span>Milk</span>
              <strong>{coffee.milk}</strong>
            </div>

            <div className="detail-item">
              <span>Temperature</span>
              <strong>{coffee.temperature}</strong>
            </div>

            <div className="detail-item">
              <span>Sweetness</span>
              <strong>{coffee.sweetness}</strong>
            </div>

          </div>


          {/* =========================
              PRICE & ACTIONS
          ========================= */}

          <div className="coffee-details-bottom">

            <div className="price-section">

              <span>
                Price
              </span>

              <strong className="coffee-details-price">
                ₨{coffee.price}
              </strong>

            </div>


            <div className="coffee-details-actions">

              <button
                className={`favorite-button ${
                  isFavorite ? 'active' : ''
                }`}
                onClick={handleFavorite}
                disabled={favoriteLoading}
              >
                {favoriteLoading
                  ? 'Updating...'
                  : isFavorite
                    ? '♥ Favorited'
                    : '♡ Favorite'}
              </button>

              <button
                className="coffee-details-button"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default CoffeeDetails;