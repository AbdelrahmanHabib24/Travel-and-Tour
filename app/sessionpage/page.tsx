"use client";
import AppRoot from "@/app/componant/AppRoot";

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
