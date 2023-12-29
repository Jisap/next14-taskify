"use client"

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MoreHorizontal, X } from "lucide-react";

interface BoardOptionsProps {
  id: string;
};

export const BoardOptions = ({ id }: BoardOptionsProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="h-auto w-auto p-2"
          variant="transparent"
        >
          <MoreHorizontal className="h-4 w-4"/>

        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="px-0 pt-3"
        side="bottom"
        align="start"  
      >
        <div className="text-sm font-medium text-center text-neutral-600">
          Board Actions
        </div>
        <PopoverClose asChild>
          <Button 
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
            >
            <X className="h-4 w-4"/>
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>  
  )
}