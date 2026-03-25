import React from 'react';

const WeddingGallery = ({ photos }) => {
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No photos in this album yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <div 
          key={index} 
          className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <img 
            src={photo.url} 
            alt={`Wedding photo ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default WeddingGallery;