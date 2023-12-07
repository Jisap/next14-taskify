"use client"

import { useMobileSidebar } from "@/hooks/use-mobile-sidebar"
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";




export const MobileSidebar = () => {

  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const onOpen = useMobileSidebar((state) => state.onOpen);
  const onClose = useMobileSidebar((state) => state.onClose);
  const isOpen = useMobileSidebar((state) => state.isOpen);

  useEffect(() => {
    setIsMounted(true)
  },[]);

  if(!isMounted){
    return null;
  }

  return (
    <div>
      MobileSidebar
    </div>
  )
}

