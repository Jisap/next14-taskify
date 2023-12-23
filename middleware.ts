import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Todas las rutas están protegidas por el middleware de autenticación de Clerk,
// con la excepción de las rutas internas / _next / y los archivos estáticos.
// Los archivos estáticos se detectan haciendo coincidir rutas que terminan en.+\..+.

export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth(auth, req){

    if (auth.userId && auth.isPublicRoute) {    // Caso 1: Usuario autenticado en una ruta pública:

      let path = "/select-org";                 // path por defecto para selección de una orgId

      if(auth.orgId){                           // Si hay un orgId (organización) 
        path=`/organization/${auth.orgId}`      // redirección a esa orgId
      }

      const orgSelection = new URL(path, req.url);  //  Sino hay orgId 
      return NextResponse.redirect(orgSelection);   //  se redirige a la selección de organización que haga el usuario logueado (req.url)
    }

    if (!auth.userId && !auth.isPublicRoute) {                // Caso 2: Usuario no autenticado en una ruta no pública:
      return redirectToSignIn({ returnBackUrl: req.url })     // se redirige al inicio de sesión
    }

    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {   // Caso 3: Usuario autenticado sin orgId en una ruta no válida:
      const orgSelection = new URL("/select-org", req.url);                       // se redirige a la selección de organización.
      return NextResponse.redirect(orgSelection);
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
