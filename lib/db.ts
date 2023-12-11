import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined; // Se declara globalmente una variable llamada prisma que puede ser de tipo PrismaClient o undefined.
}


// Este código está creando y exportando una instancia de PrismaClient llamada db, 
// y si estás en un entorno de desarrollo, también configura globalmente la variable prisma para que sea accesible fácilmente.

export const db = globalThis.prisma || new PrismaClient();  

if(process.env.NODE_ENV !== "production") globalThis.prisma = db; 