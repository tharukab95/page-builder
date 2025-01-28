/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
interface ImageBlockProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  data?: any;
  dataKey?: string;
}

const ImageBlock = ({
  src,
  alt,
  width,
  height,
  data,
  dataKey,
}: ImageBlockProps) => {
  return (
    <img
      src={data?.[dataKey || "src"] || src}
      alt={data?.[dataKey || "alt"] || alt}
      width={width}
      height={height}
      className="max-w-full h-auto"
    />
  );
};

export default ImageBlock;
