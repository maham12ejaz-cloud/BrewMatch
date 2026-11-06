
const API_BASE_URL = 'http://localhost:5000/api';


// ========================================
// GET ALL COFFEES
// ========================================

export const getCoffees = async () => {
    const response = await fetch(`${API_BASE_URL}/coffees`);

    if (!response.ok) {
        throw new Error('Failed to fetch coffees');
    }

    const data = await response.json();

    return data;
};

// GET SINGLE COFFEE
export const getCoffeeById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/coffees/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch coffee');
  }

  const data = await response.json();

  return data;
};

// =========================
// FAVORITES
// =========================

// GET USER FAVORITES
export const getFavorites = async (token) => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }

  const data = await response.json();

  return data;
};


// ADD COFFEE TO FAVORITES
export const addFavorite = async (coffeeId, token) => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      coffee_id: coffeeId
    })
  });

  if (!response.ok) {
    throw new Error('Failed to add favorite');
  }

  const data = await response.json();

  return data;
};


// REMOVE COFFEE FROM FAVORITES
export const removeFavorite = async (coffeeId, token) => {
  const response = await fetch(
    `${API_BASE_URL}/favorites/${coffeeId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to remove favorite');
  }

  const data = await response.json();

  return data;
};