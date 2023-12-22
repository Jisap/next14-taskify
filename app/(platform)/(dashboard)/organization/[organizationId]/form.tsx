"use client"

import { createBoard } from "@/actions/create-board"
// import FormInput from "./form-input"

import { useAction } from "@/hooks/use-action"
import { FormInput } from "@/components/form/form-input"
import { FormSubmit } from "@/components/form/form-submit"

const Form = () => {

  const { execute, fieldErrors } = useAction(createBoard, { // Usamos el hook pasandole la action
    onSuccess: (data) => {                                  // Si fue exitosa la validación con Zod, la grabación eb bd y la agregación los campos de errores, onSucess recibe la data
      console.log(data, "SUCCESS!")                         // y se muestra dicha data y un mensaje de éxito
    },
    onError: (error) => {
      console.log(error)
    }
  });

  const onSubmit = (formData: FormData) => {                // Al dar en submit recogemos el contenido del formulario    
    const title = formData.get("title") as string;          // obtenemos el title
    execute({title})                                        // Este title es la TInput data que se manda a execute del useAction -> action -> createBoard
  }                                                         // Con ella se valida el title con Zod, se graba en bd y se le agregan los campos de errores al resultado

  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput 
          label="Board Title"
          errors={fieldErrors} 
          id="title"
        />
      </div>
      <FormSubmit>
        Save
      </FormSubmit>
    </form>
  )
}

export default Form