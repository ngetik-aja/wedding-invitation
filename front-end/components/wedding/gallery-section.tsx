"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

interface GallerySectionProps {
  images: {
    url: string;
    caption?: string;
  }[];
}

export function GallerySection({ images }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Our Moments
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Photo Gallery
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => openLightbox(index)}
              className="aspect-square overflow-hidden rounded-lg bg-muted shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              {image.url ? (
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.caption || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {selectedIndex !== null && (
          <div className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4">
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-background hover:text-background/80 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-4 text-background hover:text-background/80 transition-colors"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="absolute right-4 text-background hover:text-background/80 transition-colors"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <div className="max-w-4xl max-h-[80vh]">
              <img
                src={images[selectedIndex].url || "/placeholder.svg"}
                alt={images[selectedIndex].caption || `Gallery image ${selectedIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              {images[selectedIndex].caption && (
                <p className="text-center text-background mt-4 text-lg">
                  {images[selectedIndex].caption}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
