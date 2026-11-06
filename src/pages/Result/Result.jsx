import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Result.css';

import Button from '../../components/Button/Button';

import { addToCart } from '../../utils/storage';

function Result() {
  const navigate = useNavigate();

  // ===============================
  // Load Saved Results
  // ===============================

  const [results] = useState(() => {
    const savedResults = sessionStorage.getItem(
      'brewmatch-results'
    );

    if (!savedResults) {
      return [];
    }

    try {
      return JSON.parse(savedResults);
    } catch (error) {
      console.error(
        'Unable to load saved results:',
        error
      );

      return [];
    }
  });

  // ===============================
  // View Coffee Details
  // ===============================

  const handleViewDetails = (coffeeId) => {
    navigate(`/coffee/${coffeeId}`);
  };

  // ===============================
  // Order Coffee
  // ===============================

  const handleOrder = (coffee) => {
    addToCart(coffee);

    navigate('/cart');
  };

  // ===============================
  // Retake Quiz
  // ===============================

  const handleRetakeQuiz = () => {
    sessionStorage.removeItem(
      'brewmatch-results'
    );

    navigate('/quiz');
  };

  // ===============================
  // No Results
  // ===============================

  if (results.length === 0) {
    return (
      <main className="result-page">
        <div className="result-empty">
          <h1>No Results Found</h1>

          <p>
            Please take the coffee quiz first
            to discover your best matches.
          </p>

          <button
            className="retake-quiz-button"
            onClick={() => navigate('/quiz')}
          >
            Take Quiz
          </button>
        </div>
      </main>
    );
  }

  // ===============================
  // Result Page
  // ===============================

  return (
    <main className="result-page">
      <div className="result-container">

        {/* ===============================
            Header
        =============================== */}

        <div className="result-header">
          <span className="result-label">
            Your Personalized Results
          </span>

          <h1>
            Your Coffee Matches
          </h1>

          <p>
            Based on your answers, these coffees
            are the best matches for your taste.
          </p>
        </div>

        {/* ===============================
            Result Cards
        =============================== */}

        <div className="result-list">

          {results.map((coffee, index) => (
            <div
              className="result-card"
              key={coffee.id}
            >

              {/* ===============================
                  Coffee Image
              =============================== */}

              <div className="result-card-image">
                <img
                  src={coffee.image}
                  alt={coffee.name}
                />
              </div>

              {/* ===============================
                  Coffee Content
              =============================== */}

              <div className="result-card-content">

                {/* Match Percentage + Rank */}

                <div className="result-card-top">

                  <span className="match-badge">
                    {coffee.matchPercentage}% Match
                  </span>

                  <span className="result-rank">
                    #{index + 1}
                  </span>

                </div>

                {/* Coffee Name */}

                <h2>
                  {coffee.name}
                </h2>

                {/* Description */}

                <p className="result-card-description">
                  {coffee.description}
                </p>

                {/* ===============================
                    Personalized Recommendation
                =============================== */}

                {coffee.recommendationReason && (
                  <div className="recommendation-reason">

                    <span className="recommendation-label">
                      Why this coffee?
                    </span>

                    <p>
                      {coffee.recommendationReason}
                    </p>

                  </div>
                )}

                {/* Coffee Information */}

                <div className="result-card-info">

                  <span>
                    {coffee.strength}
                  </span>

                  <span>
                    ₨{coffee.price}
                  </span>

                </div>

                {/* Actions */}

                <div className="result-card-actions">

                  <Button
                    onClick={() =>
                      handleViewDetails(
                        coffee.id
                      )
                    }
                  >
                    View Details
                  </Button>

                  <button
                    className="result-order-button"
                    onClick={() =>
                      handleOrder(coffee)
                    }
                  >
                    Order Now
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

        {/* ===============================
            Retake Quiz
        =============================== */}

        <div className="result-retake">

          <button
            className="retake-quiz-button"
            onClick={handleRetakeQuiz}
          >
            Retake Quiz
          </button>

        </div>

      </div>
    </main>
  );
}

export default Result;