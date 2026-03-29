'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InfoFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    weddingDate: '',
    venue: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('weddingInfo', JSON.stringify(formData));
    router.push('/album/preview');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Wedding Details</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Groom&apos;s Name</label>
          <input
            type="text"
            name="groomName"
            value={formData.groomName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Enter groom's name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bride&apos;s Name</label>
          <input
            type="text"
            name="brideName"
            value={formData.brideName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Enter bride's name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Date</label>
          <input
            type="date"
            name="weddingDate"
            value={formData.weddingDate}
            onChange={handleChange}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Write a message for your guests..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
        >
          Create Album
        </button>
      </form>
    </div>
  );
}
