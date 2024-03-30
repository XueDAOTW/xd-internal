import { getNFTContract } from "@/utils/env";
import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const contract = getNFTContract();
  const user = await prisma.user.findUnique({
    where: {
      id: req.query.id as string,
    },
  });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  // TODO: check multiple seasons
  const results = [];
  const balanceOf = await contract.balanceOf(user.ethAddress, 1);
  const hasS1NFT = balanceOf > BigInt(0);
  if (hasS1NFT) {
    results.push(1);
  }
  res.status(200).json({ data: results });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    await handleGetRequest(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
