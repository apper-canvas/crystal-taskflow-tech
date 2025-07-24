import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = React.forwardRef(({ 
  className, 
  checked,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sr-only",
          className
        )}
        ref={ref}
        checked={checked}
        {...props}
      />
      <div className={cn(
        "h-5 w-5 rounded border-2 border-gray-300 bg-white transition-all duration-200 flex items-center justify-center cursor-pointer",
        "peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-primary-600 peer-checked:border-primary-500",
        "hover:border-primary-400 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2"
      )}>
        {checked && (
          <ApperIcon 
            name="Check" 
            className="h-3 w-3 text-white animate-scale-in" 
          />
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;