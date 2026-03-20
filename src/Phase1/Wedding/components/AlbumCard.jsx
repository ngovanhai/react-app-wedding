import React from 'react';

const AlbumCard = ({ album, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {album.coverPhotoUrl ? (
        <img 
          src={album.coverPhotoUrl} 
          alt={album.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
          <span className="text-gray-400 text-lg">No Cover Photo</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{album.title}</h3>
        <p className="text-sm text-gray-600 mb-1">
          {album.brideName} & {album.groomName}
        </p>
        <p className="text-sm text-gray-600 mb-3">
          {new Date(album.weddingDate).toLocaleDateString('vi-VN')}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Code: {album.shareCode}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => onView(album)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View
            </button>
            <button
              onClick={() => onDelete(album._id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;