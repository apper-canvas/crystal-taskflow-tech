import { toast } from "react-toastify";

export const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
{ field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "created_at_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.getRecordById('task_c', parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

// Only include Updateable fields and format lookup fields properly
      const params = {
        records: [{
          Name: taskData.Name || taskData.title || taskData.title_c,
          title_c: taskData.title_c || taskData.title,
          description_c: taskData.description_c || taskData.description,
          category_id_c: taskData.category_id_c ? parseInt(taskData.category_id_c) : 
                        taskData.categoryId ? parseInt(taskData.categoryId) : null,
          priority_c: taskData.priority_c || taskData.priority || "medium",
          due_date_c: taskData.due_date_c || taskData.dueDate,
          completed_c: taskData.completed_c !== undefined ? taskData.completed_c : 
                      taskData.completed !== undefined ? taskData.completed : false,
          created_at_c: taskData.created_at_c || taskData.createdAt || new Date().toISOString(),
          completed_at_c: taskData.completed_at_c || taskData.completedAt || null,
          phone_c: taskData.phone_c || taskData.phone || "",
          Tags: taskData.Tags || ""
        }]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create task ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateData = {
Id: parseInt(id)
      };

      if (updates.Name !== undefined || updates.title !== undefined || updates.title_c !== undefined) {
        updateData.Name = updates.Name || updates.title || updates.title_c;
        updateData.title_c = updates.title_c || updates.title || updates.Name;
      }
      if (updates.description_c !== undefined || updates.description !== undefined) {
        updateData.description_c = updates.description_c || updates.description;
      }
      if (updates.category_id_c !== undefined || updates.categoryId !== undefined) {
        const categoryId = updates.category_id_c || updates.categoryId;
        updateData.category_id_c = categoryId ? parseInt(categoryId) : null;
      }
      if (updates.priority_c !== undefined || updates.priority !== undefined) {
        updateData.priority_c = updates.priority_c || updates.priority;
      }
      if (updates.due_date_c !== undefined || updates.dueDate !== undefined) {
        updateData.due_date_c = updates.due_date_c || updates.dueDate;
      }
      if (updates.completed_c !== undefined || updates.completed !== undefined) {
        updateData.completed_c = updates.completed_c !== undefined ? updates.completed_c : updates.completed;
        // Set completed_at_c if task is being marked as completed
        if (updateData.completed_c && (updates.completed_at_c === undefined && updates.completedAt === undefined)) {
          updateData.completed_at_c = new Date().toISOString();
        }
      }
      if (updates.completed_at_c !== undefined || updates.completedAt !== undefined) {
        updateData.completed_at_c = updates.completed_at_c || updates.completedAt;
      }
      if (updates.phone_c !== undefined || updates.phone !== undefined) {
        updateData.phone_c = updates.phone_c || updates.phone;
      }
      if (updates.Tags !== undefined) {
        updateData.Tags = updates.Tags;
      }
      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update task ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete task ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async getByCategory(categoryId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
{ field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "phone_c" } }
        ],
        where: [
          {
            FieldName: "category_id_c",
            Operator: "EqualTo",
            Values: [parseInt(categoryId)]
          }
        ],
        orderBy: [
          { fieldName: "created_at_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByStatus(completed) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
{ field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "phone_c" } }
        ],
        where: [
          {
            FieldName: "completed_c",
            Operator: "EqualTo",
            Values: [completed]
          }
        ],
        orderBy: [
          { fieldName: "created_at_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
{ field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "phone_c" } }
        ],
whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "description_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "phone_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "created_at_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};