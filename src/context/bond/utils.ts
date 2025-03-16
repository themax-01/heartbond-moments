
// Utility functions for bond operations

// Generate a random user ID since we're not implementing full auth
export const generateUserId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Generate a unique bond code
export const generateBondCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
