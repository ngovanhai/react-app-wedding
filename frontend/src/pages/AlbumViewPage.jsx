import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AlbumViewPage = () => {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionType, setTransitionType] = useState('fade'); // fade, slide, zoom

  // Mock data - in real app this would come from API
  useEffect(() => {
    // Simulate fetching album photos
    const mockPhotos = [
      { id: 1, url: '/placeholder1.jpg', caption: 'Ceremony' },
      { id: 2, url: '/placeholder2.jpg', caption: 'First Dance' },
      { id: 3, url: '/placeholder3.jpg', caption: 'Cake Cutting' },
      { id: 4, url: '/placeholder4.jpg', caption: 'Family Photo' },
    ];
    setPhotos(mockPhotos);
  }, []);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentPhoto = photos[currentIndex];

  // Animation variants based on transition type
  const getVariants = () => {
    switch (transitionType) {
      case 'slide':
        return {
          initial: { x: '100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-100%', opacity: 0 }
        };
      case 'zoom':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };

  const variants = getVariants();

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading album...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Wedding Album</h1>
          <div className="flex gap-4">
            <select 
              value={transitionType}
              onChange={(e) => setTransitionType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
              <option value="zoom">Zoom</option>
            </select>
            <button 
              onClick={() => window.history.back()}
              className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700 text-sm"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Photo Viewer */}
      <div className="container mx-auto p-4 h-[calc(100vh-120px)] flex flex-col">
        <div className="flex-1 relative overflow-hidden rounded-lg bg-black">
          <AnimatePresence mode="wait">
            {currentPhoto && (
              <motion.img
                key={currentIndex}
                src={currentPhoto.url}
                alt={currentPhoto.caption}
                className="w-full h-full object-contain"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            aria-label="Previous photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            aria-label="Next photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Photo Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
        
        {/* Thumbnail Strip */}
        <div className="mt-4 flex overflow-x-auto gap-2 pb-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                index === currentIndex ? 'border-pink-500' : 'border-gray-300'
              }`}
            >
              <img 
                src={photo.url} 
                alt={`Thumbnail ${index}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumViewPage;