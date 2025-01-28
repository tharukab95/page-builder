/* eslint-disable @typescript-eslint/no-explicit-any */
interface ButtonBlockProps {
  label: string;
  url: string;
  variant?: "primary" | "secondary";
  data?: any;
  dataKey?: string;
}

const ButtonBlock = ({
  label,
  url,
  variant = "primary",
  data,
  dataKey,
}: ButtonBlockProps) => {
  const styles = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-200 text-gray-800",
  };

  return (
    <a
      href={url}
      className={`px-4 py-2 rounded ${styles[variant as keyof typeof styles]}`}
    >
      {data?.[dataKey || "label"] || label}
    </a>
  );
};

export default ButtonBlock;
