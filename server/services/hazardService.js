import db from '../db.js';

/**
 * Service for hazard-related database operations
 */
class HazardService {
  /**
   * Get all hazards with their categories
   * @returns {Promise<Array>} List of hazards with category information
   */
  async getAllHazards() {
    const result = await db.query(
      'SELECT * FROM hazards_with_categories ORDER BY id'
    );
    return result.rows;
  }

  /**
   * Get hazard by ID
   * @param {string} id - Hazard ID
   * @returns {Promise<Object>} Hazard information
   */
  async getHazardById(id) {
    const result = await db.query(
      'SELECT * FROM hazards_with_categories WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  /**
   * Get hazards by category ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<Array>} List of hazards in the category
   */
  async getHazardsByCategory(categoryId) {
    const result = await db.query(
      'SELECT * FROM hazards_with_categories WHERE category = $1 ORDER BY id',
      [categoryId]
    );
    return result.rows;
  }

  /**
   * Search hazards by description
   * @param {string} searchTerm - Term to search in description
   * @returns {Promise<Array>} List of matching hazards
   */
  async searchHazards(searchTerm) {
    const result = await db.query(
      'SELECT * FROM hazards_with_categories WHERE description ILIKE $1 ORDER BY id',
      [`%${searchTerm}%`]
    );
    return result.rows;
  }

  /**
   * Create a new hazard
   * @param {Object} hazardData - Hazard data
   * @returns {Promise<Object>} Created hazard
   */
  async createHazard(hazardData) {
    const {
      id,
      category_id,
      description,
      health,
      safety,
      security,
      environment,
      social,
      sources
    } = hazardData;

    const result = await db.query(
      `INSERT INTO hazards 
       (id, category_id, description, health, safety, security, environment, social, sources)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, category_id, description, health, safety, security, environment, social, sources]
    );
    return result.rows[0];
  }

  /**
   * Update an existing hazard
   * @param {string} id - Hazard ID
   * @param {Object} hazardData - Updated hazard data
   * @returns {Promise<Object>} Updated hazard
   */
  async updateHazard(id, hazardData) {
    const {
      category_id,
      description,
      health,
      safety,
      security,
      environment,
      social,
      sources
    } = hazardData;

    const result = await db.query(
      `UPDATE hazards 
       SET category_id = $1, 
           description = $2, 
           health = $3, 
           safety = $4, 
           security = $5, 
           environment = $6, 
           social = $7, 
           sources = $8
       WHERE id = $9
       RETURNING *`,
      [category_id, description, health, safety, security, environment, social, sources, id]
    );
    return result.rows[0];
  }

  /**
   * Delete a hazard
   * @param {string} id - Hazard ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteHazard(id) {
    const result = await db.query('DELETE FROM hazards WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
  }

  /**
   * Filter hazards by impact type
   * @param {Object} filters - Impact type filters
   * @returns {Promise<Array>} Filtered hazards
   */
  async filterHazardsByImpact(filters) {
    const conditions = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic query based on filters
    for (const [key, value] of Object.entries(filters)) {
      if (value === true && ['health', 'safety', 'security', 'environment', 'social'].includes(key)) {
        conditions.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    let query = 'SELECT * FROM hazards_with_categories';
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY id';
    
    const result = await db.query(query, values);
    return result.rows;
  }
}

export default new HazardService();
