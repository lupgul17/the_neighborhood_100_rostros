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
    <main className="min-h-screen bg-white flex flex-col">
      {/* CANVAS */}
      <div className="mx-auto w-full max-w-[1500px] px-[90px] pt-[60px] flex-1">
        {/* “Poster stage”: misma altura visual para izquierda y derecha */}
      <div className="flex justify-center">
  <section className="grid grid-cols-[500px_auto] gap-x-[60px] items-stretch">
          {/* IZQUIERDA (NO pegada a esquina) */}
          <div className="pt-[120px] h-full">
            <div className="w-[500px]">
              <Image
                src={cld(logoTitle, 1200)}
                alt="The Neighborhood"
                width={1200}
                height={450}
                className="w-[500px] h-auto object-contain"
                priority
              />

              {/* Texto centrado como referencia */}
              <div className="mt-[85px] text-center">
                <p className="text-[40px] font-bold tracking-[0.02em] text-neutral-300 leading-[1.2]">
                  HELLO WORLD;
                </p>
                <p className="text-[40px] font-bold tracking-[-0.02em] text-neutral-400 leading-[0.95]">
                  PERSONAL
                </p>
                <p className=" text-[40px] font-bold tracking-[-0.02em] text-neutral-500 leading-[0.95]">
                  ARCHIVE
                </p>
              </div>

              {/* Logo 100... (ES logo, no texto) */}
              <div className="mt-[52px] flex justify-center text-neutral-500">
                <Image
                  src={cld(logo100, 700)}
                  alt="100 rostros..."
                  width={900}
                  height={320}
                  className="w-[260px] h-auto object-contain grayscale opacity-50"
                  priority={false}
                />
              </div>
            </div>
          </div>

          {/* DERECHA (HERO) */}
          <div className="flex justify-start items-start h-full">
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
      <div className="w-full pb-[38px]">
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