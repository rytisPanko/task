import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";   //kbiblioteka, dirbti su duomenų baze,


//naudoja prisma , kad gautų visus vartotojus iš duomenų bazės. 

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({});
  return users;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const users = await getAllUsers();
        return res.json(users)
      default:
        break;
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message })
  }
}