import { z } from "zod";



export type FieldErrors<T> = {                    // Tipo genérico para FieldErrors
  [K in keyof T]?: string[];                      // está creando un tipo donde cada propiedad es una clave del tipo T, 
}                                                 // y el valor de cada propiedad es un arreglo opcional de cadenas.

export type ActionState<TInput, TOutput> = {      // ActionState describe el estado de una acción, 
  fieldErrors?: FieldErrors<TInput>               // que puede contener errores de campo, un mensaje de error general o datos de salida.    
  error?: string | null;
  data?: TOutput;
}

// La función createSafeAction encapsula la lógica común de validación y manejo de errores, permitiendo que el código cliente se enfoque en la implementación específica del handler

export const createSafeAction = <TInput, TOutput>( 
  schema: z.Schema<TInput>,                                                 // Esquema de validación que define estructura y restricciones de los datos de entrada (TInput)
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>> // Toma los datos validados y devuelve un objeto ActionState que describe el state de la action (TOutput)  
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {   // createSafeAction devuelve otra función que toma los datos (TInput) y devuelve una promesa de ActionState
    
    const validationResult = schema.safeParse(data);                                      // Valida los datos del formulario
    
    if(!validationResult.success){                                                        // Si no fueron validados
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<TInput>  // se devuelve un ActionState que contiene errores de campo (fieldErrors)
      }
    }

    return handler(validationResult.data);   // Si la validación es exitosa se llama al handler con los datos validados. El handler devolverá un objeto ActionState con datos de salida (TOutput)
  }
}