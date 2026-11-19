export interface SpeechRipple {
  age: number;
  strength: number;
}

/** Audio envelopes drive motion; a ripple marks an acoustic onset, not a guessed word. */
export class VoiceMotion {
  level = 0;
  phase = 0;
  ripples: SpeechRipple[] = [];
  private armed = true;
  private peak = 0;
  private sinceOnset = 1;
  private previousTarget = 0;

  reset() {
    this.level = 0;
    this.ripples.length = 0;
    this.armed = true;
    this.peak = 0;
    this.sinceOnset = 1;
    this.previousTarget = 0;
  }

  update(rms: number, elapsed: number, reducedMotion: boolean) {
    const dt = Math.max(0, Math.min(0.05, elapsed));
    const signal = Math.max(0, rms - 0.0025);
    const target = Math.pow(Math.min(1, signal / 0.09), 0.55);
    this.level += (target - this.level) * (1 - Math.exp(-dt / (target > this.level ? 0.025 : 0.13)));
    if (Math.abs(target - this.level) < 0.0001) this.level = target;
    if (target === 0 && this.level < 0.002) this.level = 0;

    this.sinceOnset += dt;
    this.peak = Math.max(this.peak, target);
    if (target < 0.035 || target < this.peak * 0.52) this.armed = true;
    if (this.armed && target > 0.065 && target > this.previousTarget + 0.008 && this.sinceOnset > 0.11) {
      if (!reducedMotion) {
        if (this.ripples.length >= 4) this.ripples.shift();
        this.ripples.push({ age: 0, strength: target });
      }
      this.armed = false;
      this.peak = target;
      this.sinceOnset = 0;
    }

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      this.ripples[i].age += dt / 0.9;
      if (this.ripples[i].age >= 1 || reducedMotion) this.ripples.splice(i, 1);
    }
    if (this.level > 0 && !reducedMotion) {
      this.phase += dt * (0.9 + this.level * 3.2) * Math.min(1, this.level * 7);
    }
    this.previousTarget = target;
  }
}
