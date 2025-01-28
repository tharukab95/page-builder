/* eslint-disable @typescript-eslint/no-explicit-any */

interface HeadingBlockProps {
  title?: string;
  size?: "small" | "medium" | "large";
  data?: any;
  dataKey?: string;
}

const HeadingBlock = ({
  title,
  size = "medium",
  data,
  dataKey,
}: HeadingBlockProps) => {
  console.log("HeadingBlock props:", { title, size, data, dataKey });

  // Use data binding if dataKey is provided and data exists
  const displayTitle = dataKey && data ? data[dataKey] : title;
  console.log("HeadingBlock resolved title:", displayTitle);

  const sizes = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-4xl",
  };

  return <h2 className={`${sizes[size]} font-bold mb-4`}>{displayTitle}</h2>;
};

export default HeadingBlock;
