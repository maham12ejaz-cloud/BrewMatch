import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Coffee,
  Heart,
  Trash2
} from 'lucide-react';

import './Favourites.css';

import {
  removeFromFavorites
} from '../../utils/storage';

import {
  getFavorites,
  removeFavorite
} from '../../utils/api';

function Favourites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');

        if (!token) {
          setError('Please login to view your favorites.');
          return;
        }

        const data = await getFavorites(token);

        if (data.success) {
          setFavorites(data.favorites);
        } else {
          setError('Failed to load favorites.');
        }
      } catch (error) {
        console.error('Fetch favorites error:', error);
        setError('Unable to load your favorites.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (coffeeId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Please login to manage favorites.');
        return;
      }

      await removeFavorite(coffeeId, token);

      setFavorites((currentFavorites) =>
        currentFavorites.filter(
          (coffee) => coffee.id !== coffeeId
        )
      );

      // Remove old localStorage favorite too
      removeFromFavorites(coffeeId);
    } catch (error) {
      console.error('Remove favorite error:', error);
      setError('Unable to remove this favorite.');
    }
  };

  if (loading) {
    return (
      <main className="favorites-page">

        <div className="empty-favorites">

          <div className="empty-favorites-icon">
            <Heart />
          </div>

          <h1>
            Loading Favorites...
          </h1>

          <p>
            Please wait while we load your favorite coffees.
          </p>

        </div>

      </main>
    );
  }

  if (error && favorites.length === 0) {
    return (
      <main className="favorites-page">

        <div className="empty-favorites">

          <div className="empty-favorites-icon">
            <Heart />
          </div>

          <h1>
            Favorites
          </h1>

          <p>
            {error}
          </p>

          <Link to="/coffees">
            <button className="browse-favorites-button">

              <Coffee />

              <span>
                Explore Coffees
              </span>

            </button>
          </Link>

        </div>

      </main>
    );
  }

  if (favorites.length === 0) {
    return (
      <main className="favorites-page">

        <div className="empty-favorites">

          <div className="empty-favorites-icon">
            <Heart />
          </div>

          <h1>
            No Favorites Yet
          </h1>

          <p>
            You haven't added any coffee to your
            favorites yet.
          </p>

          <Link to="/coffees">
            <button className="browse-favorites-button">

              <Coffee />

              <span>
                Explore Coffees
              </span>

            </button>
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="favorites-page">

      <div className="favorites-container">

        {/* Page Header */}

        <div className="favorites-header">

          <span>
            Your Favorites
          </span>

          <div className="favorites-title">

            <h1>
              Favorite Coffees
            </h1>

            <Coffee className="favorites-title-icon" />

          </div>

          <p>
            Your favorite coffees are saved here
            for easy access.
          </p>

        </div>


        {/* Error Message */}

        {error && (
          <p>
            {error}
          </p>
        )}


        {/* Favorites Grid */}

        <div className="favorites-grid">

          {favorites.map((coffee) => (

            <div
              className="favorite-card"
              key={coffee.id}
            >

              {/* Coffee Image */}

              <div className="favorite-image">

                <img
                  src={coffee.image}
                  alt={coffee.name}
                />

              </div>


              {/* Coffee Content */}

              <div className="favorite-content">

                <h2>
                  {coffee.name}
                </h2>

                <p>
                  {coffee.description}
                </p>


                {/* Coffee Information */}

                <div className="favorite-info">

                  <span>
                    {coffee.strength}
                  </span>

                  <strong>
                    ₨{coffee.price}
                  </strong>

                </div>


                {/* Actions */}

                <div className="favorite-actions">

                  <Link
                    to={`/coffee/${coffee.id}`}
                  >
                    <button className="view-favorite-button">
                      View Details
                    </button>
                  </Link>

                  <button
                    className="remove-favorite-button"
                    onClick={() =>
                      handleRemove(coffee.id)
                    }
                  >

                    <Trash2 />

                    <span>
                      Remove
                    </span>

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}

export default Favourites;