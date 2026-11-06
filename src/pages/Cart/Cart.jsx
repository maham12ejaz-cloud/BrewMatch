import { useState } from 'react';
import { Link } from 'react-router-dom';

import './Cart.css';

import CartItem from '../../components/CartItem/CartItem';

import {
  getCart,
  removeFromCart,
  updateCartQuantity
} from '../../utils/storage';

function Cart() {
  const [cart, setCart] = useState(() => getCart());

  /* ========================= */
  /* Increase Quantity */
  /* ========================= */

  const handleIncrease = (coffeeId) => {
    const item = cart.find(
      (item) => item.id === coffeeId
    );

    if (!item) {
      return;
    }

    const newQuantity = item.quantity + 1;

    updateCartQuantity(
      coffeeId,
      newQuantity
    );

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === coffeeId
          ? {
              ...item,
              quantity: newQuantity
            }
          : item
      )
    );
  };

  /* ========================= */
  /* Decrease Quantity */
  /* ========================= */

  const handleDecrease = (coffeeId) => {
    const item = cart.find(
      (item) => item.id === coffeeId
    );

    if (!item) {
      return;
    }

    if (item.quantity === 1) {
      handleRemove(coffeeId);
      return;
    }

    const newQuantity = item.quantity - 1;

    updateCartQuantity(
      coffeeId,
      newQuantity
    );

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === coffeeId
          ? {
              ...item,
              quantity: newQuantity
            }
          : item
      )
    );
  };

  /* ========================= */
  /* Remove Item */
  /* ========================= */

  const handleRemove = (coffeeId) => {
    removeFromCart(coffeeId);

    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== coffeeId
      )
    );
  };

  /* ========================= */
  /* Calculate Total */
  /* ========================= */

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  /* ========================= */
  /* Empty Cart */
  /* ========================= */

  if (cart.length === 0) {
    return (
      <main className="cart-page">

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h1>Your Cart is Empty</h1>

          <p>
            Looks like you haven't added any
            coffee yet.
          </p>

          <Link to="/coffees">
            <button className="browse-coffees-button">
              Browse Coffees
            </button>
          </Link>

        </div>

      </main>
    );
  }

  /* ========================= */
  /* Cart Page */
  /* ========================= */

  return (
    <main className="cart-page">

      <div className="cart-container">

        {/* Page Header */}

        <div className="cart-header">

          <span>Your Selection</span>

          <h1>Your Coffee Cart 🛒</h1>

          <p>
            Review your selected coffees before
            placing your order.
          </p>

        </div>


        {/* Cart Items */}

        <div className="cart-items">

          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />
          ))}

        </div>


        {/* Cart Summary */}

        <div className="cart-summary">

          <div className="cart-summary-info">

            <span>Total</span>

            <strong>
              ₨{totalPrice}
            </strong>

          </div>


          <div className="cart-summary-actions">

            <Link to="/coffees">
              <button className="continue-shopping-button">
                Continue Shopping
              </button>
            </Link>

            <Link to="/checkout">
              <button className="checkout-button">
                Proceed to Checkout
              </button>
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Cart;