"use client";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-50/50 rounded-full blur-[120px] animate-pulse" />

      <div className="relative flex h-48 w-48 scale-75 items-center justify-center md:scale-100">
        <div className="absolute inset-0 rounded-full border border-dashed border-gray-200" />

        <div className="plane-orbit absolute inset-0">
          <div className="absolute top-[-12px] left-1/2 -translate-x-1/2">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 rotate-90 fill-current text-blue-500 drop-shadow-lg"
            >
              <path d="M21,16L21,14L13,9L13,3.5C13,2.17 11.83,1.1 10.5,1.1C9.17,1.1 8.1,2.17 8.1,3.5L8.1,9L0.1,14L0.1,16L8.1,13.5L8.1,19L6.1,20.5L6.1,22L10.5,21L15,22L15,20.5L13,19L13,13.5L21,16Z" />
            </svg>
          </div>
        </div>

        <div className="globe-rotate relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 shadow-2xl">
          <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current text-white/90">
            <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M11,19.93C7.05,19.44,4,16.08,4,12c0-0.35,0.03-0.69,0.08-1.02L9,15v1c0,1.1,0.9,2,2,2V19.93z M17.9,17.39C17.64,16.58,16.9,16,16,16h-1v-3c0-0.55-0.45-1-1-1H8v-2h2c0.55,0,1-0.45,1-1V7h2c1.1,0,2-0.9,2-2V4.59C17.05,5.81,19,8.66,19,12C19,14.01,18.59,15.91,17.9,17.39z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
