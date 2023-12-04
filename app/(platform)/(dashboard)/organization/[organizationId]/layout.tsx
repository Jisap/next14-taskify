import React from 'react'
import OrganizationLayout from '../layout';
import { OrgControl } from './_components/org-control';


const OrganizationIdLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <>
      <OrgControl />
      { children }
    </>
  )
}

export default OrganizationIdLayout