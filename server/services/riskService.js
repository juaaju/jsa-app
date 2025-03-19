// riskService.js
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'risk_management',
  password: process.env.DB_PASSWORD || 'toor',
  port: process.env.DB_PORT || 5432,
});

// Fungsi untuk mendapatkan semua risiko
const getAllRisks = async () => {
  try {
    const result = await pool.query('SELECT * FROM risk_register_view ORDER BY id');
    return result.rows;
  } catch (error) {
    console.error('Error fetching risks:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan risiko berdasarkan ID
const getRiskById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM risk_register_view WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching risk with id ${id}:`, error);
    throw error;
  }
};

// Fungsi untuk membuat risiko baru
const createRisk = async (riskData) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Dapatkan ID grup
    const groupResult = await client.query(
      'SELECT id FROM groups WHERE name = $1',
      [riskData.group]
    );
    const groupId = groupResult.rows[0]?.id;
    
    // Dapatkan ID departemen
    const deptResult = await client.query(
      'SELECT id FROM departments WHERE name = $1',
      [riskData.pic]
    );
    const picId = deptResult.rows[0]?.id;
    
    // Generate ID jika tidak ada
    let riskId = riskData.id;
    if (!riskId) {
      const countResult = await client.query('SELECT COUNT(*) FROM risks');
      const count = parseInt(countResult.rows[0].count) + 1;
      riskId = `R-${String(count).padStart(3, '0')}`;
    }
    
    // Insert data risiko
    const insertResult = await client.query(`
      INSERT INTO risks(
        id, 
        group_id, 
        activity, 
        hazard, 
        impact, 
        impact_description, 
        risk_description,
        aspect_health,
        aspect_safety,
        aspect_security,
        aspect_environment,
        aspect_social,
        existing_control,
        probability,
        severity,
        initial_risk_level,
        additional_control,
        residual_probability,
        residual_severity,
        residual_risk_level,
        pic_id,
        target_date,
        status,
        current_risk_level,
        legal_standard_info,
        is_mah
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
      RETURNING *
    `, [
      riskId,
      groupId,
      riskData.activity,
      riskData.hazard,
      riskData.impact,
      riskData.impactDescription,
      riskData.riskDescription,
      riskData.aspects.health,
      riskData.aspects.safety,
      riskData.aspects.security,
      riskData.aspects.environment,
      riskData.aspects.social,
      riskData.existingControl,
      riskData.probability,
      riskData.severity,
      riskData.initialRiskLevel,
      riskData.additionalControl,
      riskData.residualProbability,
      riskData.residualSeverity,
      riskData.residualRiskLevel,
      picId,
      riskData.targetDate,
      riskData.status,
      riskData.currentRiskLevel,
      riskData.legalStandardInfo,
      riskData.mah
    ]);
    
    await client.query('COMMIT');
    return getRiskById(riskId); // Return complete risk with joins
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating risk:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Fungsi untuk memperbarui risiko
const updateRisk = async (id, riskData) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Dapatkan ID grup
    const groupResult = await client.query(
      'SELECT id FROM groups WHERE name = $1',
      [riskData.group]
    );
    const groupId = groupResult.rows[0]?.id;
    
    // Dapatkan ID departemen
    const deptResult = await client.query(
      'SELECT id FROM departments WHERE name = $1',
      [riskData.pic]
    );
    const picId = deptResult.rows[0]?.id;
    
    // Update data risiko
    await client.query(`
      UPDATE risks SET
        group_id = $1,
        activity = $2,
        hazard = $3,
        impact = $4,
        impact_description = $5,
        risk_description = $6,
        aspect_health = $7,
        aspect_safety = $8,
        aspect_security = $9,
        aspect_environment = $10,
        aspect_social = $11,
        existing_control = $12,
        probability = $13,
        severity = $14,
        initial_risk_level = $15,
        additional_control = $16,
        residual_probability = $17,
        residual_severity = $18,
        residual_risk_level = $19,
        pic_id = $20,
        target_date = $21,
        status = $22,
        current_risk_level = $23,
        legal_standard_info = $24,
        is_mah = $25,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $26
    `, [
      groupId,
      riskData.activity,
      riskData.hazard,
      riskData.impact,
      riskData.impactDescription,
      riskData.riskDescription,
      riskData.aspects.health,
      riskData.aspects.safety,
      riskData.aspects.security,
      riskData.aspects.environment,
      riskData.aspects.social,
      riskData.existingControl,
      riskData.probability,
      riskData.severity,
      riskData.initialRiskLevel,
      riskData.additionalControl,
      riskData.residualProbability,
      riskData.residualSeverity,
      riskData.residualRiskLevel,
      picId,
      riskData.targetDate,
      riskData.status,
      riskData.currentRiskLevel,
      riskData.legalStandardInfo,
      riskData.mah,
      id
    ]);
    
    await client.query('COMMIT');
    return getRiskById(id); // Return complete risk with joins
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error updating risk with id ${id}:`, error);
    throw error;
  } finally {
    client.release();
  }
};

// Fungsi untuk menghapus risiko
const deleteRisk = async (id) => {
  try {
    await pool.query('DELETE FROM risks WHERE id = $1', [id]);
    return { success: true, message: `Risk with ID ${id} deleted successfully` };
  } catch (error) {
    console.error(`Error deleting risk with id ${id}:`, error);
    throw error;
  }
};

// Fungsi untuk mendapatkan semua departemen
const getAllDepartments = async () => {
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY name');
    return result.rows;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan semua grup
const getAllGroups = async () => {
  try {
    const result = await pool.query('SELECT * FROM groups ORDER BY name');
    return result.rows;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
};

export default  {
  getAllRisks,
  getRiskById,
  createRisk,
  updateRisk,
  deleteRisk,
  getAllDepartments,
  getAllGroups
};