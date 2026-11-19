"use client";

import React, { useEffect, useRef, useState } from "react";
import type { AgentState, TrackReference } from "@livekit/components-react";
import { VoiceMotion } from "./voiceMotion";
import { renderVoiceOrb } from "./renderVoiceOrb";

export interface VoiceOrbProps {
  state: AgentState;
  audioTrack?: TrackReference | null;
  micTrack?: MediaStreamTrack | null;
  isMuted?: boolean;
  isPaused?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

const FFT_SIZE = 1024;

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  state,
  audioTrack,
  micTrack,
  isMuted = false,
  isPaused = false,
  className = "",
  width = 320,
  height = 250,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [portrait, setPortrait] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let active = true;
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => {
      if (!active) return;
      const texture = document.createElement("canvas");
      texture.width = 512;
      texture.height = Math.round(512 * image.naturalHeight / image.naturalWidth);
      const context = texture.getContext("2d");
      if (!context) return;
      context.drawImage(image, 0, 0, texture.width, texture.height);
      // Feather the portrait's lower crop; keep the project PNG alpha untouched.
      context.globalCompositeOperation = "destination-in";
      const fade = context.createLinearGradient(0, 0, 0, texture.height);
      fade.addColorStop(0, "#fff");
      fade.addColorStop(0.89, "#fff");
      fade.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = fade;
      context.fillRect(0, 0, texture.width, texture.height);
      setPortrait(texture);
    };
    image.src = "/sunny-avatar-transparent.png";
    return () => { active = false; image.onload = null; };
  }, []);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analysersRef = useRef<{ mic: AnalyserNode | null; agent: AnalyserNode | null }>({ mic: null, agent: null });
  const motionRef = useRef<VoiceMotion | null>(null);
  const ambientTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const remoteAgentTrack = audioTrack?.publication?.track?.mediaStreamTrack || null;
  const sessionActive = ["listening", "thinking", "speaking"].includes(state);
  // Keep the local analyser alive during thinking and agent speech so interruptions animate.
  const localInput = sessionActive && !isMuted && !isPaused ? micTrack || null : null;
  const agentInput = state === "speaking" && !isPaused ? remoteAgentTrack : null;

  useEffect(() => {
    motionRef.current?.reset();
    analysersRef.current = { mic: null, agent: null };
    if (!localInput && !agentInput) return;

    const AudioCtx = window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    let context: AudioContext;
    try { context = new AudioCtx(); } catch { return; }
    audioContextRef.current = context;
    const sources: MediaStreamAudioSourceNode[] = [];
    const resume = () => {
      if (context.state === "suspended") void context.resume().catch(() => {});
    };
    const connectTrack = (track: MediaStreamTrack | null) => {
      if (!track || track.readyState === "ended") return null;
      try {
        const analyser = context.createAnalyser();
        analyser.fftSize = FFT_SIZE;
        const source = context.createMediaStreamSource(new MediaStream([track]));
        source.connect(analyser); // Deliberately never connect the microphone to speakers.
        sources.push(source);
        return analyser;
      } catch {
        return null;
      }
    };
    const inputs = { mic: connectTrack(localInput), agent: connectTrack(agentInput) };
    analysersRef.current = inputs;
    resume();
    window.addEventListener("pointerdown", resume, { passive: true });
    window.addEventListener("keydown", resume);
    document.addEventListener("visibilitychange", resume);

    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
      document.removeEventListener("visibilitychange", resume);
      sources.forEach((source) => source.disconnect());
      inputs.mic?.disconnect();
      inputs.agent?.disconnect();
      if (analysersRef.current === inputs) analysersRef.current = { mic: null, agent: null };
      if (audioContextRef.current === context) audioContextRef.current = null;
      if (context.state !== "closed") void context.close().catch(() => {});
      // The tracks belong to LiveKit; closing this analyser must never stop them.
    };
  }, [localInput, agentInput]);

  // High-DPI Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    if (!motionRef.current) {
      motionRef.current = new VoiceMotion();
    }
    const motion = motionRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = preference.matches;
    const onPreferenceChange = () => { reducedMotion = preference.matches; };
    preference.addEventListener("change", onPreferenceChange);
    const samples = new Float32Array(FFT_SIZE);
    const measure = (analyser: AnalyserNode | null, track: MediaStreamTrack | null) => {
      if (!analyser || !track || track.readyState === "ended" || !track.enabled || track.muted) {
        return 0;
      }
      analyser.getFloatTimeDomainData(samples);
      let mean = 0;
      for (const sample of samples) mean += sample;
      mean /= samples.length;
      let energy = 0;
      for (const sample of samples) energy += (sample - mean) ** 2;
      return Math.sqrt(energy / samples.length);
    };

    let previousFrame: number | undefined;
    let thinkingPhase = 0;
    let idleDrawn = false;
    const render = (timestamp: number) => {
      const elapsed = previousFrame === undefined ? 1 / 60 : Math.max(0, Math.min(0.05, (timestamp - previousFrame) / 1000));
      previousFrame = timestamp;
      const inactive = isPaused || (isMuted && state !== "speaking");
      const micRms = measure(analysersRef.current.mic, localInput);
      const agentRms = measure(analysersRef.current.agent, agentInput);
      if (inactive) motion.reset();
      else motion.update(
        Math.max(micRms, agentRms),
        elapsed,
        reducedMotion,
      );
      const thinking = state === "thinking" && !inactive && !reducedMotion;
      if (thinking) thinkingPhase += elapsed * 1.05;
      const alive = !inactive && !reducedMotion && ["listening", "thinking", "speaking"].includes(state);
      if (alive) ambientTimeRef.current += elapsed;
      const settled = motion.level === 0 && motion.ripples.length === 0 && !thinking && !alive;
      // Active listening has a restrained breath/blink; pause, mute and reduced motion can settle.
      if (!settled || !idleDrawn) {
        renderVoiceOrb(ctx, width, height, motion, state, inactive, reducedMotion, thinkingPhase, ambientTimeRef.current, portrait);
      }
      idleDrawn = settled;
      animationFrameRef.current = requestAnimationFrame(render);
    };
    animationFrameRef.current = requestAnimationFrame(render);
    return () => {
      preference.removeEventListener("change", onPreferenceChange);
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [state, isMuted, isPaused, localInput, agentInput, width, height, portrait]);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center select-none bg-transparent ${className}`}
      style={{ width, maxWidth: "100%" }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-auto max-w-full pointer-events-none bg-transparent"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

export default VoiceOrb;
