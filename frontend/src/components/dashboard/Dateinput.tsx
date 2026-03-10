"use client";

import { InputHTMLAttributes, useRef } from "react";

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function DateInput({ value, onChange, className, ...props }: DateInputProps) {
  const prevValue = useRef(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value; // "YYYY-MM-DD" or ""
    if (!raw) {
      prevValue.current = "";
      onChange("");
      return;
    }

    const parts = raw.split("-");
    const year  = parts[0] ?? "";
    const day   = parts[2] ? parseInt(parts[2], 10) : null;

    // Reject if year > 4 digits or day > 31
    if (year.length > 4 || (day !== null && day > 31)) {
      e.target.value = prevValue.current;
      return;
    }

    prevValue.current = raw;
    onChange(raw);
  };

  return (
    <input
      {...props}
      type="date"
      value={value}
      max="9999-12-31"
      onChange={handleChange}
      className={className}
    />
  );
}