
import { db } from "@/lib/db";
import { Board } from "./board";
import Form from "./form";
import { Info } from "./_components/Info";
import { useOrganization } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { BoardList } from "../../_components/BoardList";



const OrganizationIdPage = async () => {

  //const boards = await db.board.findMany();

  return (
    <div className="w-full mb-20">
      {/* <Form />
      <div className="space-y-2">
          {boards.map((board) => (
            <Board
              key={board.id}
              id={board.id}
              title={board.title}
            />
          ))}
      </div> */}
      <Info />
      <Separator className="my-4"/>
      <div className="px-2 md:px-4">
        <BoardList />
      </div>
    </div>
  )
}

export default OrganizationIdPage