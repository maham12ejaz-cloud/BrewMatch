
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

import Button from '../../components/Button/Button';
import CoffeeCard from '../../components/CoffeeCard/CoffeeCard';

import coffees from '../../data/coffees';

function Home() {
  const heroRef = useRef(null);

  const [heroVisible, setHeroVisible] = useState(true);

  const featuredCoffees = coffees.slice(0, 6);

  useEffect(() => {
    const heroElement = heroRef.current;

    if (!heroElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting);
      },
      {
        threshold: 0.25
      }
    );

    observer.observe(heroElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="home-page">

      {/* =========================
          HERO SECTION
      ========================= */}

      <section
        ref={heroRef}
        className={`hero-section ${
          heroVisible ? 'hero-visible' : ''
        }`}
      >

        <div className="hero-content">

          <span className="hero-label">
            Personalized Coffee Experience
          </span>

          <h1>
            Find Your Perfect
            <span> Coffee Match</span>
          </h1>

          <p>
            Not sure what coffee to choose?
            Answer a few simple questions and
            discover coffees that match your taste,
            strength, sweetness, and preferences.
          </p>

          <div className="hero-buttons">

            <Link to="/quiz">
              <Button>
                Find My Coffee
              </Button>
            </Link>

            <Link to="/coffees">
              <button className="browse-button">
                Browse Coffees
              </button>
            </Link>

          </div>

        </div>

      </section>


      {/* =========================
          COFFEE COLLECTION
      ========================= */}

      <section className="coffee-section">

        <div className="section-header">

          <span>
            Our Collection
          </span>

          <h2>
            Explore Our Coffees
          </h2>

          <p>
            Explore carefully selected coffees with
            different flavors, strengths, temperatures,
            and sweetness levels.
          </p>

        </div>


        <div className="coffee-grid">

          {featuredCoffees.map((coffee) => (
            <CoffeeCard
              key={coffee.id}
              coffee={coffee}
            />
          ))}

        </div>


        {/* =========================
            VIEW ALL BUTTON
        ========================= */}

        <div className="view-all-container">

          <Link to="/coffees">
            <button className="view-all-button">
              View All Coffees
            </button>
          </Link>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section className="how-it-works-section">

        <div className="section-header">

          <span>
            Simple & Personalized
          </span>

          <h2>
            How BrewMatch Works
          </h2>

          <p>
            Finding your next favorite coffee
            takes only a few simple steps.
          </p>

        </div>


        <div className="steps-container">

          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <h3>
              Answer Questions
            </h3>

            <p>
              Tell us about your preferred
              coffee strength, taste, milk,
              temperature, and sweetness.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <h3>
              Get Your Matches
            </h3>

            <p>
              Our recommendation system compares
              your preferences with our coffee
              collection.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <h3>
              Choose Your Coffee
            </h3>

            <p>
              Explore your top matches, view
              details, and order your favorite coffee.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          FINAL CTA
      ========================= */}

      <section className="home-cta-section">

        <div className="home-cta-content">

          <span>
            Your Perfect Cup Awaits
          </span>

          <h2>
            Ready to Find Your Coffee Match?
          </h2>

          <p>
            Take our quick quiz and discover
            coffees selected especially for your taste.
          </p>

          <Link to="/quiz">
            <Button>
              Take the Coffee Quiz
            </Button>
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Home;
