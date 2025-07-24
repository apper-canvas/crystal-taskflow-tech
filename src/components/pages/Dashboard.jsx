import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import TaskList from "@/components/organisms/TaskList";
import TaskForm from "@/components/organisms/TaskForm";
import FilterBar from "@/components/organisms/FilterBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setSelectedCategory(null);
  };

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    loadCategories(); // Refresh categories to update task counts
  };

  const effectiveFilters = {
    ...filters,
    ...(selectedCategory && { category: selectedCategory })
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {showMobileSidebar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <CategorySidebar
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onAddCategory={() => toast.info("Category management coming soon!")}
          />
        </div>

        {/* Mobile Sidebar */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: showMobileSidebar ? 0 : "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden"
        >
          <CategorySidebar
            selectedCategory={selectedCategory}
            onCategorySelect={(category) => {
              setSelectedCategory(category);
              setShowMobileSidebar(false);
            }}
            onAddCategory={() => toast.info("Category management coming soon!")}
          />
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileSidebar(true)}
                  className="lg:hidden"
                >
                  <ApperIcon name="Menu" className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">TaskFlow</h1>
                  <p className="text-sm text-gray-600">Organize and complete daily tasks efficiently</p>
                </div>
              </div>
              <Button
                onClick={() => setShowTaskForm(true)}
                className="shadow-lg"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              {showTaskForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <TaskForm
                    onTaskCreated={handleTaskCreated}
                    onCancel={() => setShowTaskForm(false)}
                  />
                </motion.div>
              )}

              <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClearFilters={handleClearFilters}
                categories={categories}
              />

              <TaskList
                filters={effectiveFilters}
                searchQuery={searchQuery}
                onTaskUpdate={loadCategories}
                onAddTask={() => setShowTaskForm(true)}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;