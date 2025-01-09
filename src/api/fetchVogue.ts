import { VercelRequest, VercelResponse } from "@vercel/node"
import fetch from "cross-fetch"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query
  console.log("Before")

  const response = await fetch(url as string, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Host: "graphql.vogue.com",
    },
    referrerPolicy: "origin",
  })

  console.log("After")

  const data = await response.json()
  res.status(200).json(data)
}
