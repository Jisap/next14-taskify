'use client'

import { useOrganizationList } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { useEffect } from "react"


export const OrgControl = () => {

  const params = useParams();
  const {setActive } = useOrganizationList();

  useEffect(() => {
  
    if(!setActive) return;                            // Si no hay una organización seleccionada return 

    setActive({
      organization: params.organizationId as string   // Si si la hay procedemos a seleccionar una con la que venga por url
    })
  
  },[setActive, params.organizationId])



  return null
    
  
}

