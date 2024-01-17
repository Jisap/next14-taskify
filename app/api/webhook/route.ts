import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {                        // Cuando se realiza el pago stripe lanza una solicitud a este endpoint

  const body = await req.text();                                  // Se obtiene el cuerpo de la solicitud     
  const signature = headers().get("Stripe-Signature") as string;  // y la firma de la solicitud de webhook de Stripe.

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(                       // Se utiliza stripe.webhooks.constructEvent para validar la firma de la solicitud 
      body,                                                       // y construir el objeto de evento de Stripe.
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (error) {
    return new NextResponse("Webhook error", { status: 400 });    // Si la firma no es válida, se devuelve una respuesta HTTP con un mensaje de error.
  }

  const session = event.data.object as Stripe.Checkout.Session;   // Se extrae la información de la sesión de pago del evento.

  if (event.type === "checkout.session.completed") {              // Si el evento fue un pago exitoso (creación por 1ª vez de una suscripción)
    const subscription = await stripe.subscriptions.retrieve(     // se  recupera información detallada sobre la suscripción asociada a la sesión de pago. 
      session.subscription as string                              // Esto incluye detalles como el ID de la suscripción, el cliente asociado, el precio, y más.
    );

    if (!session?.metadata?.orgId) {                                  // Se verifica si el campo orgId está presente en los metadatos de la sesión de pago. 
      return new NextResponse("Org ID is required", { status: 400 });
    }

    await db.orgSubscription.create({                             // Creación de un nuevo registro en la base de datos:
      data: {
        orgId: session?.metadata?.orgId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {                 // Si el evento es el pago de una factura con exito (renovación de la suscripción)

    const subscription = await stripe.subscriptions.retrieve(       // volvemos a recuperar información detallada sobre la suscripción asociada a la sesión de pago
      session.subscription as string
    );

    await db.orgSubscription.update({                               // y se actualiza un registro existente en la tabla orgSubscription en la base de datos.
      where: {
        stripeSubscriptionId: subscription.id,                      // se utiliza el ID de la suscripción de Stripe (stripeSubscriptionId) para identificar 
      },                                                            // la suscripción específica que se debe actualizar.
      data: {
        stripePriceId: subscription.items.data[0].price.id,         // Los datos a actualizar incluyen el ID del precio de Stripe (stripePriceId) 
        stripeCurrentPeriodEnd: new Date(                           // y la fecha de finalización del período actual de la suscripción.
          subscription.current_period_end * 1000,
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
};