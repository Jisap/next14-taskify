import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";

interface Props {
  entityId: string;         // id del board, list o card
  entityType: ENTITY_TYPE,  // Board, list, card
  entityTitle: string;      // Título del board, list o card
  action: ACTION;           // create, uodate, delete
};

// Un registro de auditoría (audit log) es un registro detallado y cronológico de eventos
// y actividades que ocurren en un sistema, aplicación o red. 


export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = auth();                                         // Obtener el ID de la organización y la información del usuario autenticado
    const user = await currentUser();

    if (!user || !orgId) {                                            // Verificar que el usuario y el ID de la organización existan
      throw new Error("User not found!");
    }

    const { entityId, entityType, entityTitle, action } = props;      // Extraer propiedades de los argumentos

    await db.auditLog.create({                                        // Crear un registro de auditoría utilizando Prisma
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: user?.firstName + " " + user?.lastName,
      }
    });
  } catch (error) {                                                   // Capturar y manejar errores, registrándolos en la consola
    console.log("[AUDIT_LOG_ERROR]", error);
  }
}