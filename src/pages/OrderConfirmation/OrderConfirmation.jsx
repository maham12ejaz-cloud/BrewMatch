
import { Link } from 'react-router-dom';

import './OrderConfirmation.css';

import { getOrder } from '../../utils/storage';

function OrderConfirmation() {
  const order = getOrder();

  if (!order) {
    return (
      <main className="order-confirmation-page">

        <div className="no-order">

          <h1>No Recent Order</h1>

          <p>
            We couldn't find a recent order.
          </p>

          <Link to="/coffees">
            <button>
              Browse Coffees
            </button>
          </Link>

        </div>

      </main>
    );
  }


  return (
    <main className="order-confirmation-page">

      <div className="confirmation-card">

        {/* ========================= */}
        {/* Success Icon */}
        {/* ========================= */}

        <div className="confirmation-icon">
          ✓
        </div>


        {/* ========================= */}
        {/* Message */}
        {/* ========================= */}

        <span className="confirmation-label">
          Order Confirmed
        </span>

        <h1>
          Thank You, {order.customer.name}!
        </h1>

        <p className="confirmation-message">
          Your coffee order has been placed
          successfully.
        </p>


        {/* ========================= */}
        {/* Order Number */}
        {/* ========================= */}

        <div className="order-number">

          <span>
            Order Number
          </span>

          <strong>
            #{order.id}
          </strong>

        </div>


        {/* ========================= */}
        {/* Order Summary */}
        {/* ========================= */}

        <div className="confirmation-summary">

          <h2>
            Your Order
          </h2>

          {order.items.map((item) => (
            <div
              className="confirmation-item"
              key={item.id}
            >

              <div>

                <strong>
                  {item.name}
                </strong>

                <span>
                  Quantity: {item.quantity}
                </span>

              </div>

              <strong>
                ₨{item.price * item.quantity}
              </strong>

            </div>
          ))}


          <div className="confirmation-total">

            <span>
              Total
            </span>

            <strong>
              ₨{order.total}
            </strong>

          </div>

        </div>


        {/* ========================= */}
        {/* Delivery Information */}
        {/* ========================= */}

        <div className="delivery-information">

          <h2>
            Delivery Information
          </h2>

          <p>
            <strong>
              Name:
            </strong>{' '}
            {order.customer.name}
          </p>

          <p>
            <strong>
              Phone:
            </strong>{' '}
            {order.customer.phone}
          </p>

          <p>
            <strong>
              Address:
            </strong>{' '}
            {order.customer.address}
          </p>

        </div>


        {/* ========================= */}
        {/* Actions */}
        {/* ========================= */}

        <div className="confirmation-actions">

          <Link to="/coffees">
            <button className="shop-more-button">
              Continue Shopping
            </button>
          </Link>

          <Link to="/">
            <button className="home-button">
              Back to Home
            </button>
          </Link>

        </div>

      </div>

    </main>
  );
}

export default OrderConfirmation;
