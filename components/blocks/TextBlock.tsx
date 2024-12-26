/* eslint-disable @typescript-eslint/no-explicit-any */
interface TextBlockProps {
  content: string;
  data?: any;
  dataKey?: string;
}

const TextBlock = ({ content, data, dataKey }: TextBlockProps) => {
  return (
    <p className="text-base leading-relaxed">
      {data?.[dataKey || "content"] || content}
    </p>
  );
};

export default TextBlock;
