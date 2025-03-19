import React, { useState, useEffect } from 'react';
import { 
  getAllRisks, 
  createRisk, 
  updateRisk, 
  deleteRisk,
  getDepartments,
  getGroups
} from '../../services/riskService.ts';

// Risk interface
interface Risk {
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

const RiskRegisterPage = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newRisk, setNewRisk] = useState<Risk>({
    id: '',
    group: '',
    activity: '',
    hazard: '',
    impact: 1,
    impactDescription: '',
    riskDescription: '',
    aspects: {
      health: false,
      safety: false,
      security: false,
      environment: false,
      social: false
    },
    existingControl: '',
    probability: 1,
    severity: 1,
    initialRiskLevel: 'Low',
    additionalControl: '',
    residualProbability: 1,
    residualSeverity: 1,
    residualRiskLevel: 'Low',
    pic: '',
    targetDate: '',
    status: 'Open',
    currentRiskLevel: 'Low',
    legalStandardInfo: '',
    mah: false
  });
  
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const riskStatusOptions = ['Open', 'In Progress', 'Completed', 'Closed'];

  // Load data saat komponen di-mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [risksData, departmentsData, groupsData] = await Promise.all([
          getAllRisks(),
          getDepartments(),
          getGroups()
        ]);
        
        setRisks(risksData);
        setDepartments(departmentsData.map((dept: any) => dept.name));
        setGroupOptions(groupsData.map((group: any) => group.name));
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate risk level based on probability and impact
  const calculateRiskLevel = (probability: number, severity: number) => {
    const score = probability * severity;
    
    if (score <= 4) return 'Low';
    if (score <= 9) return 'Medium'; 
    if (score <= 15) return 'High';
    return 'Very High';
  };

  // Get color class based on risk level
  const getRiskLevelColor = (level: string) => {
    switch(level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Very High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100';
    }
  };

  // Handle add new risk - using API
  const handleAddRisk = async () => {
    try {
      // Calculate risk levels
      const initialRiskLevel = calculateRiskLevel(newRisk.probability, newRisk.severity);
      const residualRiskLevel = calculateRiskLevel(newRisk.residualProbability, newRisk.residualSeverity);
      
      const riskToAdd = {
        ...newRisk,
        initialRiskLevel,
        residualRiskLevel,
        currentRiskLevel: residualRiskLevel
      };
      
      // Send to API
      const createdRisk = await createRisk(riskToAdd);
      
      // Update local state
      setRisks([...risks, createdRisk]);
      
      // Reset form
      setNewRisk({
        id: '',
        group: '',
        activity: '',
        hazard: '',
        impact: 1,
        impactDescription: '',
        riskDescription: '',
        aspects: {
          health: false,
          safety: false,
          security: false,
          environment: false,
          social: false
        },
        existingControl: '',
        probability: 1,
        severity: 1,
        initialRiskLevel: 'Low',
        additionalControl: '',
        residualProbability: 1,
        residualSeverity: 1,
        residualRiskLevel: 'Low',
        pic: '',
        targetDate: '',
        status: 'Open',
        currentRiskLevel: 'Low',
        legalStandardInfo: '',
        mah: false
      });
      setIsAdding(false);
      
    } catch (err) {
      console.error('Error adding risk:', err);
      setError('Failed to add risk. Please try again.');
    }
  };

  // Handle update - using API
  const handleUpdateRisk = async (id: string) => {
    try {
      const initialRiskLevel = calculateRiskLevel(newRisk.probability, newRisk.severity);
      const residualRiskLevel = calculateRiskLevel(newRisk.residualProbability, newRisk.residualSeverity);
      
      const riskToUpdate = {
        ...newRisk,
        initialRiskLevel,
        residualRiskLevel,
        currentRiskLevel: residualRiskLevel
      };
      
      // Send to API
      const updatedRisk = await updateRisk(id, riskToUpdate);
      
      // Update local state
      setRisks(risks.map(risk => risk.id === id ? updatedRisk : risk));
      setEditingId(null);
      setIsAdding(false);
      
    } catch (err) {
      console.error('Error updating risk:', err);
      setError('Failed to update risk. Please try again.');
    }
  };

  // Handle delete risk
  const handleDeleteRisk = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      try {
        await deleteRisk(id);
        setRisks(risks.filter(risk => risk.id !== id));
      } catch (err) {
        console.error('Error deleting risk:', err);
        setError('Failed to delete risk. Please try again.');
      }
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs for aspects
    if (name.startsWith('aspect-')) {
      const aspect = name.replace('aspect-', '');
      setNewRisk({
        ...newRisk,
        aspects: {
          ...newRisk.aspects,
          [aspect]: (e.target as HTMLInputElement).checked
        }
      });
      return;
    }
    
    // Handle MAH checkbox
    if (name === 'mah') {
      setNewRisk({
        ...newRisk,
        mah: (e.target as HTMLInputElement).checked
      });
      return;
    }
    
    // Special handling for numeric values
    if (name === 'probability' || name === 'severity' || name === 'residualProbability' || name === 'residualSeverity' || name === 'impact') {
      setNewRisk({
        ...newRisk,
        [name]: parseInt(value)
      });
      return;
    }
    
    setNewRisk({
      ...newRisk,
      [name]: value
    });
  };

  // Edit a risk
  const handleEditRisk = (id: string) => {
    const riskToEdit = risks.find(risk => risk.id === id);
    if (riskToEdit) {
      setNewRisk(riskToEdit);
      setEditingId(id);
      setIsAdding(true);
    }
  };

  // Display loading indicator
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-center">Loading risk data...</p>
        </div>
      </div>
    );
  }

  // Display error message if any
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          Error: {error}
          <button 
            onClick={() => window.location.reload()} 
            className="ml-4 bg-red-600 text-white px-4 py-1 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-xl font-bold">Risk Register</h1>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-medium">Risk Entries</h2>
            
            <button 
              onClick={() => {
                setIsAdding(true);
                setEditingId(null);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add New Risk
            </button>
          </div>

          {/* Form for adding/editing risks */}
          {isAdding && (
            <div className="bg-gray-50 p-4 mb-6 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-3">
                {editingId ? `Edit Risk: ${editingId}` : 'Add New Risk'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Risk ID
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={newRisk.id}
                    onChange={handleInputChange}
                    placeholder="Auto-generated if blank"
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={editingId !== null}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group
                  </label>
                  <select
                    name="group"
                    value={newRisk.group}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select Group</option>
                    {groupOptions.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity/Facility/Asset
                  </label>
                  <input
                    type="text"
                    name="activity"
                    value={newRisk.activity}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hazard/Threat
                  </label>
                  <input
                    type="text"
                    name="hazard"
                    value={newRisk.hazard}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact/Severity Description
                  </label>
                  <input
                    type="text"
                    name="impactDescription"
                    value={newRisk.impactDescription}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Risk Description
                  </label>
                  <input
                    type="text"
                    name="riskDescription"
                    value={newRisk.riskDescription}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aspects (H/S/Sec/E/Soc)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="aspect-health"
                      name="aspect-health"
                      checked={newRisk.aspects.health}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="aspect-health">Health</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="aspect-safety"
                      name="aspect-safety"
                      checked={newRisk.aspects.safety}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="aspect-safety">Safety</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="aspect-security"
                      name="aspect-security"
                      checked={newRisk.aspects.security}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="aspect-security">Security</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="aspect-environment"
                      name="aspect-environment"
                      checked={newRisk.aspects.environment}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="aspect-environment">Environment</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="aspect-social"
                      name="aspect-social"
                      checked={newRisk.aspects.social}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="aspect-social">Social</label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Existing Controls
                  </label>
                  <textarea
                    name="existingControl"
                    value={newRisk.existingControl}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Controls
                  </label>
                  <textarea
                    name="additionalControl"
                    value={newRisk.additionalControl}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legal, Standard & Info
                  </label>
                  <textarea
                    name="legalStandardInfo"
                    value={newRisk.legalStandardInfo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Initial Risk Assessment</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">Probability (1-5)</label>
                      <select
                        name="probability"
                        value={newRisk.probability}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value={1}>1 - Rare</option>
                        <option value={2}>2 - Unlikely</option>
                        <option value={3}>3 - Possible</option>
                        <option value={4}>4 - Likely</option>
                        <option value={5}>5 - Almost Certain</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">Severity (1-5)</label>
                      <select
                        name="severity"
                        value={newRisk.severity}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value={1}>1 - Insignificant</option>
                        <option value={2}>2 - Minor</option>
                        <option value={3}>3 - Moderate</option>
                        <option value={4}>4 - Major</option>
                        <option value={5}>5 - Catastrophic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">Risk Level</label>
                      <div className={`p-2 border border-gray-300 rounded ${getRiskLevelColor(calculateRiskLevel(newRisk.probability, newRisk.severity))}`}>
                        {calculateRiskLevel(newRisk.probability, newRisk.severity)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Residual Risk Assessment</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">Residual Probability (1-5)</label>
                      <select
                        name="residualProbability"
                        value={newRisk.residualProbability}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value={1}>1 - Rare</option>
                        <option value={2}>2 - Unlikely</option>
                        <option value={3}>3 - Possible</option>
                        <option value={4}>4 - Likely</option>
                        <option value={5}>5 - Almost Certain</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">Residual Severity (1-5)</label>
                      <select
                        name="residualSeverity"
                        value={newRisk.residualSeverity}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value={1}>1 - Insignificant</option>
                        <option value={2}>2 - Minor</option>
                        <option value={3}>3 - Moderate</option>
                        <option value={4}>4 - Major</option>
                        <option value={5}>5 - Catastrophic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">Residual Risk Level</label>
                      <div className={`p-2 border border-gray-300 rounded ${getRiskLevelColor(calculateRiskLevel(newRisk.residualProbability, newRisk.residualSeverity))}`}>
                        {calculateRiskLevel(newRisk.residualProbability, newRisk.residualSeverity)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Implementation</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">Person In Charge</label>
                      <select
                        name="pic"
                        value={newRisk.pic}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">Target Completion Date</label>
                      <input
                        type="date"
                        name="targetDate"
                        value={newRisk.targetDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={newRisk.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        {riskStatusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="mah"
                    name="mah"
                    checked={newRisk.mah}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="mah">Major Accident Hazard (MAH)</label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setNewRisk({
                      id: '',
                      group: '',
                      activity: '',
                      hazard: '',
                      impact: 1,
                      impactDescription: '',
                      riskDescription: '',
                      aspects: {
                        health: false,
                        safety: false,
                        security: false,
                        environment: false,
                        social: false
                      },
                      existingControl: '',
                      probability: 1,
                      severity: 1,
                      initialRiskLevel: 'Low',
                      additionalControl: '',
                      residualProbability: 1,
                      residualSeverity: 1,
                      residualRiskLevel: 'Low',
                      pic: '',
                      targetDate: '',
                      status: 'Open',
                      currentRiskLevel: 'Low',
                      legalStandardInfo: '',
                      mah: false
                    });
                  }}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  onClick={() => editingId ? handleUpdateRisk(editingId) : handleAddRisk()}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {editingId ? 'Update Risk' : 'Add Risk'}
                </button>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs tracking-wider">
                  <th className="px-2 py-2 border">Group</th>
                  <th className="px-2 py-2 border whitespace-nowrap">R-ID</th>
                  <th className="px-2 py-2 border">Activity/Facility/Asset</th>
                  <th className="px-2 py-2 border">Hazard/Threat</th>
                  <th className="px-2 py-2 border">Impact/Severity</th>
                  <th className="px-2 py-2 border">Risk Description</th>
                  <th className="px-2 py-2 border">Aspects H/S/Sec/E/Soc</th>
                  <th className="px-2 py-2 border" >Existing Controls</th>
                  <th className="px-2 py-2 border">Prob.</th>
                  <th className="px-2 py-2 border">Sev.</th>
                  <th className="px-2 py-2 border">Initial Risk Level</th>
                  <th className="px-2 py-2 border" >Additional Controls</th>
                  <th className="px-2 py-2 border">Res.P</th>
                  <th className="px-2 py-2 border">Res.S</th>
                  <th className="px-2 py-2 border">Residual Risk Level</th>
                  <th className="px-2 py-2 border">PIC</th>
                  <th className="px-2 py-2 border">Target Date</th>
                  <th className="px-2 py-2 border">Status</th>
                  <th className="px-2 py-2 border">Current Risk Level</th>
                  <th className="px-2 py-2 border">Legal, Standard & Info</th>
                  <th className="px-2 py-2 border">MAH</th>
                  <th className="px-2 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {risks.length === 0 ? (
                  <tr>
                    <td colSpan={22} className="px-4 py-4 text-center text-gray-500 border">
                      No risks registered yet. Add a new risk to get started.
                    </td>
                  </tr>
                ) : (
                  risks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-gray-50">
                      <td className="px-2 py-2 border text-sm">{risk.group}</td>
                      <td className="px-2 py-2 border text-sm">{risk.id}</td>
                      <td className="px-2 py-2 border text-sm">{risk.activity}</td>
                      <td className="px-2 py-2 border text-sm">{risk.hazard}</td>
                      <td className="px-2 py-2 border text-sm">{risk.impactDescription}</td>
                      <td className="px-2 py-2 border text-sm">{risk.riskDescription}</td>
                      <td className="px-2 py-2 border text-sm text-center">
                        {risk.aspects.health ? 'H ' : ''}
                        {risk.aspects.safety ? 'S ' : ''}
                        {risk.aspects.security ? 'Sec ' : ''}
                        {risk.aspects.environment ? 'E ' : ''}
                        {risk.aspects.social ? 'Soc' : ''}
                      </td>
                      <td className="px-2 py-2 border text-sm">{risk.existingControl}</td>
                      <td className="px-2 py-2 border text-center text-sm">{risk.probability}</td>
                      <td className="px-2 py-2 border text-center text-sm">{risk.severity}</td>
                      <td className="px-2 py-2 border text-sm text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(risk.initialRiskLevel)}`}>
                          {risk.initialRiskLevel}
                        </span>
                      </td>
                      <td className="px-2 py-2 border text-sm">{risk.additionalControl}</td>
                      <td className="px-2 py-2 border text-center text-sm">{risk.residualProbability}</td>
                      <td className="px-2 py-2 border text-center text-sm">{risk.residualSeverity}</td>
                      <td className="px-2 py-2 border text-sm text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(risk.residualRiskLevel)}`}>
                          {risk.residualRiskLevel}
                        </span>
                      </td>
                      <td className="px-2 py-2 border text-sm">{risk.pic}</td>
                      <td className="px-2 py-2 border text-sm">{risk.targetDate}</td>
                      <td className="px-2 py-2 border text-sm text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          risk.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                          risk.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          risk.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {risk.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 border text-sm text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(risk.currentRiskLevel)}`}>
                          {risk.currentRiskLevel}
                        </span>
                      </td>
                      <td className="px-2 py-2 border text-sm">{risk.legalStandardInfo}</td>
                      <td className="px-2 py-2 border text-center text-sm">
                        {risk.mah ? '✓' : ''}
                      </td>
                      <td className="px-2 py-2 border text-sm">
                        <button
                          onClick={() => handleEditRisk(risk.id)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRisk(risk.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskRegisterPage;