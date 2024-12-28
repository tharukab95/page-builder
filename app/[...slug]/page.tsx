// This file should be identical to app/view/page.tsx
// It handles dynamic routes for all pages except the home page

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Render, resolveAllData } from "@measured/puck";
import { rendererConfig } from "../../config/puck.render";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

interface PageProps {
  params: { slug: string[] };
}

export default async function ViewPage({ params }: PageProps) {
  const pagePath = "/" + (params.slug?.join("/") || "");
  const pagesFile = path.join(process.cwd(), "data", "pages.json");
  const pagesData = JSON.parse(fs.readFileSync(pagesFile, "utf8"));

  // Find dynamic template page or exact page
  const page = pagesData.pages.find((p: any) => {
    if (p.isDynamic) {
      // Check if the current path matches the dynamic template pattern
      const templatePath = p.path.split("/")[1]; // e.g., "product-details" from "/product-details"
      const currentPath = params.slug[0]; // First segment of the current path
      return templatePath === currentPath;
    }
    return p.path === pagePath;
  });

  if (!page) {
    console.log("Page not found:", pagePath);
    notFound();
  }

  let pageData = page.data;

  // If it's a dynamic page, fetch the specific item data
  if (page.isDynamic && page.dynamicConfig) {
    try {
      console.log("Fetching dynamic data for:", page.path);
      const { apiEndpoint, arrayKey, idKey } = page.dynamicConfig;
      const slug = params.slug[params.slug.length - 1]; // Get the last segment as the dynamic ID

      console.log(
        "Fetching from:",
        `${process.env.NEXT_PUBLIC_BASE_URL}${apiEndpoint}`
      );
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${apiEndpoint}`,
        { next: { revalidate: 0 } } // Disable cache for development
      );

      if (!response.ok) {
        console.error("API response not OK:", response.status);
        throw new Error("Failed to fetch items");
      }

      const data = await response.json();
      console.log("API response data:", data);

      const items = arrayKey ? data[arrayKey] : data;
      console.log("Filtered items:", items);
      console.log("Looking for item with", idKey, "=", slug);

      const item = items.find((i: any) => String(i[idKey]) === slug);
      console.log("Found item:", item);

      if (!item) {
        console.log("Item not found with", idKey, "=", slug);
        notFound();
      }

      // Add the item data to the page context
      pageData = {
        ...pageData,
        dynamicData: item,
      };
    } catch (error) {
      console.error("Failed to fetch dynamic data:", error);
      throw error; // Let Next.js handle the error
    }
  }

  const resolvedData = await resolveAllData(pageData, rendererConfig);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Render config={rendererConfig} data={resolvedData} />
    </div>
  );
}

// Generate static paths for all pages including dynamic ones
export async function generateStaticParams() {
  const pagesFile = path.join(process.cwd(), "data", "pages.json");
  const pagesData = JSON.parse(fs.readFileSync(pagesFile, "utf8"));

  const paths: { slug: string[] }[] = [];

  for (const page of pagesData.pages) {
    if (page.isDynamic && page.dynamicConfig) {
      // Fetch data for dynamic pages
      const { apiEndpoint, arrayKey, idKey } = page.dynamicConfig;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${apiEndpoint}`
        );
        const data = await response.json();
        const items = arrayKey ? data[arrayKey] : data;

        // Add path for each item
        items.forEach((item: any) => {
          const pathSegments = page.path.split("/").filter(Boolean);
          paths.push({
            slug: [...pathSegments, String(item[idKey])],
          });
        });
      } catch (error) {
        console.error(`Failed to fetch data for ${page.path}:`, error);
      }
    } else {
      // Add static pages
      paths.push({
        slug: page.path === "/" ? [] : page.path.split("/").filter(Boolean),
      });
    }
  }

  return paths;
}
