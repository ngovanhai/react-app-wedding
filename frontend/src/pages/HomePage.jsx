import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Create Your Wedding Photo Album</h1>
        <p className="text-lg text-gray-600 mb-8">
          Preserve your special moments with our beautiful wedding photo albums. 
          Share your love story with family and friends.
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href="/upload" 
            className="bg-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
          >
            Create New Album
          </a>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Easy Upload</h3>
          <p className="text-gray-600">Upload your photos with our simple drag-and-drop interface</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Beautiful Templates</h3>
          <p className="text-gray-600">Choose from elegant templates designed for weddings</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Share Memories</h3>
          <p className="text-gray-600">Share your album with loved ones via unique links</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;