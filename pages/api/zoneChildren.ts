import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mock data
  const zoneChildren = [
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

  res.status(200).json(zoneChildren);
}
