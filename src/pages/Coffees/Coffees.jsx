
import { useEffect, useState } from 'react';

import './Coffees.css';

import CoffeeCard from '../../components/CoffeeCard/CoffeeCard';
import { getCoffees } from '../../utils/api';

function Coffees() {
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getCoffees();

        if (data.success) {
          setCoffees(data.coffees);
        } else {
          setError('Failed to load coffees.');
        }
      } catch (error) {
        console.error('Fetch coffees error:', error);
        setError('Unable to connect to the coffee server.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoffees();
  }, []);

  return (
    <main className="coffees-page">

      <div className="coffees-container">

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="coffees-header">

          <span className="coffees-label">
            Our Collection
          </span>

          <h1>
            Explore Our Coffees
          </h1>

          <p>
            Discover coffees with different flavors,
            strengths, temperatures, and sweetness levels.
          </p>

          {!loading && !error && (
            <div className="coffee-count">
              <strong>{coffees.length}</strong>
              <span>Coffees Available</span>
            </div>
          )}

        </div>


        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="coffee-loading">
            <p>Loading coffees...</p>
          </div>
        )}


        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (
          <div className="coffee-error">
            <p>{error}</p>
          </div>
        )}


        {/* =========================
            COFFEE GRID
        ========================= */}

        {!loading && !error && (
          <div className="coffees-grid">

            {coffees.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
              />
            ))}

          </div>
        )}

      </div>

    </main>
  );
}

export default Coffees;
