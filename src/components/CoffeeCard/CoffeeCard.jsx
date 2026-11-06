import { Link } from 'react-router-dom';
import './CoffeeCard.css';

import Button from '../Button/Button';

function CoffeeCard({ coffee }) {
  return (
    <div className="coffee-card">

      <div className="coffee-card-image">
        <img
          src={coffee.image}
          alt={coffee.name}
        />
      </div>

      <div className="coffee-card-content">

        <h3>{coffee.name}</h3>

        <p className="coffee-description">
          {coffee.description}
        </p>

        <div className="coffee-card-info">
          <span>{coffee.strength}</span>
          <span>₨{coffee.price}</span>
        </div>

        <Link to={`/coffee/${coffee.id}`}>
          <Button>
            View Details
          </Button>
        </Link>

      </div>

    </div>
  );
}

export default CoffeeCard;