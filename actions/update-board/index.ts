"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./type"
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";
import { UpdateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => { // Esta action recibe el title y el id del board según params 

  const { userId, orgId } = auth();

  if (!userId || !orgId) {                    // Se comprueba que el usuario esta loguea y existe la orgId
    return {
      error: "Unauthorized",
    };
  }

  const { title, id } = data;
  let board;

  try {
    board = await db.board.update({           // Se graba en bd en la tabla board la actualización
      where: {
        id,
        orgId,
      },
      data: {
        title,
      },
    });

   
  } catch (error) {
    return {
      error: "Failed to update."
    }
  }

  revalidatePath(`/board/${id}`);
  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler); // Se valida con Zod, se actualiza en bd y se le agregan los campos de errores -> success o error