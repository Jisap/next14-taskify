"use client"

import { forwardRef } from "react";             // le permite a tu componente exponer un nodo DOM al componente padre con una ref.
import { useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";

interface FormInputProps{
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({ // Función que usa una ref para pasarsela a un componente hijo, 
  id,                                                                    // La ref sera de tipo input, y las props que recibirá será FormInputProps   
  label,                                                                 // Esta ref permite el acceso a su value a traves del ref.currento acceder a un elemento DOM directamente.
  type,
  placeholder,
  required,
  disabled,
  errors,
  className,
  defaultValue,
  onBlur
}, ref ) => {
  const { pending } = useFormStatus();
  return(
    <div className="space-y-2">
      <div className="space-y-1">
        {label ? (
          <Label htmlFor={id} className="text-xs font-semibold text-neutral-700">
            {label}
          </Label>
        ) : null }
        <Input 
          onBlur={onBlur}
          defaultValue={defaultValue}
          ref={ref}
          required={required}
          name={id}
          id={id}
          placeholder={placeholder}
          type={type}
          disabled={pending || disabled}
          className={cn(
            "text-sm px-2 py-1 h-7",
            className
          )}
          aria-describedby={`${id}-error`}
        />
      </div>
      <FormErrors 
        id={id}
        errors={errors}
      />
    </div>  
  )
});

FormInput.displayName = "FormInput"

