/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { DropZone } from "@measured/puck";
import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { useDropzone } from "react-dropzone";

interface IteratorProps {
  apiEndpoint?: string;
  itemsPerRow?: 1 | 2 | 3 | 4;
  allow?: string[];
  puck?: {
    renderDropZone: (props: {
      zone: string;
      props?: Record<string, any>;
    }) => ReactNode;
  };
}

interface FetchState {
  items: any[];
  loading: boolean;
  error: string | null;
}

export const IteratorContext = createContext<{
  data: any;
  dataKey: string;
} | null>(null);

export const useIteratorContext = () => {
  const context = useContext(IteratorContext);
  if (!context) throw new Error("Must be used within IteratorContext");
  return context;
};

// declare global {
//   interface Window {
//     [key: string]: any;
//   }
// }

declare global {
  interface Window {
    __ITERATOR_CONTEXT__?: { data: any; dataKey: string };
  }
}

const Iterator = ({
  apiEndpoint = "/api/items",
  itemsPerRow = 3,
  puck,
}: IteratorProps) => {
  const [fetchState, setFetchState] = useState<FetchState>({
    items: [],
    loading: true,
    error: null,
  });

  // Fetch data from API
  const fetchItems = useCallback(async () => {
    try {
      setFetchState((prev) => ({ ...prev, loading: true }));
      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      setFetchState({
        items: data,
        loading: false,
        error: null,
      });
    } catch (err) {
      setFetchState({
        items: [],
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch items",
      });
    }
  }, [apiEndpoint]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handle file uploads
  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        try {
          const formData = new FormData();
          acceptedFiles.forEach((file) => {
            formData.append("files", file);
          });

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          // Refresh the items after successful upload
          fetchItems();
        } catch (error) {
          console.error("Upload error:", error);
        }
      }
    },
    [fetchItems]
  );

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    noClick: false,
    noDrag: false,
  });

  //   const determineDataKey = (item: any): string => {
  //     return (
  //       {
  //         HeadingBlock: "title",
  //         TextBlock: "description",
  //         ImageBlock: "imageUrl",
  //         ButtonBlock: "buttonText",
  //       }[
  //         item.type as "HeadingBlock" | "TextBlock" | "ImageBlock" | "ButtonBlock"
  //       ] || ""
  //     );
  //   };

  const { items, loading, error } = fetchState;

  useEffect(() => {
    if (items.length > 0) {
      window.__ITERATOR_CONTEXT__ = {
        data: items[0], // Start with first item
        dataKey: "",
      };
    }
  }, [items]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      {...getRootProps()}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
        gap: "1rem",
        padding: "1rem",
        border: isDragActive ? "2px dashed #4a90e2" : "2px dashed #ccc",
        borderRadius: "4px",
        background: isDragActive ? "rgba(74, 144, 226, 0.1)" : "transparent",
        position: "relative",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.8)",
            zIndex: 1,
          }}
        >
          <p>Drop files here to upload</p>
        </div>
      )}
      {items.map((item, index) => (
        <div key={index} className="iterator-item">
          {(() => {
            window.__ITERATOR_CONTEXT__ = { data: item, dataKey: "" };
            return puck?.renderDropZone({ zone: `item-${index}` });
          })()}
        </div>
      ))}
    </div>
  );
};

export default Iterator;
