"use client";

import React from "react";
import {
  type AgentState,
  BarVisualizer,
  type TrackReference,
} from "@livekit/components-react";
import { cn } from "@/app/ulits/cn";

interface AgentTileProps {
  state: AgentState;
  audioTrack: TrackReference;
  className?: string;
}

export const AgentTile = ({ state, audioTrack, className }: AgentTileProps) => {
  return (
    <div
      className={cn(
        "flex h-screen w-full items-center justify-center ",
        className
      )}
    >
      <BarVisualizer
        state={state}
        trackRef={audioTrack}
        barCount={5}
        options={{ minHeight: 16 }}
        className="flex w-[500px] h-[250px] items-center justify-center gap-3 p-6"
      >
        <span
          className={cn([
            "bg-black min-h-[8px] w-8 rounded-full shadow-md",
            "origin-bottom transition-all duration-200 ease-linear",
            "data-[lk-highlighted=true]:bg-orange-500 data-[lk-muted=true]:bg-gray-400",
          ])}
        />
      </BarVisualizer>
    </div>
  );
};
