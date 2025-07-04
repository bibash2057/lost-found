import { useController, type Control } from "react-hook-form";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ReportOptionProps {
  name: string;
  control: Control<any>;
  value: string;
  title: string;
  description: string;
  icon: ReactNode;
}

const ReportOption = ({
  name,
  control,
  value,
  title,
  description,
  icon,
}: ReportOptionProps) => {
  const {
    field: { value: selectedValue, onChange },
  } = useController({
    name,
    control,
  });

  const selected = selectedValue === value;

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={cn(
        "w-full p-6 rounded-md border-2 transition-all text-left",
        selected
          ? "border-[#26A69A] bg-[#26A69A]/5"
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div className="flex flex-col items-center justify-center text-center space-y-2">
        <div
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full text-xl",
            selected ? "text-[#26A69A]" : "text-gray-400"
          )}
        >
          {icon}
        </div>
        <div
          className={cn(
            "font-medium text-base",
            selected ? "text-[#26A69A]" : "text-gray-800"
          )}
        >
          {title}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </button>
  );
};

export default ReportOption;
