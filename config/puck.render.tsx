/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserConfig, components, categories } from "./puck.config";
import {
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
} from "../puck/blocks";
import IteratorRenderer from "../puck/blocks/IteratorRenderer";
import React from "react";

// Add base URL constant
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Client config with render implementations
export const rendererConfig: UserConfig = {
  components: {
    HeadingBlock: {
      ...components.HeadingBlock,
      render: HeadingBlock,
    },
    TextBlock: {
      ...components.TextBlock,
      render: TextBlock,
    },
    ImageBlock: {
      ...components.ImageBlock,
      render: ImageBlock,
    },
    ButtonBlock: {
      ...components.ButtonBlock,
      render: ButtonBlock,
    },
    Iterator: {
      render: IteratorRenderer,
      resolveData: async ({ props }) => {
        try {
          // Add base URL to API endpoints and disable cache
          const response = await fetch(`${BASE_URL}${props?.apiEndpoint}`, {
            cache: "no-store", // Disable cache
            next: { revalidate: 0 }, // Disable revalidation
          });

          if (!response.ok) throw new Error("Failed to fetch items");

          const data = await response.json();
          console.log("Raw API response:", data);

          const items = props?.arrayKey ? data[props?.arrayKey] : data;
          console.log("Processed items before return:", items);

          // Get zone children with cache disabled
          const zoneChildrenResponse = await fetch(
            `${BASE_URL}/api/zoneChildren?id=${props?.id}`,
            {
              cache: "no-store",
              next: { revalidate: 0 },
            }
          );
          const zoneChildrenJson = await zoneChildrenResponse.json();

          return {
            props: {
              ...props,
              items: items,
              children: Array.isArray(zoneChildrenJson) ? zoneChildrenJson : [],
            },
          };
        } catch (error) {
          console.error("Error in resolveData:", error);
          return {
            props: {
              ...props,
              items: [],
              children: [],
            },
          };
        }
      },
      fields: {
        id: {
          type: "text" as const,
          label: "ID",
        },
        apiEndpoint: {
          type: "text" as const,
          label: "API Endpoint",
        },
        arrayKey: {
          type: "text" as const,
          label: "Array Key",
        },
        itemsPerRow: {
          type: "select" as const,
          label: "Items Per Row",
          options: [
            { label: "1", value: 1 },
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "4", value: 4 },
          ],
        },
        items: {
          type: "custom" as const,
          label: "Items",
          render: () => <></>,
        },
        children: {
          type: "custom" as const,
          label: "Children",
          render: () => <></>,
        },
        navigatePath: {
          type: "text" as const,
          label: "Navigate Path",
        },
        slugField: {
          type: "text" as const,
          label: "Slug Field",
        },
      },
      defaultProps: {
        id: "iterator",
        apiEndpoint: "/api/items",
        itemsPerRow: 3 as 1 | 2 | 3 | 4,
        items: [],
        children: [],
        navigatePath: "/product-details",
        slugField: "id",
      },
    },
  },
  categories,
};
