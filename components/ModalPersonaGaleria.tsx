"use client";

import { useEffect, useState } from "react";
import RostrosGallery from "./RostrosGallery";
import { cld } from "@/lib/cloudinary";

type Photo = { public_id: string; width?: number; height?: number };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  personaId: string;
};

export default function ModalPersonaGaleria({ isOpen, onClose, personaId }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrev = () => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // Cerrar modal al presionar ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset índice cuando abre/cierra
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm bg-black/20"
      onClick={onClose}
    >
      {/* Contenedor del modal */}
      <div
        className="relative z-10 w-full max-w-4xl flex items-center justify-center overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute -top-12 -right-4 z-20 text-5xl font-light text-white hover:text-gray-300 transition-colors"
          aria-label="Cerrar modal"
        >
          ×
        </button>

        {/* Flecha izquierda */}
        <button
          onClick={handlePrev}
          className="absolute left-0 z-20 text-6xl font-light text-white hover:text-gray-300 transition-colors select-none"
          aria-label="Anterior"
        >
          ‹
        </button>

        {/* Fondo escalonado con fotos desenfocadas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible z-0">
          {photos
            .map((p, idx) => ({ photo: p, idx, step: idx - activeIndex }))
            .filter(({ idx, step }) => idx !== activeIndex && Math.abs(step) <= 2)
            .sort((a, b) => Math.abs(b.step) - Math.abs(a.step))
            .map(({ photo, step }) => {
              const depth = Math.abs(step);
              const translateX = step * 250;
              const translateY = depth * 26;
              const scale = Math.max(0.78, 1 - depth * 0.06);
              const blur = Math.min(18, depth * 4);
              const zIndex = 20 - depth;

              return (
                <img
                  key={photo.public_id}
                  src={cld(photo.public_id, 800)}
                  alt=""
                  className="absolute h-auto w-[clamp(240px,24vw,430px)] select-none object-contain"
                  style={{
                    filter: `blur(${blur}px)`,
                    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                    zIndex,
                  }}
                />
              );
            })}
        </div>

        {/* Galería - carrusel grande */}
        <div className="relative z-10">
          {isLoading && (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center rounded-sm bg-white/35 backdrop-blur-sm"
              aria-hidden="true"
            >
              <div
                className="h-[clamp(350px,50vw,665px)] w-[clamp(260px,42vw,540px)] animate-pulse bg-white/70"
              />
            </div>
          )}
          <RostrosGallery
            personaId={personaId}
            mode="hero"
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
            photosProp={photos}
            onPhotosLoaded={setPhotos}
            onLoadingChange={setIsLoading}
          />
        </div>

        {/* Flecha derecha */}
        <button
          onClick={handleNext}
          className="absolute right-0 z-20 text-6xl font-light text-white hover:text-gray-300 transition-colors select-none"
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>
    </div>
  );
}
