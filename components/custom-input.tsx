import React, { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils"; // You'll need this utility function

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  state?: "default" | "read-only" | "invalid";
  isDisabled?: boolean;
}

const TestInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      leftSlot,
      rightSlot,
      state = "default",
      isDisabled = false,
      placeholder = "Search...",
      ...props
    },
    ref
  ) => {
    // Calculate slot widths
    const leftSlotWidth = leftSlot ? "w-8" : "w-0";
    const rightSlotWidth = rightSlot ? "w-8" : "w-0";

    return (
      <div className="relative w-full">
        {leftSlot && (
          <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
            {leftSlot}
          </div>
        )}
        <input
          type={type}
          className={cn(
            // Base styles
            "relative w-full select-none appearance-none transition-all duration-200",
            "h-8 rounded-xl px-3 text-sm",
            "bg-gray-100 border border-gray-300",
            "text-gray-900 placeholder:text-gray-500",
            "outline-none focus:ring-2 focus:ring-gray-200",

            // Dark mode
            "dark:bg-gray-800 dark:border-gray-700",
            "dark:text-gray-100 dark:placeholder:text-gray-400",
            "dark:focus:ring-gray-700",

            // States
            "disabled:cursor-not-allowed disabled:opacity-70 disabled:text-gray-500",
            "read-only:cursor-default read-only:border-gray-300 read-only:bg-gray-200 read-only:text-gray-600 read-only:focus:ring-0",
            "aria-[invalid=true]:border-red-500 aria-[invalid=true]:bg-red-50 aria-[invalid=true]:focus:ring-red-200",
            "dark:aria-[invalid=true]:border-red-400 dark:aria-[invalid=true]:bg-red-900/20 dark:aria-[invalid=true]:focus:ring-red-900",

            // Slot widths
            leftSlot && "pl-10",
            rightSlot && "pr-10",

            // Custom classnames
            className
          )}
          ref={ref}
          disabled={isDisabled}
          aria-invalid={state === "invalid"}
          aria-readonly={state === "read-only"}
          readOnly={state === "read-only"}
          data-state={state}
          placeholder={placeholder}
          {...props}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
    );
  }
);

TestInput.displayName = "TestInput";

export default TestInput;
