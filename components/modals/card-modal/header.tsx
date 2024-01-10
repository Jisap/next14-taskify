"use client"

import { updateCard } from "@/actions/update-card";
import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface HeaderProps {
  data: CardWithList;
}

export const Header = ({ data }: HeaderProps) => { // Se recibe en el header la cardWithList

  const queryClient = useQueryClient();
  const params = useParams();

  const { execute } = useAction(updateCard, {       // En los callbacks del useAction se establecen los invalidateQueries y los nuevos querykey
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id]
      });

      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id]
      });

      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const inputRef = useRef<ElementRef<"input">>(null);       
  const [title, setTitle] = useState(data?.title);

  const onBlur = () => {                                    // Al quitar el foco del input hacemos action={onSubmit} en el formulario
    inputRef.current?.form?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {                // Obtenemos del formulario
    const title = formData.get("title") as string;          // el title del input
    const boardId = params.boardId as string;               // y el boardId de los params (/board/[boardId])

    if (title === data.title) {
      return;
    }

    execute({                                               // Se llama a la action updateCard al quitarle el foco (onBlur)
      title,
      boardId,
      id: data.id,
    });
  }


  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput 
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
        </form>
        <p className="text-sm text-muted-foreground">
          in list <span className="underline">{data?.list?.title}</span>
        </p>
      </div>
    </div>  
  )
}

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};