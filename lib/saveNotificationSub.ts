"use server";

import { db } from "@/data/firebase";
import { addDoc, collection } from "firebase/firestore";

export default async function saveNotificationSub(sub: string) {
  console.log("Saving notification subscription", sub);
  let parsedSub: PushSubscription = JSON.parse(sub);
  try {
    const res = await addDoc(collection(db, "notification_subs"), parsedSub);
    console.log("Notification subscription saved", res);
  } catch (err) {
    console.error(err);
    throw new Error("Error saving notification subscription");
  }
}
