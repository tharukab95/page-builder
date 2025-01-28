/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserConfig, components, categories } from "./puck.config";
import {
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  Iterator,
} from "../puck/blocks";

// Client config with render implementations
export const clientConfig: UserConfig = {
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
      render: ({ puck, ...props }) => <Iterator puck={puck} {...props} />,
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
        items: {
          type: "custom" as const,
          label: "Items",
          render: () => <></>,
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
        navigatePath: "/product-details",
        slugField: "id",
      },
    },
  },
  categories,
};
