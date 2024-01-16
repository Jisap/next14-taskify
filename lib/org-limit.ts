import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { MAX_FREE_BOARDS } from "@/constants/boards";

// Estas funciones están diseñadas para gestionar límites de uso para organizaciones,
// incrementando, decrementando, verificando la disponibilidad y obteniendo la cantidad actual.

export const incrementAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit = await db.orgLimit.findUnique({           // Busca un límite de organización en la base de datos (db.orgLimit) basado en orgId.
    where: { orgId }
  });

  if (orgLimit) {                                           // Si existe un límite, 
    await db.orgLimit.update({                              // se actualiza incrementando el contador (count),
      where: { orgId },
      data: { count: orgLimit.count + 1 }
    });
  } else {                                                  // De lo contrario, se crea un nuevo límite con el contador establecido en 1.
    await db.orgLimit.create({
      data: { orgId, count: 1 }
    });
  }
};

export const decreaseAvailableCount = async () => {         // (código similar al anterior, pero decrementa el contador)
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId }
  });

  if (orgLimit) {
    await db.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 }
    });
  } else {
    await db.orgLimit.create({
      data: { orgId, count: 1 }
    });
  }
};

export const hasAvailableCount = async () => {  // Similar a las anteriores, 
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId }
  });

  if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {  // pero devuelve true si no hay límite o si el contador es menor que MAX_FREE_BOARDS, 
    return true;
  } else {
    return false;                                       // de lo contrario, devuelve false.
  }
};

export const getAvailableCount = async () => {          // Similar a las anteriores, 
  const { orgId } = auth();

  if (!orgId) {
    return 0;
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId }
  });

  if (!orgLimit) {                                      // pero simplemente devuelve el valor actual del contador o 0 si no hay límite.
    return 0;
  }

  return orgLimit.count;
};