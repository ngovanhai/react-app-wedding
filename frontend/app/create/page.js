'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';


export default function CreateAlbumPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    weddingDate: '',
    venue: '',
    title: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const template = localStorage.getItem('selectedTemplate') || 'template1';
      const token = localStorage.getItem('token');

      const albumData = {
        ...formData,
        title: formData.title || `${formData.groomName} & ${formData.brideName}`,
        template,
      };

      const result = await api.createInvitation(albumData);

      const shareCode = result.data?.shareCode;

      // Store info for later use and redirect to album view
      localStorage.setItem('weddingInfo', JSON.stringify(formData));
      router.push(shareCode ? `/album/${shareCode}` : '/');
    } catch (err) {
      setError(err.message || 'Failed to create album. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Wedding Details</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Album Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="e.g. Our Wedding 2024 (auto-generated if left blank)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Groom&apos;s Name *</label>
          <input
            type="text"
            name="groomName"
            value={formData.groomName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Enter groom's name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bride&apos;s Name *</label>
          <input
            type="text"
            name="brideName"
            value={formData.brideName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Enter bride's name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Date *</label>
          <input
            type="date"
            name="weddingDate"
            value={formData.weddingDate}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Enter wedding venue"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating Album...' : 'Create Album'}
        </button>
      </form>
    </div>
  );
}
