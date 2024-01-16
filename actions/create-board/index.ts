"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";
import { incrementAvailableCount, hasAvailableCount } from "@/lib/org-limit";



const handler = async (data: InputType): Promise<ReturnType> => { // Esta action recibe el title y la imagen del form-picker
  
  const { userId, orgId } = auth();        

  if(!userId || !orgId) {                                                   // Se comprueba si el usuario esta logueado
    return {
      error: "Unauthorized"
    };
  }

  const canCreate = await hasAvailableCount();

  if (!canCreate) {
    return {
      error: "You have reached your limit of free boards. Please upgrade to create more."
    }
  }

  const { title, image } = data;
  const [
    imageId, 
    imageThumbUrl, 
    imageFullUrl, 
    imageLinkHTML, 
    imageUserName
  ] = image.split("|");
  

  if (!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML) {
    return {
      error: "Missing fields. Failed to create board."
    };
  }


  let board;

  try {
    board = await db.board.create({                               // Se graba en db en la tabla "board" el title
      data: {                                                     // orgId y las props de la image seleccionada
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML,
      }
    });

    await incrementAvailableCount();

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    })

  } catch (error) {
    return {
      error: "Failed to create."
    }
  }

  revalidatePath(`/board/${board.id}`);

  return { data: board }
}

export const createBoard = createSafeAction(CreateBoard, handler);  // Se valida con Zod, graba en bd y se le agregan los campos de errores 