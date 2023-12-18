"use client"

import { ElementRef, useRef } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit"; 
import { Button } from "@/components/ui/button";
import { FieldErrors } from '../../lib/create-safe-action';

interface FormPopoverProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
};

export const FormPopover = ({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
}: FormPopoverProps) => {

  const { execute, FieldErrors } = useAction(createBoard, {  // Usamos el hook pasandole la action
    onSuccess: (data) => {                                   // Si fue exitosa la validación con Zod, la grabación eb bd y la agregación los campos de errores, onSucess recibe la data 
      console.log({ data });                                 // y se muestra dicha data y un mensaje de éxito 
    },
    onError: (error) => {
      console.log({error})
    }
  });

  const onSubmit = (formData: FormData) => {                // Al dar en submit recogemos el contenido del formulario    
    const title = formData.get("title") as string;          // obtenemos el title
    execute({ title })                                      // Este title es la TInput data que se manda a execute del useAction -> action -> createBoard
  }                                                         // Con ella se valida el title con Zod, se graba en bd y se le agregan los campos de errores al resultado

  return (
    <Popover>
      <PopoverTrigger>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create Board
        </div>
        <PopoverClose>
          <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
            <X className="h-4 w-4"/>
          </Button>
        </PopoverClose>
        <form className="space-y-4" action={onSubmit}>
          <div className="space-y-4">
            <FormInput 
              id="title"
              label="Board title"
              type="text"
            />
          </div>
          <FormSubmit className="w-full">
            Create
          </FormSubmit>

        </form>
      </PopoverContent>
    </Popover>  
  )
}
