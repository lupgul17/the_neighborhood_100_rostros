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
};

export default function RostrosGallery({
  personaId,
  mode = "hero",
  activeIndex,
  onActiveChange,
  photosProp,
  onPhotosLoaded,
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
      const res = await fetch(`/api/rostros/${personaId}`, { cache: "no-store" });
      const data = await res.json();
      if (cancelled) return;

      const list: Photo[] = data.photos ?? [];
      setPhotosLocal(list);
      onPhotosLoaded?.(list);

      if (activeIndex === undefined) setActiveLocal(0);
      onActiveChange?.(0);
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

  const goPrev = () => setActive(Math.max(active - 1, 0));
  const goNext = () => setActive(Math.min(active + 1, Math.max(photos.length - 1, 0)));

  /* ===============================
     THUMBS (carrusel)
     =============================== */
  if (mode === "thumbs") {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center gap-10">
          {/* Flecha izquierda */}
          <button
            onClick={goPrev}
            disabled={active === 0}
            className="text-[64px] leading-none font-light text-black disabled:opacity-20 select-none"
            aria-label="Anterior"
          >
            ‹
          </button>

          {/* Strip */}
          <div
            ref={stripRef}
            className="w-[1050px] overflow-x-auto no-scrollbar scroll-smooth"
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
                      "w-[165px] h-[165px] flex items-center justify-center",
                      idx !== 0 ? "-ml-6" : "",
                    ].join(" ")}
                  >
                      <img
                        src={cld(p.public_id, 1200)}
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

          {/* Flecha derecha */}
          <button
            onClick={goNext}
            disabled={active === photos.length - 1}
            className="text-[64px] leading-none font-light text-black disabled:opacity-20 select-none"
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
          src={cld(activePhoto.public_id, 3000)}
          alt=""
          width={activePhoto.width ?? 1400}
          height={activePhoto.height ?? 1800}
          className="h-[700px] w-auto object-contain select-none"
          priority
        />
      ) : (
        <div className="h-[700px] w-[700px]" />
      )}
    </div>
  );
}