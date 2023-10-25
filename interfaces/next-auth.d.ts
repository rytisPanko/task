import { Session } from "next-auth"


declare module "next-auth" {
  interface Session {
   
    session: Session;
    user: User | AdapterUser;
    token: JWT;
    id: string;
  }
}