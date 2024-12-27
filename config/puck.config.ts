/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Config } from "@measured/puck";

// Define types for our components
export type ComponentProps = {
  HeadingBlock: {
    title?: string;
    size?: "small" | "medium" | "large";
    data?: any;
    dataKey?: string;
  };
  TextBlock: {
    content: string;
    data?: any;
    dataKey?: string;
  };
  ImageBlock: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    data?: any;
    dataKey?: string;
  };
  ButtonBlock: {
    label: string;
    url: string;
    variant?: "primary" | "secondary";
    dataKey?: string;
  };
  Iterator: {
    id: string;
    apiEndpoint: string;
    arrayKey?: string;
    itemsPerRow: 1 | 2 | 3 | 4;
    items: any[];
    children?: any[];
  };
};

// Create shared config type
export type UserConfig = Config<ComponentProps>;

// Component definitions
export const components = {
  HeadingBlock: {
    fields: {
      title: {
        type: "text" as const,
        label: "Title",
        defaultValue: "Heading",
      },
      dataKey: {
        type: "text" as const,
        label: "Data Key",
        defaultValue: "title",
      },
      size: {
        type: "select" as const,
        options: [
          { label: "Small", value: "small" },
          { label: "Medium", value: "medium" },
          { label: "Large", value: "large" },
        ],
      },
    },
    defaultProps: {
      title: "Heading",
      size: "medium" as const,
    },
  },
  TextBlock: {
    fields: {
      content: { type: "textarea" as const },
      dataKey: {
        type: "text" as const,
        label: "Data Key",
        defaultValue: "description",
      },
    },
    defaultProps: {
      content: "Enter your text here",
    },
  },
  ImageBlock: {
    fields: {
      src: { type: "text" as const },
      alt: { type: "text" as const },
      width: {
        type: "number" as const,
        label: "Width",
        defaultValue: 400,
      },
      height: {
        type: "number" as const,
        label: "Height",
        defaultValue: 300,
      },
      dataKey: {
        type: "text" as const,
        label: "Data Key",
        defaultValue: "imageUrl",
      },
    },
    defaultProps: {
      src: "https://via.placeholder.com/400x300",
      alt: "Placeholder image",
      width: 400,
      height: 300,
    },
  },
  ButtonBlock: {
    fields: {
      label: { type: "text" as const },
      url: { type: "text" as const },
      dataKey: {
        type: "text" as const,
        label: "Data Key",
        defaultValue: "buttonText",
      },
      variant: {
        type: "select" as const,
        options: [
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
        ],
      },
    },
    defaultProps: {
      label: "Click me",
      url: "#",
      variant: "primary" as const,
    },
  },
  Iterator: {
    fields: {
      id: {
        type: "text" as const,
        defaultValue: "iterator",
      },
      apiEndpoint: { type: "text" as const },
      arrayKey: { type: "text" as const },
      itemsPerRow: {
        type: "select" as const,
        options: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
        ],
      },
    },
    defaultProps: {
      apiEndpoint: "/api/items",
      itemsPerRow: 3,
      arrayKey: "",
    },
  },
};

// Categories for better organization
export const categories: Record<
  string,
  { components: (keyof ComponentProps)[] }
> = {
  layout: {
    components: ["Iterator"],
  },
  content: {
    components: ["HeadingBlock", "TextBlock"],
  },
  media: {
    components: ["ImageBlock"],
  },
  interactive: {
    components: ["ButtonBlock"],
  },
} as const;
