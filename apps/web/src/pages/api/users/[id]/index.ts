import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../../auth/[...nextauth]";

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      id: req.query.id as string,
    },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({ data: user });
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const foundUser = await prisma.user.findUnique({
    where: {
      id: req.query.id as string,
    },
  });
  if (!foundUser) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (session.user.id !== foundUser.id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const {
    email,
    name,
    image,
    twitterUsername,
    telegramUsername,
    location,
    hobbies,
    currentCompany,
    currentRole,
    roles,
  } = req.body;

  const user = await prisma.user.update({
    where: {
      id: req.query.id as string,
    },
    data: {
      name,
      email,
      image,
      twitterUsername,
      telegramUsername,
      location,
      hobbies,
      currentCompany,
      currentRole,
      roles: {
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
  } else if (req.method === "PUT") {
    await handlePutRequest(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
