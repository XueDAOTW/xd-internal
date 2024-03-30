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

  const users = await prisma.user.findMany({
    include: {
      roles: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  res.status(200).json({ data: users });
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

  const {
    email,
    name,
    image,
    ethAddress,
    twitterUsername,
    telegramUsername,
    location,
    hobbies,
    currentCompany,
    currentRole,
    roles,
  } = req.body;

  // TODO handle unique constraint errrors
  const user = await prisma.user.create({
    data: {
      email,
      name,
      image,
      telegramUsername,
      twitterUsername,
      location,
      hobbies,
      currentCompany,
      currentRole,
      ethAddress: ethAddress.toLowerCase(),
      roles: roles && {
        connect: roles.map((role: any) => ({ id: role.id })),
      },
    },
    include: {
      roles: true,
    },
  });
  res.status(200).json({ data: user });
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
