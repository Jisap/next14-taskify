"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";



const handler = async (data: InputType): Promise<ReturnType> => { // Esta action recibe el title
  
  const { userId } = auth();        

  if(!userId) {                                                   // Se comprueba si el usuario esta logueado
    return {
      error: "Unauthorized"
    };
  }

  const { title } = data;
  let board;

  try {
    board = await db.board.create({                               // Se graba en db en la tabla "board" el title
      data: {
        title,
      }
    })
  } catch (error) {
    return {
      error: "Failed to create."
    }
  }

  revalidatePath(`/board/${board.id}`);

  return { data: board }
}

export const createBoard = createSafeAction(CreateBoard, handler);  // Se valida con Zod y se le agregan los campos de errores 