"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import RostrosGallery, { preloadPersonaGallery } from "@/components/RostrosGallery";
import ModalPersonaGaleria from "@/components/ModalPersonaGaleria";
import { cld } from "@/lib/cloudinary";
import personasData from "@/data/persona.json";
type Photo = { public_id: string; width?: number; height?: number };

type Persona = {
  id: string;
  nombre: string;
  fecha_nacimiento: string;
  profesion: string;
  descripcion: string;
};

export default function Home() {
  
  const logoTitle = "logo_xrabfd";
  const logo100 = "100_rxoq3w";

  const [activeIndex, setActiveIndex] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const personaActivaId = photos[activeIndex]?.public_id?.split("_").slice(-2, -1)[0];
  const personaActiva: Persona | undefined =
    personasData.find((p) => p.id === personaActivaId);

  useEffect(() => {
    preloadPersonaGallery(personaActivaId).catch(() => {
      // Ignore preloading failures; the modal still loads on demand.
    });
  }, [personaActivaId]);

  return (
    <main className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* CANVAS */}
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-12 lg:px-16 xl:px-[90px] pt-8 sm:pt-12 lg:pt-16 xl:pt-[60px] flex-1">
        {/* "Poster stage": misma altura visual para izquierda y derecha */}
      <div className="flex justify-center">
  <section className="grid grid-cols-1 md:grid-cols-[minmax(260px,475px)_auto] gap-x-4 sm:gap-x-8 lg:gap-x-12 xl:gap-x-[60px] items-stretch w-full md:w-fit">
          {/* IZQUIERDA (NO pegada a esquina) */}
          {personaActivaId === '000' || personaActiva === undefined ? (
            <div className="pt-8 sm:pt-16 lg:pt-20 xl:pt-[120px] h-full w-full flex justify-center md:justify-start">
            <div className="w-full md:w-auto">
              <Image
                src={cld(logoTitle, 1200)}
                alt="The Neighborhood"
                width={1200}
                height={450}
                className="w-full h-auto object-contain"
                priority
              />

              {/* Texto centrado como referencia */}
              <div className="mt-6 sm:mt-10 lg:mt-14 xl:mt-[85px] text-center">
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-[40px] font-bold tracking-[0.02em] text-neutral-300 leading-[1.2]">
                  HELLO WORLD;
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-[40px] font-bold tracking-[-0.02em] text-neutral-400 leading-[0.95]">
                  PERSONAL
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-[40px] font-bold tracking-[-0.02em] text-neutral-500 leading-[0.95]">
                  ARCHIVE
                </p>
              </div>

              {/* Logo 100... (ES logo, no texto) */}
              <div className="mt-4 sm:mt-8 lg:mt-10 xl:mt-[52px] flex justify-center text-neutral-500">
                <Image
                  src={cld(logo100, 700)}
                  alt="100 rostros..."
                  width={900}
                  height={320}
                  className="h-auto object-contain grayscale opacity-50"
                  style={{ width: "clamp(100px, 25vw, 260px)" }}
                  priority={false}
                />
              </div>
            </div>
          </div>

          ):(
          <div className="pt-8 sm:pt-16 lg:pt-20 xl:pt-[120px] h-full w-full flex justify-center md:justify-start">
            <div className="w-full md:w-auto">
              <div className="mb-6 sm:mb-8 lg:mb-10">
                <Image
                  src={cld(logoTitle, 1200)}
                  alt="The Neighborhood"
                  width={1000}
                  height={350}
                  className="h-auto object-contain"
                  style={{ width: "clamp(120px, 25vw, 180px)" }}
                  priority
                />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-bold tracking-[0.02em] text-neutral-300 leading-[1.2] mb-4">
                {personaActiva?.nombre || "Nombre no disponible"}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg xl:text-[22px] font-medium tracking-[0.01em] text-neutral-400 leading-relaxed mb-2">
                {personaActiva
                  ? `Nacido el ${new Date(
                      personaActiva.fecha_nacimiento
                    ).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}, ${personaActiva.profesion}`
                  : "Información no disponible"}
              </p>
              <p className="text-base sm:text-lg lg:text-xl xl:text-[22px] font-medium tracking-[0.01em] text-neutral-500 leading-relaxed">
                {personaActiva?.descripcion || "Descripción no disponible"}
              </p>
            </div>
            </div>

          )}

          {/* DERECHA (HERO) */}
          <div className="flex justify-center md:justify-start items-start h-full w-full md:w-auto">
            <RostrosGallery
              personaId="all"
              mode="hero"
              activeIndex={activeIndex}
              onActiveChange={setActiveIndex}
              onPhotosLoaded={setPhotos}
              onPhotoClick={() => setShowModal(true)}
            />
          </div>
        </section>
      </div>
      </div>

      {/* CARRUSEL (NO flotante, centrado al viewport) */}
      <div className="w-full pb-4 sm:pb-6 lg:pb-8 xl:pb-[38px]">
        <RostrosGallery
          personaId="all"
          mode="thumbs"
          activeIndex={activeIndex}
          onActiveChange={setActiveIndex}
          photosProp={photos}
        />
      </div>

      {/* Modal */}
      <ModalPersonaGaleria
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        personaId={personaActivaId}
      />
    </main>
  );
}
