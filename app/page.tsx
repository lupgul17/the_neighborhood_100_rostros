import Image from "next/image";
import { cldUrl } from "@/lib/cloudinary";

export default function Home() {
  const heroPublicId =
    "home/neighborhood/rostros/prueba/TU_ARCHIVO.jpg"; // <-- cambia el nombre real

  const logoPublicId =
    "home/neighborhood/logos/TU_LOGO.png"; // <-- cambia el nombre real

  return (
    <main className="min-h-screen bg-white text-black px-10 py-12">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col justify-center max-w-md">
          <div className="relative w-40 h-12 mb-6">
            <Image
              src={cldUrl(logoPublicId, { w: 500 })}
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight">
            THE NEIGHBORHOOD
          </h1>

          <p className="uppercase text-sm tracking-widest text-gray-500 mt-4">
            Hello World · Personal Archive
          </p>

          <p className="text-gray-600 text-sm mt-6">
            100 rostros. 100 vidas. 100 historias.
          </p>
        </div>

        <div className="relative w-full h-[520px] bg-gray-100">
          <Image
            src={cldUrl(heroPublicId, { w: 1600 })}
            alt="Portrait"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>
    </main>
  );
}