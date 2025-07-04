import {
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import React, { useCallback, useRef, useState } from "react";
import Text from "./Text";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import type { Control } from "react-hook-form";
import { CloudUpload } from "lucide-react";

type FileUploadPropsType = {
  name: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  control: Control<any>;
  label: string | React.ReactNode;
  accept?: string;
};

const FileUpload = ({
  name,
  label,
  control,
  // className,
  // placeholder,
  required = false,
  accept,
}: FileUploadPropsType) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (
      e: React.DragEvent<HTMLDivElement>,
      onChange: (file: File | null) => void
    ) => {
      e.preventDefault();
      e.stopPropagation();

      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onChange(e.dataTransfer.files[0]);
      }
    },
    []
  );

  return (
    <FormField
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={(e) => handleDrop(e, field.onChange)}
            className={cn(
              "border-dashed border rounded-md border-[#A6ABC8] flex flex-col justify-center items-center h-64 transition-colors",
              dragActive && "bg-gray-100 border-blue-500"
            )}
          >
            <CloudUpload size={32} className="text-[#26A69A] mb-3" />
            <Text className="font-medium text-gray-700">
              {dragActive
                ? "Drop your file here..."
                : " Drag and drop your images here"}
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              or click to browse from your computer
            </Text>

            <FormControl>
              <Input
                hidden
                type="file"
                ref={inputRef}
                id="file-upload"
                accept={accept}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    field.onChange(e.target.files[0]);
                  } else {
                    field.onChange(null);
                  }
                }}
              />
            </FormControl>
            <Label
              htmlFor="file-upload"
              className="px-4 py-2 text-sm font-medium text-[#26A69A] border border-[#26A69A] rounded-md cursor-pointer hover:bg-[#26A69A]/10"
            >
              Choose Files
            </Label>

            <Text className="text-sm text-gray-400 mt-3">
              Maximum 5 images (PNG, JPG up to 5MB each)
            </Text>
            {field.value?.name && (
              <Text type="caption" className="mt-2">
                Selected File: {field.value.name}
              </Text>
            )}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileUpload;
