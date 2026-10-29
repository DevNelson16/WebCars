import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CarsImgProps {
  images: string[];
  name: string;
}

export function CarsImg({ images, name }: CarsImgProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Sem imagem disponível</span>
      </div>
    );
  }

  function previousImage() {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }

  function nextImage() {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }

  return (
    <div className="relative w-full">
      <img
        src={images[currentIndex]}
        alt={`${name} - fotografia ${currentIndex + 1}`}
        className="w-full h-56 object-cover"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={previousImage}
            aria-label="Fotografia anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2"
          >
            <FiChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={nextImage}
            aria-label="Fotografia seguinte"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2"
          >
            <FiChevronRight size={24} />
          </button>

          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
            {currentIndex + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
}
