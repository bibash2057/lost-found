import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Control } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import Text from "./Text";

type FormInputPropsType = {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "url" | "date";
  className?: string;
  required?: boolean;
  inputType?: "text" | "textarea";
  note?: String;
  labelClassName?: String;
};

const FormInput: React.FC<FormInputPropsType> = ({
  name,
  control,
  label,
  placeholder,
  type = "text",
  className,
  required = false,
  inputType = "text",
  note,
  labelClassName,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <FormField
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field }) => (
        <FormItem className={"w-full"}>
          {label && (
            <FormLabel className={cn(labelClassName)}>{label}</FormLabel>
          )}
          <FormControl>
            {inputType === "textarea" ? (
              <Textarea
                placeholder={placeholder}
                className={cn(className)}
                {...field}
              />
            ) : (
              <div className="relative">
                <Input
                  placeholder={placeholder}
                  className={cn(className)}
                  type={type === "password" && showPassword ? "text" : type}
                  {...field}
                />
                {type === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
                <Text className="text-xs text-gray-500 my-1">{note}</Text>
              </div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
