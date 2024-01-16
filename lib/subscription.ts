import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

const DAY_IN_MS = 86_400_000;                                       // Cantidad de milisegundos en un día (24 horas).

export const checkSubscription = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return false;
  }

  const orgSubscription = await db.orgSubscription.findUnique({     // Busca una suscripción de la organización en la base de datos(db.orgSubscription) 
    where: {                                                        // basada en orgId.
      orgId,
    },
    select: {                                                       // Selecciona los campos que se desean mostrar
      stripeSubscriptionId: true,                                   
      stripeCurrentPeriodEnd: true,                                  
      stripeCustomerId: true,                                       
      stripePriceId: true,                                           
    },
  });

  if (!orgSubscription) {                                           // Si no hay subscripción devuelve false.  
    return false;
  }

  const isValid =                                                                 // Verifica la validez de la suscripción                                                      
    orgSubscription.stripePriceId &&                                              // Para ello aseguramos que haya un stripeId
    orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()   // y que la fecha de finalización + 1 sea mayor  a la fecha actual

  return !!isValid; // Rdo convertido a boolean
};