export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black px-10 py-12">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Texto */}
        <div className="flex flex-col justify-center max-w-md">
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

        {/* Placeholder imagen */}
        <div className="bg-gray-100 h-[500px]" />
      </section>
    </main>
  );
}