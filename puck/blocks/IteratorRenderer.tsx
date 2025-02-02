/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { HeadingBlock, TextBlock, ImageBlock, ButtonBlock } from ".";

interface IteratorRenderProps {
  id: string;
  apiEndpoint: string;
  arrayKey?: string;
  itemsPerRow?: 1 | 2 | 3 | 4;
  items: any[];
  allow?: string[];
  children?: any[];
  puck?: {
    renderDropZone: (props: { zone: string }) => React.ReactNode;
  };
  navigatePath?: string;
  slugField?: string;
}

export default function IteratorRenderer({
  id,
  apiEndpoint,
  arrayKey,
  itemsPerRow = 3,
  items = [],
  children = [],
  puck,
  navigatePath,
  slugField,
}: IteratorRenderProps) {
  console.log("IteratorRenderer received props:", {
    id,
    apiEndpoint,
    arrayKey,
    itemsPerRow,
    items,
    children,
    navigatePath,
    slugField,
  });

  // const iteratorItems = appState.data.zones?.[`${id}:iterator-item`] || [];
  const iteratorItems = [
    {
      type: "HeadingBlock",
      props: {
        title: "Heading",
        size: "medium",
        id: "HeadingBlock-6c8945ea-a6a8-49b3-a92d-9e50e3516e57",
        dataKey: "title",
      },
    },
    {
      type: "ImageBlock",
      props: {
        src: "https://via.placeholder.com/400x300",
        alt: "Placeholder image",
        width: 400,
        height: 300,
        id: "ImageBlock-f7883b94-dc84-44cc-a2d5-9a360beccafa",
        dataKey: "imageUrl",
      },
    },
  ];

  // console.log("renderer-iteratorItems", iteratorItems);

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
      {items?.map((item: any, index: number) => {
        console.log(`Renderer Item ${index}:`, item);
        console.log(
          `Renderer Item[${slugField}]:`,
          item[slugField as keyof typeof item]
        );

        return (
          <div key={index}>
            <Link
              href={`${navigatePath}/${item[slugField as keyof typeof item]}`}
            >
              {children?.map((componentData: any, compIndex: number) =>
                renderComponent(componentData, index, compIndex)
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
