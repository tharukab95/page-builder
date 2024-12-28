/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { GetStaticPaths } from "next";

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

interface DynamicPageConfig {
  apiEndpoint: string;
  arrayKey: string;
  idKey: string;
}

interface Page {
  path: string;
  title: string;
  data: any;
  isDynamic?: boolean;
  dynamicConfig?: DynamicPageConfig;
}

interface PagesData {
  pages: Page[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("API Request received:", {
    method: req.method,
    body: req.body,
  });

  switch (req.method) {
    case "GET":
      try {
        const data = JSON.parse(fs.readFileSync(PAGES_FILE, "utf8"));
        res.status(200).json(data);
      } catch (error) {
        console.error("Failed to read pages:", error);
        res.status(500).json({ error: "Failed to read pages" });
      }
      break;

    case "POST":
      try {
        // Read existing pages
        let pagesData: PagesData;
        try {
          pagesData = JSON.parse(fs.readFileSync(PAGES_FILE, "utf8"));
          console.log("Existing pages data:", pagesData);
        } catch (error) {
          console.log("No existing pages file, initializing new one");
          pagesData = { pages: [] };
        }

        // Parse the new page data from request body
        let newData: Page;
        try {
          newData =
            typeof req.body === "string" ? JSON.parse(req.body) : req.body;
          console.log("Parsed new page data:", newData);
        } catch (error) {
          console.error("Failed to parse request body:", error);
          return res.status(400).json({ error: "Invalid request body" });
        }

        // Validate required fields
        if (!newData.path || !newData.title) {
          console.error("Missing required fields:", {
            path: newData.path,
            title: newData.title,
          });
          return res.status(400).json({ error: "Missing required fields" });
        }

        // Ensure data structure
        newData = {
          path: newData.path,
          title: newData.title,
          data: newData.data || { content: [], root: {}, zones: {} },
          isDynamic: Boolean(newData.isDynamic),
          dynamicConfig: newData.isDynamic
            ? {
                apiEndpoint: newData.dynamicConfig?.apiEndpoint || "",
                arrayKey: newData.dynamicConfig?.arrayKey || "",
                idKey: newData.dynamicConfig?.idKey || "",
              }
            : undefined,
        };

        console.log("Processed new page data:", newData);

        // Update existing page or add new page
        const existingPageIndex = pagesData.pages.findIndex(
          (p: Page) => p.path === newData.path
        );

        if (existingPageIndex >= 0) {
          console.log("Updating existing page at index:", existingPageIndex);
          pagesData.pages[existingPageIndex] = {
            ...pagesData.pages[existingPageIndex],
            ...newData,
          };
        } else {
          console.log("Adding new page");
          pagesData.pages.push(newData);
        }

        // Write updated pages to file
        try {
          fs.writeFileSync(PAGES_FILE, JSON.stringify(pagesData, null, 2));
          console.log("Successfully wrote to pages file");
        } catch (error) {
          console.error("Failed to write to pages file:", error);
          return res.status(500).json({ error: "Failed to save page data" });
        }

        res.status(200).json({
          message: "Page saved successfully",
          page: newData,
        });
      } catch (error) {
        console.error("Error in POST handler:", error);
        res.status(500).json({ error: "Failed to save page" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
