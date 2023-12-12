"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
  errors?: {
    title?: string[];
  },
  message?: string | null;
}

const CreateBoard = z.object({                                            // Esquema de validación
  title: z.string().min(3, {
    message: "Minimun length of 3 letters is required"
  })
})

export async function create(prevState: State, formData: FormData) {
  
  const validatedFields = CreateBoard.safeParse({                         // Validación del campo "title" del formulario
    title: formData.get("title")
  });

  if(!validatedFields.success){                                           // Si la validación no tuvo éxito
    return {                                                              // se devuelve un objeto que modifica el estado en form.tsx
      errors: validatedFields.error.flatten().fieldErrors,                // con los errores
      message: "Missing fields."                                          // y un mensaje
    }
  }

  const { title } = validatedFields.data;                                 // Si la validación si tuvo éxito extraemos el título validado

  try {
    await db.board.create({                                               // Creación en bd dentro de la tabla "board" de la prop title con su value
      data: {
        title
      }
    });
  } catch (error) {
    return {
      message: "Database Error"
    }
  }

  revalidatePath("/organization/org_2YzmFdfudXQjhb3mjhSvy4rdF0a")
  redirect("/organization/org_2YzmFdfudXQjhb3mjhSvy4rdF0a")
}