// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { initializeSyncStore } from "./stores/syncStore";

mount(() => {
  try {
    initializeSyncStore();
    return <StartClient />;
  } catch (error) {
    console.error('Failed to initialize synchronization store:', error);
    return <div class="error">Failed to initialize the application. Please try again later.</div>;
  }
}, document.getElementById("app")!);
