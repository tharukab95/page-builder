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
// import { clientConfig } from "../../config/puck.client";
import { ButtonBlock, HeadingBlock, ImageBlock, TextBlock } from ".";
import Link from "next/link";

interface IteratorProps {
  id: string;
  apiEndpoint?: string;
  arrayKey?: string;
  itemsPerRow?: 1 | 2 | 3 | 4;
  navigatePath?: string;
  slugField?: string;
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
  navigatePath,
  slugField,
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
      const response = await fetch(apiEndpoint, {
        cache: "no-store",
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      const json = await response.json();
      const items = arrayKey ? json[arrayKey] : json;
      if (!Array.isArray(items)) throw new Error("Data is not an array");

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

  // console.log("id", id);

  // console.log(
  //   "appState.data.zones?.[`${id}:iterator-item`]",
  //   appState.data.zones?.[`${id}:iterator-item`]
  // );

  // console.log("appState.data.zones", appState.data.zones);

  const iteratorItems = appState.data.zones?.[`${id}:iterator-item`] || [];

  // console.log("iteratorItems", iteratorItems);

  const renderComponent = (
    componentData: any,
    index: number,
    compIndex: number
  ) => {
    const components = {
      HeadingBlock,
      TextBlock,
      ImageBlock,
      ButtonBlock,
    };

    const Component = components[componentData.type as keyof typeof components];
    if (!Component) {
      console.warn(`Component ${componentData.type} not found`);
      return null;
    }

    const { props: componentProps } = componentData;
    return (
      <Component
        key={`${index}-${compIndex}`}
        {...componentProps}
        data={items[index]}
      />
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
        gap: "1rem",
        padding: "1rem",
        position: "relative",
      }}
    >
      {items.map((item, index) => {
        // Debug logging for each item
        console.log(`Item ${index}:`, item);
        console.log(`Slug field:`, slugField);
        console.log(`Navigate path:`, navigatePath);
        console.log(
          `Item[${slugField}]:`,
          item[slugField as keyof typeof item]
        );

        return (
          <div key={index}>
            {navigatePath && slugField ? (
              <Link
                href={`${navigatePath}/${item[slugField as keyof typeof item]}`}
              >
                {index === 0 ? (
                  <DropZone zone={`iterator-item`}>
                    {/* Render child components with data binding */}
                  </DropZone>
                ) : (
                  // Clone the children from the first item for other items
                  iteratorItems.map((componentData, compIndex) =>
                    renderComponent(componentData, index, compIndex)
                  )
                )}
              </Link>
            ) : (
              <>
                {index === 0 ? (
                  <DropZone zone="iterator-item">
                    {/* Render child components with data binding */}
                  </DropZone>
                ) : (
                  // Clone the children from the first item for other items
                  iteratorItems.map((componentData, compIndex) =>
                    renderComponent(componentData, index, compIndex)
                  )
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Iterator;
