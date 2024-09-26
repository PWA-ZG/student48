"use client";

import { Share2 } from "lucide-react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ShareProps {
  url: string;
  title: string;
  text: string;
}

export default function Share({ url, title, text }: ShareProps) {
  const share = () => {
    console.log(title, text, url);
    if (navigator.share) {
      navigator
        .share({
          title,
          text,
          url,
        })
        .catch(() => {
          toast.error("Failed to share");
        });
      return;
    } else {
      navigator.clipboard.writeText(window.location.toString());
      toast("Copied to clipboard!", {
        icon: "📋",
      });
    }
  };

  return (
    <TooltipProvider delayDuration={350}>
      <Tooltip>
        <TooltipTrigger>
          <Button
            size={"icon"}
            asChild
            variant={"outline"}
            className="hover:cursor-pointer"
            onClick={share}
          >
            <Share2 className="p-2" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy path to clipboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
