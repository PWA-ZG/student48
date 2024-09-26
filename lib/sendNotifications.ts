"use server";

import { db } from "@/data/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import * as webpush from "web-push";

interface FirestoreSubscription {
  id: string;
  subscription: webpush.PushSubscription;
}

export default async function sendNotifications(
  title: string,
  body: string,
  redirectUrl: string
) {
  console.log("Sending notifications", title, body, redirectUrl);

  const pubKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC;
  if (!pubKey) throw new Error("VAPID_PUBLIC not set");
  const privKey = process.env.VAPID_PRIVATE;
  if (!privKey) throw new Error("VAPID_PRIVATE not set");

  webpush.setVapidDetails("mailto:fran.markulin@fer.hr", pubKey, privKey);

  let subs: FirestoreSubscription[] = [];
  try {
    const subSnaps = await getDocs(collection(db, "notification_subs"));
    subs = subSnaps.docs.map((doc) => {
      return {
        id: doc.id,
        subscription: doc.data() as webpush.PushSubscription,
      };
    });
  } catch (err) {
    console.error("Error fetching notification subscriptions", err);
    throw new Error("Error fetching notification subscriptions");
  }

  console.log("Sending notifications to", subs.length, "subscribers");

  const payload = JSON.stringify({
    title,
    body,
    redirectUrl,
  });

  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub.subscription, payload);
    } catch (err) {
      console.error("Error sending notification", err);
      if ((err as webpush.WebPushError).statusCode === 410) {
        // 410 Gone: The subscription is no longer valid and should be removed.
        // Remove from database
        console.log("Removing invalid subscription", sub.id);
        try {
          await deleteDoc(doc(db, "notification_subs", sub.id));
        } catch (err) {
          console.error("Error removing invalid subscription", err);
        }
      }
    }
  }
}
