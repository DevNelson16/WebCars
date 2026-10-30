import { useState, type CSSProperties } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CarsImgProps {
  images: string[];
  name: string;
  onLoad?: () => void;
  style?: CSSProperties;
}

export function CarsImg({
  images,
  name,
  onLoad,
  style,
}: CarsImgProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Sem imagem disponível</span>
      </div>
    );
  }

  function previousImage(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    setCurrentIndex((previousIndex) =>
      previousIndex === 0 ? images.length - 1 : previousIndex - 1
    );
  }

  function nextImage(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    setCurrentIndex((previousIndex) =>
      previousIndex === images.length - 1 ? 0 : previousIndex + 1
    );
  }

  return (
    <div className="relative w-full h-56 overflow-hidden" style={style}>
      <img
        src={images[currentIndex]}
        alt={`${name} - fotografia ${currentIndex + 1}`}
        className="w-full h-full object-cover"
        onLoad={onLoad}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={previousImage}
            aria-label="Ver fotografia anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
          >
            <FiChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={nextImage}
            aria-label="Ver fotografia seguinte"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
          >
            <FiChevronRight size={24} />
          </button>

          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  )
}
