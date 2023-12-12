"use client"

{/* action para crear un board */ }
import { create } from "@/actions/create-Board"
import { Button } from "@/components/ui/button"
import { useFormState } from "react-dom"
import FormInput from "./form-input"
import { FormButton } from "./form-button"

const Form = () => {

  const initialState = { message: "", errors: {}};
  const [state, dispatch] = useFormState(create, initialState); // useFormState recibe un state y la función que lo modifica

  return (
    <form action={dispatch}>
      <div className="flex flex-col space-y-2">
       <FormInput errors={state?.errors} />
      </div>
      <FormButton />
    </form>
  )
}

export default Form