// Store an item in sessionStorage as a JSON string
const storeInSession = (key, value) => {
  return sessionStorage.setItem(key, JSON.stringify(value));
};

// Look up an item in sessionStorage and parse it as JSON
const lookInSession = (key) => {
  const value = sessionStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch {
    return value; // If parsing fails, just return the raw value (useful for strings)
  }
};

// Remove an item from sessionStorage by key
const removeFromSession = (key) => {
  return sessionStorage.removeItem(key);
};

// Clear all sessionStorage (used for logging out)
const logOutUser = () => {
  sessionStorage.clear();
};

export { storeInSession, lookInSession, removeFromSession, logOutUser };
