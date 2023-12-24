"use client"

import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";

interface BoardTitleFormProps {
  data: Board;
};

export const BoardTitleForm = ({ data }: BoardTitleFormProps) => {

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    })
  }

  const onSubmit = (formData:FormData) => {
    const title = formData.get("title") as string;
    console.log("submitting", title)
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  }

  if(isEditing){
    return (
      <form className="flex items-center gap-x-2" ref={formRef} action={onSubmit}>
        <FormInput 
          id="title"
          ref={inputRef}
          onBlur={onBlur}
          defaultValue={data.title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>  
    )
  }

  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  )
}