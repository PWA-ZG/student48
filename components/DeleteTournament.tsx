"use client";

import { db } from "@/data/firebase";
import { deleteDoc, doc, writeBatch } from "firebase/firestore";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import serverDeleteTournament from "@/lib/deleteTournament";

export default function DeleteTournament({
  tournament,
}: {
  tournament: Tournament;
}) {
  const { user, isLoading } = useUser();

  const deleteTournament = async () => {
    if (!user || user.sub !== tournament.userSub) {
      toast.error("You don't have permission to delete this tournament");
      return;
    }

    const deletePromise = serverDeleteTournament(tournament);
    toast.promise(deletePromise, {
      loading: "Deleting tournament...",
      success: "Tournament deleted",
      error: "Error deleting tournament",
    });

    try {
      await deletePromise;
      window.location.href = "/";
    } catch (e) {
      toast.error("Error deleting tournament");
    }
  };

  return (
    <TooltipProvider delayDuration={350}>
      <Tooltip>
        <TooltipTrigger>
          <Button
            size={"icon"}
            variant={"outline"}
            className="hover:cursor-pointer"
            onClick={deleteTournament}
            disabled={isLoading || !user || user.sub !== tournament.userSub}
            asChild
          >
            <Trash2 className="text-destructive hover:text-destructive p-2" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete tournament</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
