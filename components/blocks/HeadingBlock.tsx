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
  const sizes = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-4xl",
  };

  return (
    <h2 className={`font-bold ${sizes[size]}`}>
      {data?.[dataKey || "title"] || title}
    </h2>
  );
};

export default HeadingBlock;
