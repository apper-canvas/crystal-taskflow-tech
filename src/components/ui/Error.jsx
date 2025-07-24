import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg border border-red-200",
      className
    )}>
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-6 h-6 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">Oops!</h3>
      <p className="text-red-700 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="border-red-300 text-red-700 hover:bg-red-50">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;