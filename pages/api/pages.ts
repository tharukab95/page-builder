/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const PAGES_FILE = path.join(process.cwd(), "data", "pages.json");

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), "data"))) {
  fs.mkdirSync(path.join(process.cwd(), "data"));
}

// Initialize empty pages file if it doesn't exist
if (!fs.existsSync(PAGES_FILE)) {
  fs.writeFileSync(
    PAGES_FILE,
    JSON.stringify({
      pages: [
        {
          path: "/",
          title: "Home",
          data: { content: [], root: {}, zones: {} },
        },
      ],
    })
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const data = JSON.parse(fs.readFileSync(PAGES_FILE, "utf8"));
        res.status(200).json(data);
      } catch (_) {
        res.status(500).json({ error: "Failed to read pages" });
      }
      break;

    case "POST":
      try {
        const pagesData = JSON.parse(fs.readFileSync(PAGES_FILE, "utf8"));
        const newData = JSON.parse(req.body);

        // Update existing page or add new page
        const existingPageIndex = pagesData.pages.findIndex(
          (p: any) => p.path === newData.path
        );

        if (existingPageIndex >= 0) {
          pagesData.pages[existingPageIndex] = newData;
        } else {
          pagesData.pages.push(newData);
        }

        fs.writeFileSync(PAGES_FILE, JSON.stringify(pagesData, null, 2));
        res.status(200).json({ message: "Page saved successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to save page" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
