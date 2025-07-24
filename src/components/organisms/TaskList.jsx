import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/organisms/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import { toast } from "react-toastify";

const TaskList = ({ 
  filters = {}, 
  searchQuery = "", 
  onTaskUpdate,
  onAddTask 
}) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [filters, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = async () => {
    if (!searchQuery && Object.keys(filters).length === 0) {
      const allTasks = await taskService.getAll();
      setTasks(allTasks);
      return;
    }

    let filteredTasks = await taskService.getAll();

    if (searchQuery) {
      filteredTasks = await taskService.search(searchQuery);
    }

    if (filters.status) {
      const completed = filters.status === "completed";
      filteredTasks = filteredTasks.filter(task => task.completed === completed);
    }

    if (filters.category) {
      filteredTasks = filteredTasks.filter(task => 
        task.categoryId === filters.category
      );
    }

    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => 
        task.priority === filters.priority
      );
    }

    setTasks(filteredTasks);
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.update(taskId, { completed });
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      toast.success(completed ? "Task completed!" : "Task reopened!");
      onTaskUpdate?.(updatedTask);
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id.toString() === categoryId);
  };

  if (loading) return <Loading type="tasks" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (tasks.length === 0) {
    const hasFilters = Object.keys(filters).length > 0 || searchQuery;
    return (
      <Empty
        title={hasFilters ? "No tasks match your filters" : "No tasks yet"}
        description={hasFilters 
          ? "Try adjusting your filters or search terms to find tasks." 
          : "Create your first task to get started with TaskFlow!"
        }
        actionLabel="Add Task"
        onAction={onAddTask}
        icon="Plus"
      />
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map(task => (
          <TaskCard
            key={task.Id}
            task={task}
            category={getCategoryById(task.categoryId)}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;