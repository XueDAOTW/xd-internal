import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { Role } from "@xd/database";
import { authOptions } from "../auth/[...nextauth]";

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const roles = await prisma.role.findMany();
  res.status(200).json({ data: roles });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const adminRole = session.user.roles.find(
    (role: Role) => role.name === "admin",
  );
  if (!adminRole) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { name } = req.body;
  const role = await prisma.role.create({
    data: {
      name,
    },
  });
  res.status(200).json({ data: role });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    await handleGetRequest(req, res);
  } else if (req.method === "POST") {
    await handlePostRequest(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
