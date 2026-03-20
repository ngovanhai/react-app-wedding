import React, { useState } from 'react';
import axios from 'axios';

const GuestBookForm = ({ albumId, onSubmit }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    message: '',
    photoUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Validate required fields
      if (!formData.guestName.trim() || !formData.message.trim()) {
        throw new Error('Please fill in all required fields');
      }
      
      await axios.post(`/api/albums/${albumId}/guests`, formData);
      setSuccess(true);
      onSubmit && onSubmit();
      
      // Reset form
      setFormData({
        guestName: '',
        message: '',
        photoUrl: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Leave a Message</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Thank you for your message! It has been added to the guestbook.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo URL (optional)
          </label>
          <input
            type="url"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="https://example.com/your-photo.jpg"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Message'}
        </button>
      </form>
    </div>
  );
};

export default GuestBookForm;