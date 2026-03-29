'use client';

import { useState, useEffect } from 'react';
import AlbumCard from './AlbumCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AlbumList() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/albums`);
      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      setError('Failed to load albums. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (albumId) => {
    setAlbumToDelete(albumId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${API_URL}/api/albums/${albumToDelete}`, { method: 'DELETE' });
      setAlbums(albums.filter((a) => a._id !== albumToDelete));
    } catch {
      setError('Failed to delete album. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setAlbumToDelete(null);
    }
  };

  const handleViewClick = (album) => {
    window.open(`/album/${album.shareCode}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Wedding Albums</h1>
        <a
          href="/upload"
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-md hover:from-pink-600 hover:to-rose-700"
        >
          Create New Album
        </a>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No albums created yet.</p>
          <a href="/upload" className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-md hover:from-pink-600 hover:to-rose-700">
            Create Your First Album
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <AlbumCard key={album._id} album={album} onDelete={handleDeleteClick} onView={handleViewClick} />
          ))}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this album? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => { setShowDeleteModal(false); setAlbumToDelete(null); }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
