// Utility functions for the wedding photo album app

// Generate unique share code
const generateShareCode = () => {
  return Math.random().toString(36).substring(2, 10);
};

// Validate image file
const isValidImage = (mimetype) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  return allowedTypes.includes(mimetype.toLowerCase());
};

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags and special characters that could be harmful
  return input.replace(/<[^>]*>/g, '').trim();
};

module.exports = {
  generateShareCode,
  isValidImage,
  formatDate,
  sanitizeInput
};