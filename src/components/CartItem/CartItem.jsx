import './CartItem.css';

function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove
}) {
  return (
    <div className="cart-item">

      {/* Coffee Image */}

      <div className="cart-item-image">
        <img
          src={item.image}
          alt={item.name}
        />
      </div>


      {/* Coffee Information */}

      <div className="cart-item-info">

        <h3>{item.name}</h3>

        <p>
          ₨{item.price} × {item.quantity}
        </p>

      </div>


      {/* Quantity Controls */}

      <div className="cart-item-quantity">

        <button
          onClick={() => onDecrease(item.id)}
        >
          −
        </button>

        <span>{item.quantity}</span>

        <button
          onClick={() => onIncrease(item.id)}
        >
          +
        </button>

      </div>


      {/* Total Price */}

      <div className="cart-item-total">
        ₨{item.price * item.quantity}
      </div>


      {/* Remove Button */}

      <button
        className="cart-item-remove"
        onClick={() => onRemove(item.id)}
      >
        Remove
      </button>

    </div>
  );
}

export default CartItem;