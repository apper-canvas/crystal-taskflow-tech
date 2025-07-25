import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { categoryService } from "@/services/api/categoryService";
import { taskService } from "@/services/api/taskService";
import { cn } from "@/utils/cn";

const CategorySidebar = ({ selectedCategory, onCategorySelect, onAddCategory }) => {
  const [categories, setCategories] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ]);
      
      setCategories(categoriesData);
      
      // Calculate task counts for each category
      const counts = {};
categoriesData.forEach(category => {
        counts[category.Id] = tasksData.filter(task => {
          const taskCategoryId = task.category_id_c?.Id || task.category_id_c;
          return taskCategoryId?.toString() === category.Id.toString() && !task.completed_c;
        }).length;
      });
      setTaskCounts(counts);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="categories" className="p-4" />;
  if (error) return <Error message={error} onRetry={loadCategories} className="m-4" />;

  return (
    <div className="h-full bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold gradient-text">Categories</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddCategory}
            className="text-primary-600 hover:bg-primary-50"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant={!selectedCategory ? "primary" : "ghost"}
          className={cn(
            "w-full justify-start mb-2",
            !selectedCategory && "bg-gradient-to-r from-primary-600 to-primary-700"
          )}
          onClick={() => onCategorySelect(null)}
        >
          <ApperIcon name="Inbox" className="w-4 h-4 mr-3" />
          All Tasks
        </Button>
      </div>

      <div className="p-4 space-y-2">
        {categories.map(category => (
          <motion.div
            key={category.Id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between p-3 h-auto",
                selectedCategory === category.Id.toString() && "bg-primary-50 text-primary-700 border border-primary-200"
              )}
              onClick={() => onCategorySelect(category.Id.toString())}
>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: category.color_c }}
                />
                <span className="font-medium">{category.Name}</span>
              </div>
              {taskCounts[category.Id] > 0 && (
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-semibold",
                  selectedCategory === category.Id.toString()
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-600"
                )}>
                  {taskCounts[category.Id]}
                </span>
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;