"use client";

import { useState } from "react";
import Image from "next/image";
import RostrosGallery from "@/components/RostrosGallery";
import { cld } from "@/lib/cloudinary";

type Photo = { public_id: string; width?: number; height?: number };

export default function Home() {
  const logoTitle = "logo_xrabfd";
  const logo100 = "100_rxoq3w";

  const [activeIndex, setActiveIndex] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);

  return (
    <main className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* CANVAS */}
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-12 lg:px-16 xl:px-[90px] pt-8 sm:pt-12 lg:pt-16 xl:pt-[60px] flex-1">
        {/* "Poster stage": misma altura visual para izquierda y derecha */}
      <div className="flex justify-center">
  <section className="grid grid-cols-1 md:grid-cols-[minmax(260px,475px)_auto] gap-x-4 sm:gap-x-8 lg:gap-x-12 xl:gap-x-[60px] items-stretch w-full md:w-fit">
          {/* IZQUIERDA (NO pegada a esquina) */}
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

          {/* DERECHA (HERO) */}
          <div className="flex justify-center md:justify-start items-start h-full w-full md:w-auto">
            <RostrosGallery
              personaId="all"
              mode="hero"
              activeIndex={activeIndex}
              onActiveChange={setActiveIndex}
              onPhotosLoaded={setPhotos}
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
    </main>
  );
}