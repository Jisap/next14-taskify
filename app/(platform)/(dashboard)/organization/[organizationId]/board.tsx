import { deleteBoard } from "@/actions/delete-Board";
import { FormDelete } from "./form-delete";


interface BoardProps {
  title: string;
  id: string;
}


export const Board = ({title, id}: BoardProps) => {

  const deleteBoardWithId = deleteBoard.bind(null, id);   // Action para borrar un board

  return (
    <form
      action={deleteBoardWithId} 
      className="flex items-center gap-x-2">
      <p>
        Board name: {title}
      </p>
      <FormDelete />
    </form>
  )
}

