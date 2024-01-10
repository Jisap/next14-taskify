"use client"

import { updateList } from "@/actions/update-list"
import { FormInput } from "@/components/form/form-input"
import { useAction } from "@/hooks/use-action"
import { List } from "@prisma/client"
import { ElementRef, useRef, useState } from "react"
import { toast } from "sonner"
import { useEventListener } from "usehooks-ts"
import ListOptions from "./list-options"

interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
}

const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {     // Cuando se hace click en el title focus en el input y selección de su contenido
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => { // Cuando se pulsa escape se envía a submit el contenido del formulario
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  };

  const onBlur = () => {                    // Cuando se quita el foco del input se envía a submit el contenido del form
    formRef.current?.requestSubmit();
  }


  useEventListener("keydown", onKeyDown);               // Listener del evento keydown que llama a la func onKeyDown 

  const { execute } = useAction(updateList, {           // La action actualiza el title en la list
    onSuccess: (data) => {
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const handleSubmit = (formData: FormData) => {          // Recoge los valores del formulario
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    if (title === data.title) {
      return disableEditing();
    }

    execute({                                             // y los envía a la action
      title,
      id,
      boardId,
    });
  }

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {
        isEditing ? (
          <form 
            ref={formRef}
            action={handleSubmit}  
            className="flex-1 px-[2px]"
          >
            <input hidden id="id" name="id" defaultValue={data.id} />
            <input hidden id="boardId" name="boardId" defaultValue={data.boardId} />
            <FormInput 
              ref={inputRef}
              onBlur={onBlur}
              id="title"
              placeholder="Enter list title.."
              defaultValue={title}
              className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
            />
            <button type="submit" hidden />
          </form>  
        ) : (
          <div 
            onClick={enableEditing}
            className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
            { title }
          </div> 
        )
      }
      <ListOptions 
        data={data}
        onAddCard={onAddCard}
      />
    </div>
  )
}

export default ListHeader