'use client';

import { useParams } from 'next/navigation';
import { useAlbum } from '@/hooks/useAlbum';

export default function AlbumViewPage() {
  const { shareCode } = useParams();
  const { album, loading, error } = useAlbum(shareCode);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Loading album...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">⚠️ {error}</p>
          <p className="text-gray-400 text-sm">Please check the share link and try again.</p>
        </div>
      </div>
    );
  }

  if (!album) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-pink-600 mb-2">
        {album.groomName} &amp; {album.brideName}
      </h1>
      <p className="text-center text-gray-500 mb-8">
        {album.weddingDate
          ? new Date(album.weddingDate).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : ''}
        {album.venue ? ` • ${album.venue}` : ''}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {album.photos?.map((photo, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow">
            <img
              src={photo.url || photo}
              alt={`Wedding photo ${index + 1}`}
              className="w-full h-48 object-cover hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </div>

      {(!album.photos || album.photos.length === 0) && (
        <p className="text-center text-gray-400 mt-12">No photos in this album yet.</p>
      )}
    </div>
  );
}
