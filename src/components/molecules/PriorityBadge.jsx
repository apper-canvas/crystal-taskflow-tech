import React from "react";
import { cn } from "@/utils/cn";

const PriorityBadge = ({ priority, className }) => {
  const variants = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-green-100 text-green-800 border-green-200"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      variants[priority] || variants.medium,
      className
    )}>
      {priority}
    </span>
  );
};

export default PriorityBadge;