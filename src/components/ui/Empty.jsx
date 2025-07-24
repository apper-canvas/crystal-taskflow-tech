import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No items found",
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = "Plus",
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg border border-primary-100",
      className
    )}>
      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name={icon} className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold gradient-text mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md leading-relaxed">{description}</p>
      {onAction && (
        <Button variant="accent" onClick={onAction} className="shadow-lg">
          <ApperIcon name={icon} className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;