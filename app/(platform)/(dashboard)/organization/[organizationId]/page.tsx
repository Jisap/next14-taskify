
import { db } from "@/lib/db";
import { Board } from "./board";
import Form from "./form";
import { Info } from "./_components/Info";
import { useOrganization } from "@clerk/nextjs";



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
    </div>
  )
}

export default OrganizationIdPage