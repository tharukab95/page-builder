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
      resolveFields: ({ props }, { fields, parent }) => {
        console.log("parent", parent);
        // const zoneIndex = parent?.props.id.split(":").pop()?.split("-").pop();

        const context = window[`__ITERATOR_CONTEXT__`];

        console.log("context", context);
        const defaultFields = {
          title: {
            type: "text" as const,
            defaultValue: "hello hello",
          },
          size: components.HeadingBlock.fields.size,
          dataKey: components.HeadingBlock.fields.dataKey,
        };

        return defaultFields;
      },
    },
    TextBlock: {
      ...components.TextBlock,
      render: TextBlock,
      resolveFields: async ({ props }, { fields, parent }) => {
        // const zoneIndex = parent?.props.id
        //   .split(":")
        //   .pop()
        //   ?.match(/iterator-item-(\d+)/)?.[1];
        const context = window[`__ITERATOR_CONTEXT__`];

        return {
          ...fields,
          content: {
            type: "textarea",
            defaultValue:
              context?.data[props.dataKey ?? "description"] || "Enter text",
          },
        };
      },
    },
    ImageBlock: {
      ...components.ImageBlock,
      render: ImageBlock,
      resolveFields: async ({ props }, { fields, parent }) => {
        // const zoneIndex = parent?.props.id
        //   .split(":")
        //   .pop()
        //   ?.match(/iterator-item-(\d+)/)?.[1];
        const context = window[`__ITERATOR_CONTEXT__`];

        return {
          ...fields,
          src: {
            type: "text",
            defaultValue:
              context?.data[props.dataKey ?? "imageUrl"] ||
              "https://via.placeholder.com/400x300",
          },
          alt: {
            type: "text",
            defaultValue: "Image",
          },
        };
      },
    },
    ButtonBlock: {
      ...components.ButtonBlock,
      render: ButtonBlock,
      resolveFields: async ({ props }, { fields, parent }) => {
        const zoneIndex = parent?.props.id
          .split(":")
          .pop()
          ?.match(/iterator-item-(\d+)/)?.[1];
        const context = window[`__ITERATOR_CONTEXT__`];

        return {
          ...fields,
          label: {
            type: "text",
            defaultValue:
              context?.data[props.dataKey ?? "buttonText"] || "Click me",
          },
          url: {
            type: "text",
            defaultValue: "#",
          },
          variant: {
            type: "select",
            options: [
              { label: "Primary", value: "primary" },
              { label: "Secondary", value: "secondary" },
            ],
          },
        };
      },
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
      },
      defaultProps: {
        id: "iterator",
        apiEndpoint: "/api/items",
        itemsPerRow: 3 as 1 | 2 | 3 | 4,
      },
    },
  },
  categories,
};
