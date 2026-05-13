export default function Home() {
  return (
    <main className="min-h-screen bg-black text-yellow-400 flex flex-col items-center justify-center p-8">
      
      <img
        src="/logo.png"
        alt="Rivet Logo"
        className="w-[500px] max-w-full"
      />

      <p className="text-2xl mt-6 text-center">
        0.0.112264 UNDER DEV.
      </p>

      <div className="flex gap-4 mt-8">
        <button className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold">
          Join Discord
        </button>

        <button className="border-4 border-yellow-400 px-6 py-3 rounded-xl font-bold">
          Play Alpha
        </button>
      </div>

    </main>
  );
}