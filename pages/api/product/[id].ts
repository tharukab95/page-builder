import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Mock data with id as a property (in production, this would be a DB query)
  const items = [
    {
      id: "1",
      title: "Item 1",
      description: "Description for item 1",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9SRRmhH4X5N2e4QalcoxVbzYsD44C-sQv-w&s",
      buttonText: "Learn More",
    },
    {
      id: "2",
      title: "Item 2",
      description: "Description for item 2",
      imageUrl:
        "https://www.shutterstock.com/image-photo/calm-weather-on-sea-ocean-600nw-2212935531.jpg",
      buttonText: "Learn More",
    },
    {
      id: "3",
      title: "Item 3",
      description: "Description for item 3",
      imageUrl:
        "https://t3.ftcdn.net/jpg/06/15/49/68/360_F_615496890_W34yB8VDE6n5pehb5QCt1ek5oEvRo9qA.jpg",
      buttonText: "Learn More",
    },
  ];

  const product = items.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json(product);
}
