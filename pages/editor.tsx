import { Puck } from "@measured/puck";
import { useEffect, useState } from "react";
import { clientConfig } from "../config/puck.client";
import "@measured/puck/puck.css";

export default function Editor() {
  const [data, setData] = useState(() => {
    // Try to load initial data from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("puck-data");
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return { content: [], root: {} };
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("puck-data", JSON.stringify(data));
  }, [data]);

  return (
    <div style={{ height: "100vh" }}>
      <Puck
        config={clientConfig}
        data={data}
        onPublish={async (data) => {
          // Save to localStorage on publish
          localStorage.setItem("puck-data", JSON.stringify(data));
          alert("Changes saved!");
        }}
        onChange={(data) => {
          // Update state on change
          setData(data);
        }}
      >
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "250px 1fr 300px",
          height: "100%",
          gap: "1px",
          background: "#f0f0f0"
        }}>
          {/* Left sidebar - Component list */}
          <div style={{ background: "#fff", padding: "16px" }}>
            <h3 className="text-lg font-bold mb-4">Components</h3>
            <Puck.Components />
          </div>

          {/* Middle - Preview area */}
          <div style={{ background: "#fff", padding: "16px", overflow: "auto" }}>
            <Puck.Preview />
          </div>

          {/* Right sidebar - Field editor */}
          <div style={{ background: "#fff", padding: "16px" }}>
            <h3 className="text-lg font-bold mb-4">Properties</h3>
            <Puck.Fields />
          </div>
        </div>
      </Puck>
    </div>
  );
} 