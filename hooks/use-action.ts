import { useCallback, useState } from "react";
import { ActionState, FieldErrors } from '../lib/create-safe-action';


type Action<TInput, TOutput> = (data:TInput) => Promise<ActionState<TInput,TOutput>>

interface UseActionOptions<TOutput>{
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
};

export const useAction = <TInput, TOutput> ( 

  action: Action<TInput, TOutput>,
  options: UseActionOptions<TOutput> = {}

) => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput> | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<TOutput | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = useCallback(                                  // Establece los estados una vez que recibe el title y llama a la action
    async(input: TInput) => {
      setIsLoading(true);                                       

      try {
        const result = await action(input);                     // Se valida con Zod , graba en bd y agrega los campos de errores 

        if(!result){
          return
        }

        setFieldErrors(result.fieldErrors);
        

        if(result.error){
          setError(result.error);
          options.onError?.(result.error)
        }

        if(result.data){
          setData(result.data);
          options.onSuccess?.(result.data)
        }
      } finally {
        setIsLoading(false);
        options.onComplete?.()
      }
    },[action, options]  
  );

  return {
    execute,
    fieldErrors,
    error,
    data,
    isLoading
  }
}