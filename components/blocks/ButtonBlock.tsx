interface ButtonBlockProps {
  label: string;
  url: string;
  variant?: "primary" | "secondary";
  dataKey?: string;
}

const ButtonBlock = ({ label, url, variant = "primary" }: ButtonBlockProps) => {
  const styles = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-200 text-gray-800",
  };

  return (
    <a
      href={url}
      className={`px-4 py-2 rounded ${styles[variant as keyof typeof styles]}`}
    >
      {label}
    </a>
  );
};

export default ButtonBlock;
