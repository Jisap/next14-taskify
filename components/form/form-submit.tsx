"use client"

import { cn } from "@/lib/utils"
import { useFormStatus } from "react-dom"
import { Button } from "../ui/button"

interface FormSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary";
};

export const FormSubmit = ({
  children,
  disabled,
  className,
  variant
}:FormSubmitProps) => {

  const { pending } = useFormStatus();

  return (  
    <Button
      disabled={ pending || disabled }
      type="submit"
      variant="primary"
      size="sm"
      className={cn(className)}
    >
      { children }
    </Button>  
  )
}