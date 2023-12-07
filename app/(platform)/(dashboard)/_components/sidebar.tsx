'use client'

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { NavItem, Organization } from "./nav-item";


interface SidebarProps {
  storageKey?: string;
};

export const Sidebar = ({ storageKey = "t-sidebar-state" }: SidebarProps) => {

  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey, {}); // State obtenido desde la key: {org1:true, org2:false, etc}

  const {
    organization: activeOrganization,
    isLoaded: isLoadedOrg
  } = useOrganization();                                                                // Organización actual en la que se encuentra el usuario

  const {
    userMemberships,
    isLoaded: isLoadedOrgList
  } = useOrganizationList({ userMemberships: { infinite: true } });                     // Lista de organizaciones de las que el usuario es miembro

  // Estado que muestra como que menus están abiertos ["org1", "org3", "org8"]
  const defaultAccordionValue: string[] = Object.keys(expanded).reduce((acc: string[], key: string) => { 
    if (expanded[key]) {  // Si la org en la posición iterada existe = true
      acc.push(key)       // se agrega a string[]            
    }
    return acc;           // Se retorna ese string[orgs]
  }, []);

  const onExpand = (id: string) => { // Cambia al contrario el value del state de cada org
    setExpanded((curr) => ({
      ...curr,
      [id]: !expanded[id]
    }))
  };

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">
          Workspaces
        </span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto"
        >
          <Link href="/select-org">
            <Plus
              className="h-4 w-4"
            />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {userMemberships.data.map(({ organization }) => ( // iteramos la lista de organizaciones a las que el usuario es miembro
          <NavItem
            key={organization.id}
            isActive={activeOrganization?.id === organization.id}
            isExpanded={expanded[organization.id]}
            organization={organization as Organization}
            onExpand={onExpand}
          />
        ))}
      </Accordion>
    </>
  )
}

