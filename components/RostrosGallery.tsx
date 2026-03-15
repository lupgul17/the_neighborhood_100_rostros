"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cld } from "@/lib/cloudinary";

type Photo = {
  public_id: string;
  width?: number;
  height?: number;
};

type Mode = "hero" | "thumbs";

type Props = {
  personaId: string;
  mode?: Mode;

  activeIndex?: number;
  onActiveChange?: (idx: number) => void;

  photosProp?: Photo[];
  onPhotosLoaded?: (photos: Photo[]) => void;
  onPhotoClick?: () => void;
  onLoadingChange?: (isLoading: boolean) => void;
};

const photoCache = new Map<string, Photo[]>();

async function loadPhotos(personaId: string) {
  const cached = photoCache.get(personaId);
  if (cached) return cached;

  const res = await fetch(`/api/rostros/${personaId}`);
  const data = await res.json();
  const list: Photo[] = data.photos ?? [];
  photoCache.set(personaId, list);
  return list;
}

function preloadImage(src: string) {
  if (typeof window === "undefined") return;
  const img = new window.Image();
  img.src = src;
}

function preloadPhotoSet(photos: Photo[], widths: number[]) {
  for (const photo of photos) {
    for (const width of widths) {
      preloadImage(cld(photo.public_id, width));
    }
  }
}

export async function preloadPersonaGallery(personaId?: string) {
  if (!personaId) return [];

  const list = await loadPhotos(personaId);
  const firstPhoto = list[0]?.public_id;
  if (firstPhoto) preloadImage(cld(firstPhoto, 900));
  return list;
}

export default function RostrosGallery({
  personaId,
  mode = "hero",
  activeIndex,
  onActiveChange,
  photosProp,
  onPhotosLoaded,
  onPhotoClick,
  onLoadingChange,
}: Props) {
  const [photosLocal, setPhotosLocal] = useState<Photo[]>([]);
  const [activeLocal, setActiveLocal] = useState(0);

  const photos = photosProp ?? photosLocal;

  const active = activeIndex ?? activeLocal;
  const setActive = (idx: number) => {
    onActiveChange?.(idx);
    if (activeIndex === undefined) setActiveLocal(idx);
  };

  const activePhoto = photos[active];

  // refs para centrar seleccionado
  const stripRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (mode === "thumbs") return;

    let cancelled = false;

    async function load() {
      onLoadingChange?.(true);
      try {
        const list = await loadPhotos(personaId);
        if (cancelled) return;

        setPhotosLocal(list);
        onPhotosLoaded?.(list);

        if (activeIndex === undefined) setActiveLocal(0);
        onActiveChange?.(0);
      } finally {
        if (!cancelled) onLoadingChange?.(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaId, mode]);

  // ✅ centra el seleccionado en el carrusel
  useEffect(() => {
    if (mode !== "thumbs") return;
    const el = itemRefs.current[active];
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active, mode]);

  const goPrev = () => {
    if (photos.length === 0) return;
    setActive(active === 0 ? photos.length - 1 : active - 1);
  };
  const goNext = () => {
    if (photos.length === 0) return;
    setActive(active === photos.length - 1 ? 0 : active + 1);
  };

  useEffect(() => {
    if (photos.length === 0) return;

    if (mode === "hero") {
      const heroCandidates = photos.slice(active, active + 3);
      preloadPhotoSet(heroCandidates, [900]);
      return;
    }

    const initialThumbs = photos.slice(0, 8);
    preloadPhotoSet(initialThumbs, [200]);
  }, [active, mode, photos]);

  /* ===============================
     THUMBS (carrusel)
     =============================== */
  if (mode === "thumbs") {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center gap-2 md:gap-10 w-full md:w-auto">
          {/* Flecha izquierda - solo desktop */}
          <button
            onClick={goPrev}
            className="hidden md:block text-[64px] leading-none font-light text-black disabled:opacity-20 select-none flex-shrink-0"
            aria-label="Anterior"
          >
            ‹
          </button>

          {/* Strip */}
          <div
            ref={stripRef}
            className="overflow-x-auto no-scrollbar scroll-smooth flex-1"
            style={{ width: "clamp(300px, 90vw, 1250px)" }}
          >
            {/* menos espacio entre thumbs */}
            <div className="flex items-center gap-0 px-1 py-1">
              {photos.map((p, idx) => {
                const isActive = idx === active;

                return (
                  <button
                    key={p.public_id}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    onClick={() => setActive(idx)}
                    aria-label={`Ver foto ${idx + 1}`}
                    className="p-0"
                    style={{ scrollSnapAlign: "center" }}
                  >
                    {/* ✅ thumbs más grandes */}
                    <div
                    className={[
                      "flex items-center justify-center flex-shrink-0",
                      idx !== 0 ? "-ml-6" : "",
                    ].join(" ")}
                    style={{
                      width: "clamp(100px, 15vw, 157px)",
                      height: "clamp(100px, 15vw, 157px)"
                    }}
                  >
                      <img
                        src={cld(p.public_id, 200)}
                        alt=""
                        draggable={false}
                        className={[
                          "max-h-full max-w-full object-contain select-none",
                          // ✅ opacidad solo en seleccionada (como pediste)
                          isActive ? "opacity-100" : "opacity-45",
                        ].join(" ")}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flecha derecha - solo desktop */}
          <button
            onClick={goNext}
            className="hidden md:block text-[64px] leading-none font-light text-black disabled:opacity-20 select-none flex-shrink-0"
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>
    );
  }

  /* ===============================
     HERO
     =============================== */
  return (
    <div className="flex justify-end items-start pt-[10px]">
      {activePhoto ? (
        <Image
          key={activePhoto.public_id}
          src={cld(activePhoto.public_id, 900)}
          alt=""
          width={activePhoto.width ?? 1400}
          height={activePhoto.height ?? 1800}
          className="w-auto object-contain select-none cursor-pointer"
          style={{ height: "clamp(350px, 50vw, 665px)" }}
          priority
          onClick={onPhotoClick}
        />
      ) : (
        <div style={{ height: "clamp(350px, 50vw, 665px)", width: "clamp(350px, 50vw, 665px)" }} />
      )}
    </div>
  );
}
