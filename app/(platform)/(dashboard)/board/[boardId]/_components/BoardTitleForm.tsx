"use client"

import { updateBoard } from "@/actions/update-board";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface BoardTitleFormProps {
  data: Board;
};

export const BoardTitleForm = ({ data }: BoardTitleFormProps) => { // La data es el objeto board según id de los params

  const { execute } = useAction(updateBoard, {                     // Usamos el hook pasandole la action
    onSuccess: (data) => {                                         // Si fue exitosa la validación con Zod, la actualización en bd y agregación de los campos de errores, onSucess recibe la data 
      toast.success(`Board "${data.title}" updated!`);
      setTitle(data.title);
      disableEditing(); // isEditing=false -> formInput deshabilitado
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {         // Cambia el estado isEditing a true 
    setIsEditing(true);                 // y utiliza setTimeout para enfocar y seleccionar el campo de entrada 
    setTimeout(() => {                  // después de un breve retraso.
      inputRef.current?.focus();
      inputRef.current?.select();
    })
  }

  const onSubmit = (formData:FormData) => {
    const title = formData.get("title") as string;
    execute({
      title,
      id: data.id,
    });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  }

  if(isEditing){
    return (
      <form 
        className="flex items-center gap-x-2" 
        ref={formRef} // Asocia el objeto de referencia formRef con el elemento <form>. Ahora, se puede acceder a este formulario mediante formRef.current. 
        action={onSubmit}
      >
        <FormInput 
          id="title"
          ref={inputRef}  // Asocia el objeto de referencia inputRef con el componente FormInput. De esta manera se puede acceder al componente FormInput mediante inputRef.current
          onBlur={onBlur}
          defaultValue={data.title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>  
    )
  }

  return (
    <Button
      onClick={enableEditing} // click sobre el button -> isEditing=true -> focus on input -> enter -> onSubmit -> action
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  )
}