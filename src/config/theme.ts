export const colors = {
  neonLime: "#D2FF00",
  carbonBlack: "#080808",
  offWhite: "#F8F8F5",
  graphite: "#252525",
  lightGray: "#E7E7E2",
  pureWhite: "#FFFFFF",
} as const;

export const motion = {
  /** Durações em segundos. */
  duration: {
    instant: 0.15,
    fast: 0.3,
    base: 0.6,
    slow: 0.9,
    slower: 1.4,
  },
  /** Curvas cubic-bezier [x1, y1, x2, y2]. */
  easing: {
    standard: [0.4, 0, 0.2, 1],
    outExpo: [0.16, 1, 0.3, 1],
    inOutExpo: [0.87, 0, 0.13, 1],
    outQuart: [0.25, 1, 0.5, 1],
  },
  /** Atrasos entre itens em segundos. */
  stagger: {
    tight: 0.04,
    base: 0.08,
    relaxed: 0.14,
  },
} as const;

/** Larguras mínimas em px (mobile-first). */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const theme = { colors, motion, breakpoints } as const;

export type ThemeColor = keyof typeof colors;
export type Breakpoint = keyof typeof breakpoints;
