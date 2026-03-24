'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[400px] bg-gray-200 rounded-xl flex items-center justify-center">
        <div className="text-gray-500">Aucune image disponible</div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full'}`}>
      {/* Main image */}
      <div className={`relative ${isFullscreen ? 'h-screen' : 'h-[400px] md:h-[500px]'} rounded-xl overflow-hidden`}>
        <img
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        
        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          aria-label={isFullscreen ? "Quitter le mode plein écran" : "Mode plein écran"}
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        
        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && !isFullscreen && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex 
                  ? 'border-black ring-2 ring-black' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              aria-label={`Voir l'image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Miniature ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Close fullscreen button */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 left-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          aria-label="Quitter le mode plein écran"
        >
          <Maximize2 className="w-5 h-5 rotate-45" />
        </button>
      )}
    </div>
  );
}