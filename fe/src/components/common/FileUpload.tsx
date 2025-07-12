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
import { toast } from "sonner";

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
    (e: React.DragEvent<HTMLDivElement>, onChange: (files: File[]) => void) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 5) {
          toast.error("Maximum 5 files allowed");
          return;
        }
        onChange(files);
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
              "border-dashed border rounded-md border-[#A6ABC8] flex flex-col justify-center items-center h-72 transition-colors",
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
                multiple
                type="file"
                ref={inputRef}
                id="file-upload"
                accept={accept}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const files = Array.from(e.target.files);
                    if (files.length > 5) {
                      toast.error("Maximum 5 files allowed");
                      return;
                    }
                    if (field.value && field.value.length + files.length > 5) {
                      toast.error(
                        `You can only upload ${
                          5 - field.value.length
                        } more files`
                      );
                      return;
                    }
                    field.onChange(
                      field.value ? [...field.value, ...files] : files
                    );
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

            <Text className="text-sm text-gray-400 mt-3 text-center">
              You can select multiple images. <br /> Maximum 5 images (PNG, JPG
              up to 5MB each)
            </Text>
            {Array.isArray(field.value) && (
              <div className="mt-2 text-sm text-gray-600">
                {field.value.map((file: File, index: number) => (
                  <Text
                    key={file.name + index}
                    type="caption"
                    className="mt-2 text-sm truncate max-w-xs"
                  >
                    Selected File is: {file.name}
                  </Text>
                ))}
              </div>
            )}
            {Array.isArray(field.value) && (
              <div className="mt-2 w-full px-4 max-h-32 overflow-y-auto">
                {field.value.map((file: File, index: number) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between py-1"
                  >
                    <Text type="caption" className="truncate max-w-xs">
                      {file.name}
                    </Text>
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = [...field.value];
                        newFiles.splice(index, 1);
                        field.onChange(newFiles);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileUpload;
