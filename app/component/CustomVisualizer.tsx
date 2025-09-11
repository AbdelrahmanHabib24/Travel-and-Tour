// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { type TrackReference } from "@livekit/components-react";
// import { cn } from "@/app/ulits/cn";

// interface CustomVisualizerProps {
//   audioTrack: TrackReference | null;
//   barCount?: number;
//   className?: string;
// }

// export const CustomVisualizer: React.FC<CustomVisualizerProps> = ({
//   audioTrack,
//   barCount = 10,
//   className,
// }) => {
//   const [levels, setLevels] = useState<number[]>(Array(barCount).fill(5));
//   const animationRef = useRef<number | null>(null);

//   useEffect(() => {
//     if (!audioTrack?.publication?.track) return;

//     const ctx = new AudioContext();
//     const source = ctx.createMediaStreamSource(
//       new MediaStream([audioTrack.publication.track.mediaStreamTrack!])
//     );

//     const analyser = ctx.createAnalyser();
//     analyser.fftSize = 64; // resolution
//     source.connect(analyser);

//     const dataArray = new Uint8Array(analyser.frequencyBinCount);

//     const update = () => {
//       analyser.getByteFrequencyData(dataArray);

//       // خُد أول N قيم عشان تعمل الـ bars
//       const step = Math.floor(dataArray.length / barCount);
//       const newLevels = Array.from(
//         { length: barCount },
//         (_, i) => Math.max(5, dataArray[i * step] / 4) // scale
//       );

//       setLevels(newLevels);
//       animationRef.current = requestAnimationFrame(update);
//     };

//     update();

//     return () => {
//       cancelAnimationFrame(animationRef.current!);
//       analyser.disconnect();
//       source.disconnect();
//     };
//   }, [audioTrack, barCount]);

//   return (
//     <div
//       className={cn(
//         "flex items-end justify-center gap-1 w-40 h-24 bg-gray-100 rounded-lg p-2",
//         className
//       )}
//     >
//       {levels.map((level, i) => (
//         <div
//           key={i}
//           style={{ height: `${level}px` }}
//           className="w-2 bg-blue-500 rounded transition-all duration-75"
//         />
//       ))}
//     </div>
//   );
// };
