"use server";

import { db } from "@/data/firebase";
import { writeBatch, doc } from "firebase/firestore";

export default async function serverDeleteTournament(tournament: Tournament) {
  const batch = writeBatch(db);

  const { rounds } = tournament;
  for (let round of rounds) {
    const { pairs } = round;
    for (let pair of pairs) {
      batch.delete(
        doc(
          db,
          "tournaments",
          tournament.slug,
          "rounds",
          round.id.toString(),
          "pairs",
          pair.id.toString()
        )
      );
    }

    batch.delete(
      doc(db, "tournaments", tournament.slug, "rounds", round.id.toString())
    );
  }

  batch.delete(doc(db, "tournaments", tournament.slug));

  try {
    await batch.commit();
  } catch (e) {
    console.log(e);
    throw new Error("Error deleting tournament");
  }
}
