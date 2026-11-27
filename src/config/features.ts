/** Feature flags. Altere aqui para habilitar/desabilitar recursos. */
export const features = {
  partnersSectionEnabled: false,
  analyticsEnabled: false,
  contactFormEnabled: true,
  smoothScrollEnabled: true,
  pageTransitionsEnabled: true,
  customCursorEnabled: true,
  testimonialsSectionEnabled: false,
  blogEnabled: false,
} as const;

export type FeatureFlag = keyof typeof features;
