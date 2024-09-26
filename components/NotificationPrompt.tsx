"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import toast from "react-hot-toast";
import saveNotificationSub from "@/lib/saveNotificationSub";

function urlBase64ToUint8Array(base64String: string) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const setupPushSubscription = async () => {
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();

    if (sub) {
      console.log("Already subscribed.");
      return;
    }

    console.log("Subscribing...");
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC;
    if (!publicKey) {
      toast.error("VAPID public key not found.");
      return;
    }
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    await saveNotificationSub(JSON.stringify(sub));
    toast.success("Notifications enabled!");
  } catch (error) {
    toast.error("Error enabling notifications.");
  }
};

const setupNotifications = async (
  setOpen: Dispatch<SetStateAction<boolean>>
) => {
  Notification.requestPermission().then(async (permission) => {
    if (permission === "granted") {
      await setupPushSubscription();
    } else {
      console.log("User declined permission.");
    }
    setOpen(false);
  });
};

export default function NotificationPrompt() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setReady(true);
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        setOpen(true);
      } else if (Notification.permission === "granted") {
        setupPushSubscription();
      }
    }
  }, []);

  if (!ready) return null;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Notifications</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to receive notifications when new tournaments are
            added?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            No
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => setupNotifications(setOpen)}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
