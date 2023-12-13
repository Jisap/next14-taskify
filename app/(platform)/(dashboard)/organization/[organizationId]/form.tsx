"use client"

import { createBoard } from "@/actions/create-board"
import FormInput from "./form-input"
import { FormButton } from "./form-button"
import { useAction } from "@/hooks/use-action"

const Form = () => {

  const { execute, FieldErrors } = useAction(createBoard, { // Usamos el hook pasandole la action
    onSuccess: (data) => {                                  // Si fue exitosa la validación con Zod y la agregación los campos de errores 
      console.log(data, "SUCCESS!")                         // mensaje
    },
    onError: (error) => {
      console.log(error)
    }
  });

  const onSubmit = (formData: FormData) => {                // Al dar en submit recogemos el contenido del formulario    
    const title = formData.get("title") as string;          // obtenemos el title
    execute({title})                                        // Este title es la TInput data que se manda a execute -> action -> createBoard
  }                                                         // Con ella se valida el title con Zod y se le agregan los campos de errores 

  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
       <FormInput errors={FieldErrors} />
      </div>
      <FormButton />
    </form>
  )
}

export default Form