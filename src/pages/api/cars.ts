import type { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "cookies-next";
import { V_AUTH_TOKEN } from "@/constants/stringConstants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = getCookie(V_AUTH_TOKEN, { req, res });

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const apiRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cars`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await apiRes.json();
  return res.status(200).json(data);
}