// app/loading.tsx
"use client";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-[3px] border-orange-200 rounded-full animate-[spin_1.2s_linear_infinite]"></div>

        <div className="absolute w-10 h-10 border-[3px] border-t-orange-500 border-b-orange-500 border-transparent rounded-full animate-[spin_0.8s_linear_infinite_reverse]"></div>

        <div className="absolute w-3 h-3 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full shadow-md shadow-orange-200 animate-pulse"></div>
      </div>
    </div>
  );
}
