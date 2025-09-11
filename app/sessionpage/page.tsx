"use client";
import AppRoot from "@/app/component/AppRoot";

export default function SessionPage() {
  return (
    <div className="h-screen w-screen bg-white overflow-hidden">
      <AppRoot
        appConfig={{
          startButtonText: "Voice Agent",
          isPreConnectBufferEnabled: true,
        }}
        autoStartSession={true}
      />
    </div>
  );
}
