import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import { toast } from "react-toastify";

const TaskForm = ({ onTaskCreated, onCancel }) => {
const [formData, setFormData] = useState({
    title_c: "",
    description_c: "",
    category_id_c: "",
    priority_c: "medium",
    due_date_c: ""
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
const newTask = await taskService.create(formData);
      toast.success("Task created successfully!");
      onTaskCreated(newTask);
      setFormData({
        title_c: "",
        description_c: "",
        category_id_c: "",
        priority_c: "medium",
        due_date_c: ""
      });
    } catch (error) {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold gradient-text flex items-center">
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Add New Task
        </h2>
        {onCancel && (
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title..."
          error={errors.title}
        />

        <FormField
          label="Description"
          type="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add task description (optional)..."
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<FormField
            label="Category"
            type="select"
            name="category_id_c"
            value={formData.category_id_c}
            onChange={handleChange}
            error={errors.category_id_c}
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.Id} value={category.Id.toString()}>
                {category.Name}
              </option>
            ))}
          </FormField>

          <FormField
            label="Priority"
            type="select"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </FormField>

          <FormField
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Create Task
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;