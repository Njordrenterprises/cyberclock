// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { initializeSyncStore } from "./stores/syncStore";

mount(() => {
  initializeSyncStore();
  return <StartClient />;
}, document.getElementById("app")!);
