"use client";

import { useEffect } from "react";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

let deferredPrompt: any;

export default function InstallDialog() {
  useEffect(() => {
    const onInstallClick = (installToast: any) => {
      installToast.dismiss();
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
      });
    };

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const installToast = toast({
        title: "Install",
        description: "This app can be installed on your device!",
        action: (
          <ToastAction
            onClick={() => onInstallClick(installToast)}
            altText="Install app"
          >
            Install
          </ToastAction>
        ),
      });
    });
  }, []);

  return null;
}
