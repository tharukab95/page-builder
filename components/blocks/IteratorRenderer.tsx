"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

interface IteratorRenderProps {
  id: string;
  apiEndpoint: string;
  arrayKey?: string;
  itemsPerRow?: 1 | 2 | 3 | 4;
  puck: {
    renderDropZone: (props: { zone: string }) => React.ReactNode;
  };
}

const IteratorRenderer = ({
  id,
  apiEndpoint,
  arrayKey,
  itemsPerRow = 3,
  puck,
}: IteratorRenderProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error("Failed to fetch items");

        const json = await response.json();
        const data = arrayKey ? json[arrayKey] : json;
        setItems(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch items"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [apiEndpoint, arrayKey]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("${id}:iterator-item", `${id}:iterator-item`);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
        gap: "1rem",
        padding: "1rem",
        border: "2px dashed #4a90e2",
        borderRadius: "4px",
        background: "rgba(74, 144, 226, 0.1)",
        position: "relative",
      }}
    >
      {/* {items.map((item, index) => (
        <div key={index}>
          {puck?.renderDropZone({
            zone: `${id}:iterator-item`,
          })}
        </div>
      ))} */}
      {puck.renderDropZone({
        zone: `iterator-item`,
      })}
    </div>
  );
};

export default IteratorRenderer;
