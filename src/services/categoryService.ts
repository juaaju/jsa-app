export interface Category {
  category_id: string;
  name: string;
}

export interface CategoryStats {
  totalCategories: number;
  totalHazards: number;
  avgHazardsPerCategory: number;
  hazardsByCategory: {
    category_id: string;
    name: string;
    hazardCount: number;
  }[];
}

const API_URL = 'http://localhost:5000/api';

const categoryService = {
  /**
   * Get all hazard categories
   * @returns {Promise<Category[]>} List of categories
   */
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get category statistics
   * @returns {Promise<CategoryStats>} Category statistics
   */
  getCategoryStats: async (): Promise<CategoryStats> => {
    try {
      const response = await fetch(`${API_URL}/categories/stats`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw error;
    }
  },

  /**
   * Get category by ID
   * @param {string} id Category ID
   * @returns {Promise<Category>} Category details
   */
  getCategoryById: async (id: string): Promise<Category> => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get category with its hazards
   * @param {string} id Category ID
   * @returns {Promise<{category: Category, hazards: any[]}>} Category with hazards
   */
  getCategoryWithHazards: async (id: string): Promise<{category: Category, hazards: any[]}> => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}/hazards`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching category ${id} with hazards:`, error);
      throw error;
    }
  },

  /**
   * Create a new category
   * @param {Partial<Category>} categoryData Category data (category_id, name)
   * @returns {Promise<Category>} Created category
   */
  createCategory: async (categoryData: Partial<Category>): Promise<Category> => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Update a category
   * @param {string} id Category ID
   * @param {Partial<Category>} categoryData Category data to update (name)
   * @returns {Promise<Category>} Updated category
   */
  updateCategory: async (id: string, categoryData: Partial<Category>): Promise<Category> => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a category
   * @param {string} id Category ID
   * @returns {Promise<{message: string}>} Success message
   */
  deleteCategory: async (id: string): Promise<{message: string}> => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
};

export default categoryService;