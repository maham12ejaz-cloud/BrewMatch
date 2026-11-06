
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Checkout.css';

import {
  getCart,
  clearCart
} from '../../utils/storage';

function Checkout() {
  const navigate = useNavigate();

  const [cart] = useState(() => getCart());

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );


  /* =========================
     Handle Input
  ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));

    setError('');
  };


  /* =========================
     Place Order
  ========================= */

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError(
          'Please login before placing an order.'
        );

        setLoading(false);

        return;
      }


      /* =========================
         Prepare Order Items
      ========================= */

      const orderItems = cart.map((item) => ({
        coffee_id: Number(item.id),
        quantity: Number(item.quantity)
      }));


      /* =========================
         Prepare API Data
      ========================= */

      const orderData = {
        customer_name: formData.name,
        customer_email:
          JSON.parse(
            localStorage.getItem('user')
          )?.email || '',
        customer_phone: formData.phone,
        delivery_address: formData.address,
        items: orderItems
      };


      /* =========================
         Send Order to Backend
      ========================= */

      const response = await fetch(
        'http://localhost:5000/api/orders/user',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(orderData)
        }
      );


      const data = await response.json();


      /* =========================
         Handle API Error
      ========================= */

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to place order.'
        );
      }


      /* =========================
         Order Successful
      ========================= */

      clearCart();

      navigate('/order-confirmation', {
        state: {
          order: data.order
        }
      });

    } catch (error) {
      console.error(
        'Place order error:',
        error
      );

      setError(
        error.message ||
        'Unable to place order. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };


  /* =========================
     Empty Cart
  ========================= */

  if (cart.length === 0) {
    return (
      <main className="checkout-page">

        <div className="empty-checkout">

          <h1>Your Cart is Empty</h1>

          <p>
            Please add some coffee before
            proceeding to checkout.
          </p>

          <button
            onClick={() => navigate('/coffees')}
          >
            Browse Coffees
          </button>

        </div>

      </main>
    );
  }


  return (
    <main className="checkout-page">

      <div className="checkout-container">

        {/* =========================
            Page Header
        ========================= */}

        <div className="checkout-header">

          <span>Almost There</span>

          <h1>Checkout</h1>

          <p>
            Enter your delivery details and
            place your coffee order.
          </p>

        </div>


        {/* =========================
            Back to Cart
        ========================= */}

        <button
          type="button"
          className="back-to-cart-button"
          onClick={() => navigate('/cart')}
        >
          ← Back to Cart
        </button>


        <div className="checkout-layout">

          {/* =========================
              Customer Form
          ========================= */}

          <form
            className="checkout-form"
            onSubmit={handlePlaceOrder}
          >

            <h2>
              Delivery Information
            </h2>


            {/* Error Message */}

            {error && (
              <div className="checkout-error">
                {error}
              </div>
            )}


            {/* Name */}

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

            </div>


            {/* Phone */}

            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03XX-XXXXXXX"
                required
              />

            </div>


            {/* Address */}

            <div className="form-group">

              <label htmlFor="address">
                Delivery Address
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete delivery address"
                rows="5"
                required
              />

            </div>


            {/* Place Order */}

            <button
              type="submit"
              className="place-order-button"
              disabled={loading}
            >
              {loading
                ? 'Placing Order...'
                : 'Place Order'}
            </button>

          </form>


          {/* =========================
              Order Summary
          ========================= */}

          <div className="checkout-summary">

            <h2>
              Order Summary
            </h2>


            <div className="checkout-items">

              {cart.map((item) => (

                <div
                  className="checkout-item"
                  key={item.id}
                >

                  <div className="checkout-item-image">

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                  </div>


                  <div className="checkout-item-info">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      ₨{item.price} × {item.quantity}
                    </p>

                  </div>


                  <strong>
                    ₨{Number(item.price) * Number(item.quantity)}
                  </strong>

                </div>

              ))}

            </div>


            <div className="checkout-total">

              <span>
                Total
              </span>

              <strong>
                ₨{totalPrice}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Checkout;
