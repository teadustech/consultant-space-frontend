import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";

/**
 * Reusable input field for forms using shadcn/ui components
 * Props: label, name, type, value, onChange, onBlur, error, placeholder
 */
export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  className,
  ...rest
}) {
  return (
    <div className="mb-4 space-y-2">
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...rest}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
} 