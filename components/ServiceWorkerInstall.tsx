"use client";

import { useEffect } from "react";

export default function ServiceWorkerInstall() {
  useEffect(() => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.register("/sw.js");
    } else {
      console.log("Service worker not supported");
    }
  }, []);

  return null;
}
