"use client";

import { List } from "@prisma/client";

interface ListContainerProps {
  data: List[];
  boardId: string;
};


const ListContainer = ({ data, boardId }: ListContainerProps) => {
  return (
    <div>
      ListContainer
    </div>
  )
}

export default ListContainer