import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mock data
  const items = [
    {
      title: "Item 1",
      description: "Description for item 1",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9SRRmhH4X5N2e4QalcoxVbzYsD44C-sQv-w&s",
      buttonText: "Learn More",
    },
    {
      title: "Item 2",
      description: "Description for item 2",
      imageUrl:
        "https://www.shutterstock.com/image-photo/calm-weather-on-sea-ocean-600nw-2212935531.jpg",
      buttonText: "Learn More",
    },
    {
      title: "Item 3",
      description: "Description for item 3",
      imageUrl:
        "https://t3.ftcdn.net/jpg/06/15/49/68/360_F_615496890_W34yB8VDE6n5pehb5QCt1ek5oEvRo9qA.jpg",
      buttonText: "Learn More",
    },
  ];

  res.status(200).json(items);
}
