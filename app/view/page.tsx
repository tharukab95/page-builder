
import { Render, resolveAllData } from "@measured/puck";
import { rendererConfig } from "../../config/puck.render";

const initialData = {
  content: [
    {
      type: "HeadingBlock",
      props: {
        title: "Heading",
        size: "medium",
        id: "HeadingBlock-25fbcae4-d1c5-4f29-a583-8ad67beef9e5",
      },
    },
    {
      type: "Iterator",
      props: {
        id: "Iterator-7bdda8f2-9603-49f2-90d6-d0167d26c387",
        apiEndpoint: "/api/items",
        itemsPerRow: 3,
        arrayKey: "",
      },
    },
  ],
  root: {
    props: {},
  },
  zones: {
    "Iterator-7bdda8f2-9603-49f2-90d6-d0167d26c387:iterator-item": [
      {
        type: "HeadingBlock",
        props: {
          size: "medium",
          id: "HeadingBlock-d1328984-d71a-4907-ab99-ec67695488a5",
          dataKey: "title",
        },
      },
      {
        type: "TextBlock",
        props: {
          content: "Enter your text here",
          id: "TextBlock-c8eda36e-6da8-4b49-95ec-c18939f94a28",
          dataKey: "description",
        },
      },
      {
        type: "ImageBlock",
        props: {
          src: "https://via.placeholder.com/400x300",
          alt: "Placeholder image",
          id: "ImageBlock-af4c162c-1239-492d-a87b-689beb6b9def",
          dataKey: "imageUrl",
          width: 240,
          height: 200,
        },
      },
    ],
  },
};

export default async function ViewPage() {
  const resolvedData = await resolveAllData(initialData, rendererConfig);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Render config={rendererConfig} data={resolvedData} />
    </div>
  );
}
