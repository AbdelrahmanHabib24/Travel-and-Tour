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
        options={{ minHeight: 20 }} 
        className="flex w-[600px] h-[300px] items-center justify-center gap-2   p-6"
      >
        <span
          className={cn([
            "bg-blue-500 min-h-[8px] w-8 rounded-full",
            "origin-bottom transition-all duration-150 ease-linear",
            "data-[lk-highlighted=true]:bg-green-500 data-[lk-muted=true]:bg-gray-300",
          ])}
        />
      </BarVisualizer>
    </div>
  );
};
