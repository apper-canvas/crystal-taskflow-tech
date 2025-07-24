import React from "react";
import { cn } from "@/utils/cn";

const CategoryPill = ({ category, className }) => {
  if (!category) return null;

  return (
    <span 
      className={cn("category-pill", className)}
      style={{ backgroundColor: category.color }}
    >
      {category.name}
    </span>
  );
};

export default CategoryPill;