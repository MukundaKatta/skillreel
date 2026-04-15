/**
 * Timing + easing helpers for the Remotion animations.
 *
 * Every scene in the announcement uses the same small toolkit: snap a
 * frame into a named "beat" with enter / hold / exit phases, apply one
 * of a handful of eases, and stagger cascaded items so bullets don't
 * land simultaneously. This module is that toolkit — pure math, no
 * Remotion hooks — so it can be unit-tested and reused in Storybook.
 */

export type Phase = "before" | "enter" | "hold" | "exit" | "after";

export type Beat = {
  startFrame: number;
  enterFrames: number;
  holdFrames: number;
  exitFrames: number;
};

export function phaseOf(frame: number, beat: Beat): Phase {
  const enterEnd = beat.startFrame + beat.enterFrames;
  const holdEnd = enterEnd + beat.holdFrames;
  const exitEnd = holdEnd + beat.exitFrames;
  if (frame < beat.startFrame) return "before";
  if (frame < enterEnd) return "enter";
  if (frame < holdEnd) return "hold";
  if (frame < exitEnd) return "exit";
  return "after";
}

/** 0..1 progress inside the current phase — useful for interpolation. */
export function phaseProgress(frame: number, beat: Beat): { phase: Phase; t: number } {
  const phase = phaseOf(frame, beat);
  switch (phase) {
    case "before": return { phase, t: 0 };
    case "enter":
      return { phase, t: clamp01((frame - beat.startFrame) / Math.max(1, beat.enterFrames)) };
    case "hold": return { phase, t: 1 };
    case "exit": {
      const exitStart = beat.startFrame + beat.enterFrames + beat.holdFrames;
      return { phase, t: 1 - clamp01((frame - exitStart) / Math.max(1, beat.exitFrames)) };
    }
    case "after": return { phase, t: 0 };
  }
}

export type Ease = "linear" | "easeIn" | "easeOut" | "easeInOut" | "overshoot" | "bounce";

export function ease(t: number, kind: Ease): number {
  const x = clamp01(t);
  switch (kind) {
    case "linear": return x;
    case "easeIn": return x * x * x;
    case "easeOut": return 1 - Math.pow(1 - x, 3);
    case "easeInOut":
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    case "overshoot": {
      const s = 1.70158;
      return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
    }
    case "bounce": {
      const n1 = 7.5625;
      const d1 = 2.75;
      let y = x;
      if (y < 1 / d1) return n1 * y * y;
      if (y < 2 / d1) return n1 * (y -= 1.5 / d1) * y + 0.75;
      if (y < 2.5 / d1) return n1 * (y -= 2.25 / d1) * y + 0.9375;
      return n1 * (y -= 2.625 / d1) * y + 0.984375;
    }
  }
}

/** Interpolate a value over a beat with easing applied. */
export function animateOverBeat(
  frame: number,
  beat: Beat,
  from: number,
  to: number,
  kind: Ease = "easeOut",
): number {
  const { t } = phaseProgress(frame, beat);
  return from + (to - from) * ease(t, kind);
}

/** Stagger N items — each gets its own beat offset by `stepFrames`. */
export function staggeredBeats(
  count: number,
  base: Beat,
  stepFrames: number,
): Beat[] {
  const out: Beat[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      ...base,
      startFrame: base.startFrame + i * stepFrames,
    });
  }
  return out;
}

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/** Convert a seconds-based timeline spec into frames at fps. */
export function beatFromSeconds(spec: {
  startSec: number;
  enterSec: number;
  holdSec: number;
  exitSec: number;
}, fps: number): Beat {
  return {
    startFrame: Math.round(spec.startSec * fps),
    enterFrames: Math.round(spec.enterSec * fps),
    holdFrames: Math.round(spec.holdSec * fps),
    exitFrames: Math.round(spec.exitSec * fps),
  };
}
