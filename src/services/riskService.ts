// src/services/riskService.ts

// Definisikan tipe jika menggunakan TypeScript
interface ApiRisk {
    id: string;
    group_name: string;
    activity: string;
    hazard: string;
    impact: number;
    impact_description: string;
    risk_description: string;
    aspect_health: boolean;
    aspect_safety: boolean;
    aspect_security: boolean;
    aspect_environment: boolean;
    aspect_social: boolean;
    existing_control: string;
    probability: number;
    severity: number;
    initial_risk_level: string;
    additional_control: string;
    residual_probability: number;
    residual_severity: number;
    residual_risk_level: string;
    pic: string;
    target_date: string;
    status: string;
    current_risk_level: string;
    legal_standard_info: string;
    is_mah: boolean;
  }
  
  interface FrontendRisk {
    id: string;
    group: string;
    activity: string;
    hazard: string;
    impact: number;
    impactDescription: string;
    riskDescription: string;
    aspects: {
      health: boolean;
      safety: boolean;
      security: boolean;
      environment: boolean;
      social: boolean;
    };
    existingControl: string;
    probability: number;
    severity: number;
    initialRiskLevel: string;
    additionalControl: string;
    residualProbability: number;
    residualSeverity: number;
    residualRiskLevel: string;
    pic: string;
    targetDate: string;
    status: string;
    currentRiskLevel: string;
    legalStandardInfo: string;
    mah: boolean;
  }
  
  const API_URL = 'http://localhost:5000/api';
  
  // Fungsi untuk mengkonversi data dari format API ke format frontend
  const mapApiToFrontend = (apiRisk: ApiRisk): FrontendRisk => ({
    id: apiRisk.id,
    group: apiRisk.group_name,
    activity: apiRisk.activity,
    hazard: apiRisk.hazard,
    impact: apiRisk.impact,
    impactDescription: apiRisk.impact_description,
    riskDescription: apiRisk.risk_description,
    aspects: {
      health: apiRisk.aspect_health || false,
      safety: apiRisk.aspect_safety || false,
      security: apiRisk.aspect_security || false,
      environment: apiRisk.aspect_environment || false,
      social: apiRisk.aspect_social || false
    },
    existingControl: apiRisk.existing_control,
    probability: apiRisk.probability,
    severity: apiRisk.severity,
    initialRiskLevel: apiRisk.initial_risk_level,
    additionalControl: apiRisk.additional_control,
    residualProbability: apiRisk.residual_probability,
    residualSeverity: apiRisk.residual_severity,
    residualRiskLevel: apiRisk.residual_risk_level,
    pic: apiRisk.pic,
    targetDate: apiRisk.target_date ? apiRisk.target_date.split('T')[0] : '',
    status: apiRisk.status,
    currentRiskLevel: apiRisk.current_risk_level,
    legalStandardInfo: apiRisk.legal_standard_info,
    mah: apiRisk.is_mah
  });
  
  // Fungsi untuk mengkonversi data dari format frontend ke format API
  const mapFrontendToApi = (frontendRisk: FrontendRisk): any => ({
    id: frontendRisk.id,
    group: frontendRisk.group,        // Kirim sebagai group, bukan group_name
    activity: frontendRisk.activity,
    hazard: frontendRisk.hazard,
    impact: frontendRisk.impact,
    impactDescription: frontendRisk.impactDescription,
    riskDescription: frontendRisk.riskDescription,
    aspects: {                        // Backend mengharapkan objek aspects
      health: frontendRisk.aspects.health,
      safety: frontendRisk.aspects.safety,
      security: frontendRisk.aspects.security,
      environment: frontendRisk.aspects.environment,
      social: frontendRisk.aspects.social
    },
    existingControl: frontendRisk.existingControl,
    probability: frontendRisk.probability,
    severity: frontendRisk.severity,
    initialRiskLevel: frontendRisk.initialRiskLevel,
    additionalControl: frontendRisk.additionalControl,
    residualProbability: frontendRisk.residualProbability,
    residualSeverity: frontendRisk.residualSeverity,
    residualRiskLevel: frontendRisk.residualRiskLevel,
    pic: frontendRisk.pic,
    targetDate: frontendRisk.targetDate,
    status: frontendRisk.status,
    currentRiskLevel: frontendRisk.currentRiskLevel,
    legalStandardInfo: frontendRisk.legalStandardInfo,
    mah: frontendRisk.mah
  });
  
  // Fungsi untuk mendapatkan semua risiko
  export const getAllRisks = async (): Promise<FrontendRisk[]> => {
    try {
      const response = await fetch(`${API_URL}/risks`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text || text.trim() === '') {
        console.warn('Empty response received from /risks endpoint');
        return [];
      }
      
      try {
        const apiRisks = JSON.parse(text);
        console.log(`Loaded ${apiRisks.length} risks from server`);
        
        // Validasi data yang diterima
        if (!Array.isArray(apiRisks)) {
          console.error('Server returned non-array data:', apiRisks);
          return [];
        }
        
        return apiRisks.map(risk => {
          try {
            return mapApiToFrontend(risk);
          } catch (mapError) {
            console.error('Error mapping risk:', risk, mapError);
            return null;
          }
        }).filter(risk => risk !== null) as FrontendRisk[];
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.error('Raw response:', text);
        throw parseError;
      }
    } catch (error) {
      console.error('Error fetching risks:', error);
      throw error;
    }
  };
  
  // Fungsi untuk mendapatkan risiko berdasarkan ID
  export const getRiskById = async (id: string): Promise<FrontendRisk> => {
    try {
      const response = await fetch(`${API_URL}/risks/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const apiRisk = await response.json();
      return mapApiToFrontend(apiRisk);
    } catch (error) {
      console.error(`Error fetching risk ${id}:`, error);
      throw error;
    }
  };
  
  // Fungsi untuk membuat risiko baru
  export const createRisk = async (frontendRisk: FrontendRisk): Promise<FrontendRisk> => {
    try {
      const apiRisk = mapFrontendToApi(frontendRisk);
      const response = await fetch(`${API_URL}/risks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRisk),
      });
      
      // Jika status kode berhasil (2xx)
      if (response.status >= 200 && response.status < 300) {
        try {
          // Coba parse JSON jika ada
          const text = await response.text();
          if (!text || text.trim() === '') {
            console.warn('Empty response received, but operation likely successful');
            // Kembalikan objek risk yang dikirim jika tidak ada respons
            return frontendRisk;
          }
          
          try {
            const createdApiRisk = JSON.parse(text);
            return mapApiToFrontend(createdApiRisk);
          } catch (parseError) {
            console.warn("Response couldn't be parsed as JSON, but request was successful", parseError);
            return frontendRisk;
          }
        } catch (textError) {
          console.warn("Couldn't read response text, but request was successful", textError);
          return frontendRisk;
        }
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating risk:', error);
      throw error;
    }
  };
  
  // Fungsi untuk mengupdate risiko
  export const updateRisk = async (id: string, frontendRisk: FrontendRisk): Promise<FrontendRisk> => {
    try {
      const apiRisk = mapFrontendToApi(frontendRisk);
      const response = await fetch(`${API_URL}/risks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRisk),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const updatedApiRisk = await response.json();
      return mapApiToFrontend(updatedApiRisk);
    } catch (error) {
      console.error(`Error updating risk ${id}:`, error);
      throw error;
    }
  };
  
  // Fungsi untuk menghapus risiko
  export const deleteRisk = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/risks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting risk ${id}:`, error);
      throw error;
    }
  };
  
  // Fungsi untuk mendapatkan daftar departemen
  export const getDepartments = async () => {
    try {
      const response = await fetch(`${API_URL}/departments`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  };
  
  // Fungsi untuk mendapatkan daftar grup
  export const getGroups = async () => {
    try {
      const response = await fetch(`${API_URL}/groups`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  };