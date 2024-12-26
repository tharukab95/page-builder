/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DropZone, usePuck } from "@measured/puck";
import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { clientConfig } from "../../config/puck.client";

interface IteratorProps {
  id: string;
  apiEndpoint?: string;
  arrayKey?: string;
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

const Iterator = ({
  id,
  apiEndpoint = "/api/items",
  arrayKey,
  itemsPerRow = 3,
}: IteratorProps) => {
  const { appState } = usePuck();

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

      const json = await response.json();

      const items = arrayKey ? json[arrayKey] : json;
      if (!Array.isArray(items)) throw new Error("Data is not an array");
      console.log("Fetched data:", items);
      setFetchState({
        items: items,
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
  }, [apiEndpoint, arrayKey]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const { items, loading, error } = fetchState;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("id", id);

  console.log(
    "appState.data.zones?.[`${id}:iterator-item`]",
    appState.data.zones?.[`${id}:iterator-item`]
  );

  console.log("appState.data.zones", appState.data.zones);

  const iteratorItems = appState.data.zones?.[`${id}:iterator-item`] || [];

  console.log("iteratorItems", iteratorItems);

  const renderComponent = (componentData: any) => {
    const Component =
      clientConfig.components[
        componentData.type as keyof typeof clientConfig.components
      ].render;
    return <Component {...componentData.props} />;
  };

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
      {items.map((item, index) => (
        <div key={index}>
          {index === 0 ? (
            <DropZone zone="iterator-item">
              {/* Render child components with data binding */}
            </DropZone>
          ) : (
            // Clone the children from the first item for other items
            iteratorItems.map((componentData) =>
              renderComponent({
                ...componentData,
                props: { ...componentData.props, data: item },
              })
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default Iterator;
