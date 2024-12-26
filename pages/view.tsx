import { Render } from "@measured/puck";
import { useEffect, useState } from "react";
import { clientConfig } from "../config/puck.client";

export default function View() {
  const [data, setData] = useState({ content: [], root: {} });

  useEffect(() => {
    // Load data from localStorage
    const saved = localStorage.getItem("puck-data");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Render config={clientConfig} data={data} />
    </div>
  );
} 