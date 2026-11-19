import type { AudioCaptureOptions } from "livekit-client";

// Browser processing applies to the track sent to the agent, not just the canvas.
export const MICROPHONE_CAPTURE_OPTIONS: AudioCaptureOptions = {
  autoGainControl: true,
  echoCancellation: true,
  noiseSuppression: true,
  channelCount: 1,
};

export interface MicrophonePreferences {
  muted: boolean;
  paused: boolean;
}
