/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Puck } from "@measured/puck";
import { useEffect, useState } from "react";
import { clientConfig } from "../../config/puck.client";
import "@measured/puck/puck.css";

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

export default function Editor() {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<string>("/");
  const [data, setData] = useState<any>(null);
  const [key, setKey] = useState(0);

  // Load pages on mount
  useEffect(() => {
    fetchPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/pages");
      const responseData = await response.json();
      setPages(responseData.pages || []);

      // Set initial data for current page
      const currentPageData = responseData.pages.find(
        (p: any) => p.path === currentPage
      );
      if (currentPageData) {
        setData(currentPageData.data);
      } else {
        // If no matching page found, set empty data
        setData({ content: [], root: {}, zones: {} });
      }

      return responseData;
    } catch (error) {
      console.error("Failed to fetch pages:", error);
      // Set default data even on error
      setData({ content: [], root: {}, zones: {} });
      return { pages: [] };
    }
  };

  // Handle page changes
  const handlePageChange = (newPath: string) => {
    const pageData = pages.find((p) => p.path === newPath);
    if (pageData) {
      setCurrentPage(newPath);
      setData(pageData.data);
      // Reset key to force re-render of Puck editor
      setKey((k) => k + 1);
    }
  };

  const savePageData = async (pageData: Page) => {
    try {
      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      await fetchPages();
    } catch (error) {
      console.error("Failed to save page:", error);
      throw error;
    }
  };

  const createNewPage = async () => {
    try {
      console.log("Starting createNewPage..."); // Debug log

      const path = window.prompt(
        "Enter page path (e.g., /about or /product-details):"
      );
      console.log("Entered path:", path); // Debug log
      if (!path) {
        console.log("Path creation cancelled"); // Debug log
        return;
      }

      const title = window.prompt("Enter page title:", "New Page");
      console.log("Entered title:", title); // Debug log
      if (!title) {
        console.log("Title creation cancelled"); // Debug log
        return;
      }

      const isDynamic = window.confirm("Is this a dynamic page template?");
      console.log("Is dynamic page:", isDynamic); // Debug log

      let dynamicConfig: DynamicPageConfig | undefined;

      if (isDynamic) {
        const apiEndpoint = window.prompt(
          "Enter API endpoint (e.g., /api/products):"
        );
        console.log("Entered API endpoint:", apiEndpoint); // Debug log

        const arrayKey =
          window.prompt("Enter array key from API response:") ?? "";
        console.log("Entered array key:", arrayKey); // Debug log

        const idKey = window.prompt(
          "Enter ID field key from items (e.g., id, slug):"
        );
        console.log("Entered ID key:", idKey); // Debug log

        // Only check if apiEndpoint and idKey are provided, arrayKey can be empty
        if (apiEndpoint === null || idKey === null) {
          console.log("Dynamic config creation cancelled"); // Debug log
          return;
        }

        dynamicConfig = {
          apiEndpoint,
          arrayKey: arrayKey, // Use empty string if no array key is needed
          idKey,
        };
      }

      const emptyData = { content: [], root: {}, zones: {} };
      const newPath = path.startsWith("/") ? path : `/${path}`;

      const newPage = {
        path: newPath,
        title,
        data: emptyData,
        isDynamic: Boolean(isDynamic),
        dynamicConfig,
      };

      console.log("Attempting to create new page with data:", newPage); // Debug log

      try {
        const response = await fetch("/api/pages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPage),
        });

        console.log("API Response status:", response.status); // Debug log

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error response:", errorData); // Debug log
          throw new Error(errorData.error || response.statusText);
        }

        const result = await response.json();
        console.log("API Success response:", result); // Debug log

        // Update local state
        await fetchPages(); // Refresh the pages list
        setCurrentPage(newPath);
        setData(emptyData);
        setKey((k) => k + 1); // Force re-render of Puck editor

        alert("Page created successfully!");
      } catch (error: any) {
        console.error("Failed to create page:", error);
        alert(`Failed to create page: ${error.message}`);
        return;
      }
    } catch (error: any) {
      console.error("Error in createNewPage:", error);
      alert(`Error creating page: ${error.message}`);
    }
  };

  const savePage = async () => {
    try {
      const existingPage = pages.find((p) => p.path === currentPage);
      const pageTitle = window.prompt(
        "Enter page title:",
        existingPage?.title || "New Page"
      );

      if (!pageTitle) return;

      const pageData = {
        path: currentPage,
        title: pageTitle,
        data: data,
        // Preserve dynamic page properties
        isDynamic: existingPage?.isDynamic,
        dynamicConfig: existingPage?.dynamicConfig,
      };

      await savePageData(pageData);
      alert("Page saved successfully!");
    } catch (error) {
      alert("Failed to save page");
    }
  };

  // Move loading check here, after all hooks
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: "100vh" }}>
      <div
        style={{
          padding: "8px 16px",
          background: "#f8f8f8",
          borderBottom: "1px solid #eaeaea",
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <select
          value={currentPage}
          onChange={(e) => handlePageChange(e.target.value)}
          style={{ padding: "4px 8px" }}
        >
          {pages.map((page) => (
            <option key={page.path} value={page.path}>
              {page.title} ({page.path}){page.isDynamic ? " [Dynamic]" : ""}
            </option>
          ))}
        </select>
        <button onClick={createNewPage} style={{ padding: "4px 8px" }}>
          New Page
        </button>
        <button onClick={savePage} style={{ padding: "4px 8px" }}>
          Save Page
        </button>
      </div>

      {data && (
        <Puck
          key={key}
          config={clientConfig}
          data={data}
          onPublish={async (newData) => {
            setData(newData);
            await savePage();
          }}
          onChange={setData}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "250px 1fr 300px",
              height: "calc(100% - 49px)", // Adjust for header
              gap: "1px",
              background: "#f0f0f0",
            }}
          >
            <div style={{ background: "#fff", padding: "16px" }}>
              <h3 className="text-lg font-bold mb-4">Components</h3>
              <Puck.Components />
            </div>

            <div
              style={{ background: "#fff", padding: "16px", overflow: "auto" }}
            >
              <Puck.Preview />
            </div>

            <div style={{ background: "#fff", padding: "16px" }}>
              <h3 className="text-lg font-bold mb-4">Properties</h3>
              <Puck.Fields />
            </div>
          </div>
        </Puck>
      )}
    </div>
  );
}
