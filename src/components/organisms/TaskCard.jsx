import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import CategoryPill from "@/components/molecules/CategoryPill";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskCard = ({ 
  task, 
  category, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  onUpdate 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      await onToggleComplete(task.Id, !task.completed);
    } finally {
      setIsCompleting(false);
    }
  };

  const getPriorityBorderClass = () => {
    switch (task.priority) {
      case "high": return "priority-border-high";
      case "medium": return "priority-border-medium";
      case "low": return "priority-border-low";
      default: return "priority-border-medium";
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "task-card",
        getPriorityBorderClass(),
        task.completed && "opacity-75 bg-gray-50",
        isOverdue && "ring-2 ring-red-200"
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="mt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={cn(
              "font-semibold text-gray-900 leading-tight",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(task)}
                className="h-8 w-8 text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(task.Id)}
                className="h-8 w-8 text-gray-400 hover:text-red-600"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {task.description && (
            <p className={cn(
              "text-sm text-gray-600 mb-3 leading-relaxed",
              task.completed && "line-through"
            )}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CategoryPill category={category} />
              <PriorityBadge priority={task.priority} />
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className={cn(
                "flex items-center",
                isOverdue && "text-red-600 font-medium"
              )}>
                <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                {format(new Date(task.dueDate), "MMM d")}
                {isOverdue && (
                  <span className="ml-1 text-xs">(Overdue)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {task.completed && task.completedAt && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 flex items-center">
            <ApperIcon name="CheckCircle2" className="w-3 h-3 mr-1 text-green-500" />
            Completed {format(new Date(task.completedAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;