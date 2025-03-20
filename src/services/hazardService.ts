export interface Hazard {
  id: string;
  category_id: string;
  description: string;
  health: boolean;
  safety: boolean;
  security: boolean;
  environment: boolean;
  social: boolean;
  sources?: string;
}

export interface HazardFilters {
  health?: boolean;
  safety?: boolean;
  security?: boolean;
  environment?: boolean;
  social?: boolean;
}

const API_URL = 'http://localhost:5000/api';

const hazardService = {
  /**
   * Get all hazards
   * @returns {Promise<Hazard[]>} List of hazards
   */
  getAllHazards: async (): Promise<Hazard[]> => {
    try {
      const response = await fetch(`${API_URL}/hazards`, {
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
      console.error('Error fetching hazards:', error);
      throw error;
    }
  },

  /**
   * Search hazards by description term
   * @param {string} term Search term
   * @returns {Promise<Hazard[]>} List of matching hazards
   */
  searchHazards: async (term: string): Promise<Hazard[]> => {
    try {
      const response = await fetch(`${API_URL}/hazards/search?term=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching hazards:', error);
      throw error;
    }
  },

  /**
   * Filter hazards by impact type
   * @param {HazardFilters} filters Impact filters (health, safety, security, environment, social)
   * @returns {Promise<Hazard[]>} List of filtered hazards
   */
  filterHazardsByImpact: async (filters: HazardFilters): Promise<Hazard[]> => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, String(value));
      });
      const response = await fetch(`${API_URL}/hazards/filter?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error filtering hazards:', error);
      throw error;
    }
  },

  /**
   * Get hazards by category ID
   * @param {string} categoryId Category ID
   * @returns {Promise<Hazard[]>} List of hazards in category
   */
  getHazardsByCategory: async (categoryId: string): Promise<Hazard[]> => {
    try {
      const response = await fetch(`${API_URL}/hazards/category/${categoryId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching hazards for category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Get hazard by ID
   * @param {string} id Hazard ID
   * @returns {Promise<Hazard>} Hazard details
   */
  getHazardById: async (id: string): Promise<Hazard> => {
    try {
      const response = await fetch(`${API_URL}/hazards/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching hazard ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new hazard
   * @param {Partial<Hazard>} hazardData Hazard data
   * @returns {Promise<Hazard>} Created hazard
   */
  createHazard: async (hazardData: Partial<Hazard>): Promise<Hazard> => {
    try {
      const response = await fetch(`${API_URL}/hazards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hazardData),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating hazard:', error);
      throw error;
    }
  },

  /**
   * Update a hazard
   * @param {string} id Hazard ID
   * @param {Partial<Hazard>} hazardData Hazard data to update
   * @returns {Promise<Hazard>} Updated hazard
   */
  updateHazard: async (id: string, hazardData: Partial<Hazard>): Promise<Hazard> => {
    try {
      const response = await fetch(`${API_URL}/hazards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hazardData),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating hazard ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a hazard
   * @param {string} id Hazard ID
   * @returns {Promise<{message: string}>} Success message
   */
  deleteHazard: async (id: string): Promise<{message: string}> => {
    try {
      const response = await fetch(`${API_URL}/hazards/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting hazard ${id}:`, error);
      throw error;
    }
  }
};

export default hazardService;