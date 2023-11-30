import { authMiddleware } from "@clerk/nextjs";

// Todas las rutas están protegidas por el middleware de autenticación de Clerk,
// con la excepción de las rutas internas / _next / y los archivos estáticos.
// Los archivos estáticos se detectan haciendo coincidir rutas que terminan en.+\..+.

export default authMiddleware({
  publicRoutes: ["/"]
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
