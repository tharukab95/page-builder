/* eslint-disable @typescript-eslint/no-explicit-any */
import { Render, resolveAllData } from "@measured/puck";
import { rendererConfig } from "../../../config/puck.render";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

interface PageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  console.log("Starting ProductDetailPage with id:", params.id);

  // Fetch product data
  const productRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${params.id}`,
    {
      cache: "no-store",
    }
  );

  if (!productRes.ok) {
    console.error("Product fetch failed:", productRes.status);
    notFound();
  }

  const productData = await productRes.json();
  console.log("Fetched product data:", productData);

  // Read template data
  const pagesFile = path.join(process.cwd(), "data", "pages.json");
  const pagesData = JSON.parse(fs.readFileSync(pagesFile, "utf8"));

  // Find product detail template
  const template = pagesData.pages.find(
    (p: any) => p.path === "/product-details"
  );

  if (!template) {
    console.error("Template not found for /product-details");
    notFound();
  }

  console.log("Found template:", {
    path: template.path,
    content: template.data.content,
  });

  // Create a new data object with the product data
  const pageData = {
    ...template.data,
    content: template.data.content.map((item: any) => ({
      ...item,
      props: {
        ...item.props,
        data: productData,
      },
    })),
    root: {
      ...template.data.root,
      data: productData,
    },
    zones: template.data.zones || {},
  };

  console.log("Processed content:", pageData.content);

  // Resolve data
  const resolvedData = await resolveAllData(pageData, rendererConfig);
  console.log("Resolved data:", {
    hasContent: !!resolvedData.content,
    contentLength: resolvedData.content?.length,
    firstItem: resolvedData.content?.[0],
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Render config={rendererConfig} data={resolvedData} />
    </div>
  );
}
