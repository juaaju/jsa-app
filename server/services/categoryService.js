import db from '../db.js';

/**
 * Service for hazard category-related database operations
 */
class CategoryService {
  /**
   * Get all hazard categories
   * @returns {Promise<Array>} List of hazard categories
   */
  async getAllCategories() {
    const result = await db.query(
      'SELECT * FROM hazard_categories ORDER BY category_id'
    );
    return result.rows;
  }

  /**
   * Get category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Category information
   */
  async getCategoryById(id) {
    const result = await db.query(
      'SELECT * FROM hazard_categories WHERE category_id = $1',
      [id]
    );
    return result.rows[0];
  }

  /**
   * Create a new hazard category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    const { category_id, name } = categoryData;

    const result = await db.query(
      'INSERT INTO hazard_categories (category_id, name) VALUES ($1, $2) RETURNING *',
      [category_id, name]
    );
    return result.rows[0];
  }

  /**
   * Update an existing hazard category
   * @param {string} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(id, categoryData) {
    const { name } = categoryData;

    const result = await db.query(
      'UPDATE hazard_categories SET name = $1 WHERE category_id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  }

  /**
   * Delete a hazard category
   * @param {string} id - Category ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCategory(id) {
    const result = await db.query(
      'DELETE FROM hazard_categories WHERE category_id = $1 RETURNING category_id',
      [id]
    );
    return result.rowCount > 0;
  }

  /**
   * Get category with all its hazards
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Category with hazards
   */
  async getCategoryWithHazards(id) {
    // Get the category
    const categoryResult = await db.query(
      'SELECT * FROM hazard_categories WHERE category_id = $1',
      [id]
    );
    
    if (categoryResult.rows.length === 0) {
      return null;
    }
    
    const category = categoryResult.rows[0];
    
    // Get all hazards in this category
    const hazardsResult = await db.query(
      'SELECT * FROM hazards WHERE category_id = $1 ORDER BY id',
      [id]
    );
    
    return {
      ...category,
      hazards: hazardsResult.rows
    };
  }

  /**
   * Get statistics on hazards by category
   * @returns {Promise<Array>} Categories with hazard counts
   */
  async getCategoryStats() {
    const result = await db.query(`
      SELECT 
        c.category_id,
        c.name,
        COUNT(h.id) AS hazard_count,
        SUM(CASE WHEN h.health = true THEN 1 ELSE 0 END) AS health_count,
        SUM(CASE WHEN h.safety = true THEN 1 ELSE 0 END) AS safety_count,
        SUM(CASE WHEN h.security = true THEN 1 ELSE 0 END) AS security_count,
        SUM(CASE WHEN h.environment = true THEN 1 ELSE 0 END) AS environment_count,
        SUM(CASE WHEN h.social = true THEN 1 ELSE 0 END) AS social_count
      FROM 
        hazard_categories c
      LEFT JOIN 
        hazards h ON c.category_id = h.category_id
      GROUP BY 
        c.category_id, c.name
      ORDER BY 
        c.category_id
    `);
    
    return result.rows;
  }
}

export default new CategoryService();
