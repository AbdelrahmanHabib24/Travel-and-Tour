import type { AgentState } from "@livekit/components-react";
import type { VoiceMotion } from "./voiceMotion";

/** Bounded transparent lighting around the travel robot shared throughout chat. */
export function renderVoiceOrb(
  ctx: CanvasRenderingContext2D, width: number, height: number, motion: VoiceMotion,
  state: AgentState, inactive: boolean, reducedMotion: boolean,
  thinkingPhase: number, ambientTime = 0, portrait: HTMLCanvasElement | null = null,
) {
  ctx.clearRect(0, 0, width, height);
  const size = Math.min(width, height);
  const cx = width / 2;
  const cy = height / 2;
  const level = inactive ? 0 : reducedMotion ? Math.min(motion.level * 0.2, 0.06) : motion.level;
  const breathing = inactive || reducedMotion ? 0 : Math.sin(ambientTime * 1.15);
  const haloRadius = size * 0.43;
  const aura = ctx.createRadialGradient(cx, cy, size * 0.12, cx, cy, haloRadius);
  const shimmer = reducedMotion ? 0 : Math.sin(motion.phase * 1.3) * level * 0.009;
  aura.addColorStop(0, `rgba(18, 204, 203, ${0.055 + level * 0.035 + shimmer + breathing * 0.003})`);
  aura.addColorStop(0.62, "rgba(58, 220, 215, 0.025)");
  aura.addColorStop(1, "rgba(58, 220, 215, 0)");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, haloRadius, 0, Math.PI * 2);
  ctx.fill();

  if (!inactive && !reducedMotion) {
    for (const ripple of motion.ripples) {
      const radius = size * (0.32 + ripple.age * 0.095);
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.9, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(16, 190, 190, ${(0.06 + ripple.strength * 0.08) * (1 - ripple.age) ** 2})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  ctx.save();
  ctx.translate(cx, cy + size * 0.345);
  ctx.scale(1, 0.12);
  const reflection = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.19);
  reflection.addColorStop(0, "rgba(17, 128, 137, 0.1)");
  reflection.addColorStop(1, "rgba(17, 128, 137, 0)");
  ctx.fillStyle = reflection;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.19, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (portrait) {
    const imageHeight = size * 0.7;
    const imageWidth = imageHeight * portrait.width / portrait.height;
    const lift = -level * size * 0.009 + breathing * size * 0.002;
    const tilt = inactive || reducedMotion ? 0 : Math.sin(motion.phase * 0.45) * level * 0.018;
    ctx.save();
    ctx.translate(cx, cy + lift);
    ctx.rotate(tilt);
    ctx.scale(1 + level * 0.008 + breathing * 0.0015, 1 - level * 0.004 + breathing * 0.0015);
    ctx.globalAlpha = inactive ? 0.88 : 1;
    ctx.drawImage(portrait, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
    ctx.restore();
  }

  if (state === "thinking" && !inactive && !reducedMotion) {
    const x = cx + Math.sin(thinkingPhase) * size * 0.27;
    const y = cy + Math.cos(thinkingPhase) * size * 0.26;
    const light = ctx.createRadialGradient(x, y, 0, x, y, size * 0.1);
    light.addColorStop(0, "rgba(45, 212, 202, 0.07)");
    light.addColorStop(1, "rgba(45, 212, 202, 0)");
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
}
