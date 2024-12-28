/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Puck } from "@measured/puck";
import { useEffect, useState } from "react";
import { clientConfig } from "../../config/puck.client";
import "@measured/puck/puck.css";

interface Page {
  path: string;
  title: string;
  data: any;
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
      setKey((k) => k + 1);
    }
  };

  const savePageData = async (pageData: Page) => {
    try {
      await fetch("/api/pages", {
        method: "POST",
        body: JSON.stringify(pageData),
      });
      await fetchPages();
    } catch (error) {
      console.error("Failed to save page:", error);
      throw error;
    }
  };

  const createNewPage = async () => {
    const path = window.prompt("Enter page path (e.g., /about):");
    if (!path) return;

    const title = window.prompt("Enter page title:", "New Page");
    if (!title) return;

    const emptyData = { content: [], root: {}, zones: {} };
    const newPath = path.startsWith("/") ? path : `/${path}`;

    // Set empty state first
    setData(emptyData);
    setCurrentPage(newPath);

    // Then save to API
    const newPage = {
      path: newPath,
      title,
      data: emptyData,
    };

    try {
      await savePageData(newPage);
    } catch (_) {
      alert("Failed to create page");
    }
  };

  const savePage = async () => {
    try {
      const pageTitle = window.prompt(
        "Enter page title:",
        pages.find((p) => p.path === currentPage)?.title || "New Page"
      );

      if (!pageTitle) return;

      const pageData = {
        path: currentPage,
        title: pageTitle,
        data: data,
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
              {page.title} ({page.path})
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
