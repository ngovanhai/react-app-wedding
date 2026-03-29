'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AlbumForm({ album: initialAlbum, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialAlbum?.title || '',
    groomName: initialAlbum?.groomName || '',
    brideName: initialAlbum?.brideName || '',
    weddingDate: initialAlbum?.weddingDate
      ? new Date(initialAlbum.weddingDate).toISOString().split('T')[0]
      : '',
    venue: initialAlbum?.venue || '',
    coverPhotoUrl: initialAlbum?.coverPhotoUrl || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!formData.title.trim() || !formData.groomName.trim() || !formData.brideName.trim() || !formData.weddingDate) {
        throw new Error('Please fill in all required fields');
      }
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'An error occurred while saving the album');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {initialAlbum ? 'Edit Album' : 'Create New Album'}
      </h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Album Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Date *</label>
            <input type="date" name="weddingDate" value={formData.weddingDate} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Groom&apos;s Name *</label>
            <input type="text" name="groomName" value={formData.groomName} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bride&apos;s Name *</label>
            <input type="text" name="brideName" value={formData.brideName} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" required />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
          <input type="text" name="venue" value={formData.venue} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Photo URL</label>
          <input type="url" name="coverPhotoUrl" value={formData.coverPhotoUrl} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="https://example.com/cover.jpg" />
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-md hover:from-pink-600 hover:to-rose-700 disabled:opacity-50">
            {loading ? 'Saving...' : initialAlbum ? 'Update Album' : 'Create Album'}
          </button>
        </div>
      </form>
    </div>
  );
}
