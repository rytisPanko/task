import { PrismaClient } from '@prisma/client'


//gamybos aplinkoje (production), kiekvieną kartą, 
//kai kodas bus vykdomas, bus sukurta nauja PrismaClient instancija.
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

declare global {
  var prisma: PrismaClient | undefined;
}