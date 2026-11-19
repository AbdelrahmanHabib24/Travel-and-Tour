"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import FloatingAssistant from "@/features/sunny/FloatingAssistant";
import TextChat from "@/features/sunny/TextChat";

interface AppConfig {
  isPreConnectBufferEnabled: boolean;
}

interface AppRootProps {
  appConfig: AppConfig;
  autoStartSession?: boolean;
}

const AppRoot = ({ appConfig, autoStartSession = false }: AppRootProps) => {
  const pathname = usePathname();

  // Hide Sunny AI on authentication pages
  const isAuthPage = Boolean(
    pathname &&
      (pathname.toLowerCase().startsWith("/login") ||
        pathname.toLowerCase().startsWith("/signup") ||
        pathname.toLowerCase().startsWith("/sign-up") ||
        pathname.toLowerCase().startsWith("/register") ||
        pathname.toLowerCase().startsWith("/forgot-password") ||
        pathname.toLowerCase().startsWith("/reset-password") ||
        pathname.toLowerCase().startsWith("/auth"))
  );

  // Automatically open in voice mode when visiting /sessionpage (single global AppRoot instance)
  const isSessionPage = Boolean(
    pathname?.toLowerCase().startsWith("/sessionpage")
  );
  const effectiveAutoStart = autoStartSession || isSessionPage;

  // Unified Sunny widget open state (hosts both Chat Mode and Voice Mode inside the same widget shell)
  const [prevEffectiveAutoStart, setPrevEffectiveAutoStart] = useState(effectiveAutoStart);
  const [prevIsAuthPage, setPrevIsAuthPage] = useState(isAuthPage);
  const [widgetOpen, setWidgetOpen] = useState(effectiveAutoStart && !isAuthPage);

  if (effectiveAutoStart !== prevEffectiveAutoStart) {
    setPrevEffectiveAutoStart(effectiveAutoStart);
    if (effectiveAutoStart) {
      setWidgetOpen(true);
    }
  }

  if (isAuthPage !== prevIsAuthPage) {
    setPrevIsAuthPage(isAuthPage);
    if (isAuthPage) {
      setWidgetOpen(false);
    }
  }

  const handleCloseAll = useCallback(() => {
    setWidgetOpen(false);
  }, []);

  // Hide Sunny AI completely on authentication pages
  if (isAuthPage) {
    return null;
  }

  return (
    <>
      <FloatingAssistant
        onStartCall={() => setWidgetOpen(true)}
        disabled={widgetOpen}
      />

      <TextChat
        isOpen={widgetOpen}
        onClose={handleCloseAll}
        initialMode={effectiveAutoStart ? "voice" : "chat"}
        isPreConnectBufferEnabled={appConfig.isPreConnectBufferEnabled}
      />
    </>
  );
};

export default AppRoot;
