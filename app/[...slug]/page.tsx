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

  // Read pages data
  const pagesFile = path.join(process.cwd(), "data", "pages.json");
  const pagesData = JSON.parse(fs.readFileSync(pagesFile, "utf8"));

  // Find current page
  const currentPage = pagesData.pages.find((p: any) => p.path === pagePath);

  if (!currentPage) {
    notFound();
  }

  const resolvedData = await resolveAllData(currentPage.data, rendererConfig);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Render config={rendererConfig} data={resolvedData} />
    </div>
  );
}

// Generate static paths for all pages
export async function generateStaticParams() {
  const pagesFile = path.join(process.cwd(), "data", "pages.json");
  const pagesData = JSON.parse(fs.readFileSync(pagesFile, "utf8"));

  return pagesData.pages.map((page: any) => ({
    slug: page.path === "/" ? [] : page.path.split("/").filter(Boolean),
  }));
}
