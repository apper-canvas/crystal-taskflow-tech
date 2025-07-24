import React from "react";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  searchQuery, 
  onSearchChange,
  onClearFilters,
  categories = []
}) => {
  const hasActiveFilters = Object.values(filters).some(value => value) || searchQuery;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex space-x-2">
            <Select
              value={filters.status || ""}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className="w-32"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </Select>

            <Select
              value={filters.category || ""}
              onChange={(e) => onFilterChange("category", e.target.value)}
              className="w-36"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.Id} value={category.Id.toString()}>
                  {category.name}
                </option>
              ))}
            </Select>

            <Select
              value={filters.priority || ""}
              onChange={(e) => onFilterChange("priority", e.target.value)}
              className="w-32"
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-600 hover:text-gray-900"
            >
              <ApperIcon name="X" className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;