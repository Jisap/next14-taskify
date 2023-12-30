"use client";

import { ListWithCards } from "@/types";
import { List } from "@prisma/client";
import ListForm from "./list-form";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
};


const ListContainer = ({ data, boardId }: ListContainerProps) => {
  return (
    <ol>
      <ListForm />
      <div className="flex-shrink-0 w-1"/>

    </ol>
  )
}

export default ListContainer