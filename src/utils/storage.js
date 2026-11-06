// ===============================
// Get Cart
// ===============================

export function getCart() {
  const cart = localStorage.getItem('brewmatch-cart');

  return cart ? JSON.parse(cart) : [];
}


// ===============================
// Save Cart
// ===============================

export function saveCart(cart) {
  localStorage.setItem(
    'brewmatch-cart',
    JSON.stringify(cart)
  );
}


// ===============================
// Add Item to Cart
// ===============================

export function addToCart(coffee) {
  const cart = getCart();

  const existingItem = cart.find(
    (item) => item.id === coffee.id
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...coffee,
      quantity: 1
    });
  }

  saveCart(cart);
}


// ===============================
// Remove Item from Cart
// ===============================

export function removeFromCart(coffeeId) {
  const cart = getCart();

  const updatedCart = cart.filter(
    (item) => item.id !== coffeeId
  );

  saveCart(updatedCart);
}


// ===============================
// Update Cart Quantity
// ===============================

export function updateCartQuantity(coffeeId, quantity) {
  const cart = getCart();

  const updatedCart = cart.map((item) => {
    if (item.id === coffeeId) {
      return {
        ...item,
        quantity: quantity
      };
    }

    return item;
  });

  saveCart(updatedCart);
}


// ===============================
// Clear Cart
// ===============================

export function clearCart() {
  localStorage.removeItem('brewmatch-cart');
}


// ===============================
// Get Favorites
// ===============================

export function getFavorites() {
  const favorites = localStorage.getItem(
    'brewmatch-favorites'
  );

  return favorites ? JSON.parse(favorites) : [];
}


// ===============================
// Save Favorites
// ===============================

export function saveFavorites(favorites) {
  localStorage.setItem(
    'brewmatch-favorites',
    JSON.stringify(favorites)
  );
}


// ===============================
// Add to Favorites
// ===============================

export function addToFavorites(coffee) {
  const favorites = getFavorites();

  const alreadyFavorite = favorites.some(
    (item) => item.id === coffee.id
  );

  if (!alreadyFavorite) {
    favorites.push(coffee);

    saveFavorites(favorites);
  }
}


// ===============================
// Remove from Favorites
// ===============================

export function removeFromFavorites(coffeeId) {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter(
    (item) => item.id !== coffeeId
  );

  saveFavorites(updatedFavorites);
}

// ===============================
// Save Order
// ===============================

export function saveOrder(order) {
  localStorage.setItem(
    'brewmatch-order',
    JSON.stringify(order)
  );
}


// ===============================
// Get Latest Order
// ===============================

export function getOrder() {
  const order = localStorage.getItem(
    'brewmatch-order'
  );

  return order ? JSON.parse(order) : null;
}
