"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Navigation } from "@/components/layout/Navigation/Navigation";
import { CustomCursor } from "@/components/motion/CustomCursor/CustomCursor";
import { Preloader } from "@/components/motion/Preloader/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll/SmoothScroll";
import { features } from "@/config/features";
import { AppReadyContext } from "./AppReadyContext";
import { NavigationProvider, useNavigation } from "./NavigationContext";

function Shell({ children }: { children: ReactNode }) {
  const { isOpen } = useNavigation();
  const [ready, setReady] = useState(false);
  const handleComplete = useCallback(() => setReady(true), []);

  const scrollContent = (
    <>
      {children}
      <Navigation />
    </>
  );

  return (
    <AppReadyContext.Provider value={ready}>
      {features.smoothScrollEnabled ? (
        <SmoothScroll paused={isOpen || !ready}>{scrollContent}</SmoothScroll>
      ) : (
        scrollContent
      )}
      <Preloader onComplete={handleComplete} />
      {features.customCursorEnabled ? <CustomCursor /> : null}
    </AppReadyContext.Provider>
  );
}

/** Compõe scroll suave, preloader, cursor e estado de navegação. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NavigationProvider>
      <Shell>{children}</Shell>
    </NavigationProvider>
  );
}
