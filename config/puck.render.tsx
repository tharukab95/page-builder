/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserConfig, components, categories } from "./puck.config";
import {
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
} from "../components/blocks";
import IteratorRenderer from "../components/blocks/IteratorRenderer";
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
        // Add base URL to API endpoints
        const response = await fetch(`${BASE_URL}${props?.apiEndpoint}`);
        if (!response.ok) throw new Error("Failed to fetch items");
        const json = await response.json();
        const items = props?.arrayKey ? json[props?.arrayKey] : json;

        const zoneChildrenResponse = await fetch(
          `${BASE_URL}/api/zoneChildren?id=${props?.id}`
        );
        const zoneChildrenJson = await zoneChildrenResponse.json();
        console.log("zoneChildrenJson", zoneChildrenJson);
        const zoneChildren = Array.isArray(zoneChildrenJson)
          ? zoneChildrenJson
          : [];
        return {
          props: {
            ...props,
            items: items || [],
            children: zoneChildren || [],
          },
        };
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
      },
      defaultProps: {
        id: "iterator",
        apiEndpoint: "/api/items",
        itemsPerRow: 3 as 1 | 2 | 3 | 4,
        items: [],
        children: [],
      },
    },
  },
  categories,
};
