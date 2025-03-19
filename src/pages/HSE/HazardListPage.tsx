import React, { useState } from 'react';

// Initial sample data based on the image
const initialHazards = [
  {
    id: 'H-1.01',
    category: 'H-1',
    categoryName: 'Asphyxiates Hazards',
    description: 'Drowning',
    health: true,
    safety: true,
    security: false,
    environment: true,
    social: false,
    sources: 'Working overboard, marine seismic operations, water transport'
  },
  {
    id: 'H-1.02',
    category: 'H-1',
    categoryName: 'Asphyxiates Hazards',
    description: 'Excessive CO2',
    health: false,
    safety: true,
    security: false,
    environment: true,
    social: false,
    sources: 'Areas with CO2 firefighting systems, such as turbine enclosures'
  },
  {
    id: 'H-1.03',
    category: 'H-1',
    categoryName: 'Asphyxiates Hazards',
    description: 'Excessive N2',
    health: false,
    safety: true,
    security: false,
    environment: false,
    social: false,
    sources: 'N2-purged vessels'
  },
  {
    id: 'H-1.04',
    category: 'H-1',
    categoryName: 'Asphyxiates Hazards',
    description: 'Halon',
    health: false,
    safety: true,
    security: false,
    environment: true,
    social: false,
    sources: 'Areas with Halon firefighting systems, such as turbine enclosures, electrical switchgear and battery rooms'
  },
  {
    id: 'H-1.05',
    category: 'H-1',
    categoryName: 'Asphyxiates Hazards',
    description: 'Low oxygen atmospheres',
    health: false,
    safety: true,
    security: false,
    environment: false,
    social: false,
    sources: 'Confined Spaces, Tanks'
  },
  {
    id: 'H-1.06',
    category: 'H-1',
    categoryName: 'Asphyxiates Hazards',
    description: 'Smoke (particulates in air)',
    health: false,
    safety: true,
    security: false,
    environment: true,
    social: false,
    sources: 'Welding/burning operations, fires'
  },
  {
    id: 'H-1.07',
    category: 'H-1',
    categoryName: 'Asphyxiates Hazards',
    description: 'Water depth (Diving/Underwater Ops)',
    health: true,
    safety: true,
    security: false,
    environment: false,
    social: false,
    sources: 'Diving Activities, ROV Activities, etc'
  },
  {
    id: 'H-2.01',
    category: 'H-2',
    categoryName: 'Biological Hazards',
    description: 'Poisonous plants (e.g. poison ivy and oak, stinging nettles, nightshade)',
    health: true,
    safety: false,
    security: false,
    environment: false,
    social: false,
    sources: 'Natural environment'
  },
  {
    id: 'H-2.02',
    category: 'H-2',
    categoryName: 'Biological Hazards',
    description: 'Large animals (e.g. dogs, crocodile, tiger)',
    health: true,
    safety: true,
    security: false,
    environment: false,
    social: false,
    sources: 'Natural environment'
  },
  {
    id: 'H-2.03',
    category: 'H-2',
    categoryName: 'Biological Hazards',
    description: 'Small animals (snakes, scorpions, lizards)',
    health: true,
    safety: true,
    security: false,
    environment: false,
    social: false,
    sources: 'Natural environment'
  }
];

// Define hazard categories for dropdown selection
const hazardCategories = [
  { id: 'H-1', name: 'Asphyxiates Hazards' },
  { id: 'H-2', name: 'Biological Hazards' },
  { id: 'H-3', name: 'Chemical Hazards' },
  { id: 'H-4', name: 'Electrical Hazards' },
  { id: 'H-5', name: 'Gravitational Hazards' },
  { id: 'H-6', name: 'Mechanical Hazards' },
  { id: 'H-7', name: 'Motion Hazards' },
  { id: 'H-8', name: 'Physical Hazards' },
  { id: 'H-9', name: 'Pressure Hazards' },
  { id: 'H-10', name: 'Radiation Hazards' },
  { id: 'H-11', name: 'Sound Hazards' },
  { id: 'H-12', name: 'Temperature Hazards' }
];

const HazardListPage: React.FC = () => {
  const [hazards, setHazards] = useState(initialHazards);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHazardId, setEditingHazardId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  
  // New hazard template
  const emptyHazard = {
    id: '',
    category: '',
    categoryName: '',
    description: '',
    health: false,
    safety: false,
    security: false,
    environment: false,
    social: false,
    sources: ''
  };
  
  const [newHazard, setNewHazard] = useState({ ...emptyHazard });

  // Handle input change for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewHazard({
        ...newHazard,
        [name]: checked
      });
    } else if (name === 'category') {
      const selectedCategory = hazardCategories.find(cat => cat.id === value);
      setNewHazard({
        ...newHazard,
        category: value,
        categoryName: selectedCategory ? selectedCategory.name : ''
      });
    } else {
      setNewHazard({
        ...newHazard,
        [name]: value
      });
    }
  };

  // Generate the next ID for a hazard in a category
  const generateNextId = (category: string) => {
    const categoryHazards = hazards.filter(h => h.category === category);
    if (categoryHazards.length === 0) {
      return `${category}.01`;
    }
    
    const maxIdNumber = Math.max(...categoryHazards.map(h => {
      const idParts = h.id.split('.');
      return parseInt(idParts[1]);
    }));
    
    return `${category}.${String(maxIdNumber + 1).padStart(2, '0')}`;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHazardId) {
      // Update existing hazard
      const updatedHazards = hazards.map(hazard => 
        hazard.id === editingHazardId ? newHazard : hazard
      );
      setHazards(updatedHazards);
      setEditingHazardId(null);
    } else {
      // Add new hazard with generated ID if not provided
      const hazardId = newHazard.id || generateNextId(newHazard.category);
      const hazardToAdd = {
        ...newHazard,
        id: hazardId
      };
      setHazards([...hazards, hazardToAdd]);
    }
    
    // Reset form
    setNewHazard({ ...emptyHazard });
    setShowAddForm(false);
  };

  // Start editing a hazard
  const handleEdit = (id: string) => {
    const hazardToEdit = hazards.find(h => h.id === id);
    if (hazardToEdit) {
      setNewHazard({ ...hazardToEdit });
      setEditingHazardId(id);
      setShowAddForm(true);
    }
  };

  // Delete a hazard
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this hazard?')) {
      setHazards(hazards.filter(hazard => hazard.id !== id));
    }
  };

  // Cancel form editing/adding
  const handleCancel = () => {
    setNewHazard({ ...emptyHazard });
    setEditingHazardId(null);
    setShowAddForm(false);
  };

  // Group hazards by category for display
  const groupedHazards: Record<string, typeof hazards> = {};
  hazards
    .filter(h => !filterCategory || h.category === filterCategory)
    .forEach(hazard => {
      if (!groupedHazards[hazard.category]) {
        groupedHazards[hazard.category] = [];
      }
      groupedHazards[hazard.category].push(hazard);
    });

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-900 p-4 text-white">
          <h1 className="text-xl font-bold text-center">Hazard List</h1>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <div>
              <label className="mr-2 font-medium">Filter by Category:</label>
              <select 
                value={filterCategory} 
                onChange={e => setFilterCategory(e.target.value)}
                className="border rounded p-1"
              >
                <option value="">All Categories</option>
                {hazardCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.id} - {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={() => {
                setNewHazard({ ...emptyHazard });
                setEditingHazardId(null);
                setShowAddForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add New Hazard
            </button>
          </div>

          {/* Add/Edit Hazard Form */}
          {showAddForm && (
            <div className="bg-gray-50 p-4 mb-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">
                {editingHazardId ? 'Edit Hazard' : 'Add New Hazard'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hazard Category</label>
                    <select
                      name="category"
                      value={newHazard.category}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Category</option>
                      {hazardCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.id} - {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Hazard ID</label>
                    <input
                      type="text"
                      name="id"
                      value={newHazard.id}
                      onChange={handleInputChange}
                      placeholder="Leave blank for auto-generation"
                      className="w-full p-2 border rounded"
                      disabled={!!editingHazardId}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Hazard Description</label>
                  <input
                    type="text"
                    name="description"
                    value={newHazard.description}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Impact Categories</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="health"
                        name="health"
                        checked={newHazard.health}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="health">Health</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="safety"
                        name="safety"
                        checked={newHazard.safety}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="safety">Safety</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="security"
                        name="security"
                        checked={newHazard.security}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="security">Security</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="environment"
                        name="environment"
                        checked={newHazard.environment}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="environment">Environment</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="social"
                        name="social"
                        checked={newHazard.social}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="social">Social</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Sources</label>
                  <textarea
                    name="sources"
                    value={newHazard.sources}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {editingHazardId ? 'Update Hazard' : 'Add Hazard'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Hazard List Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-2 text-left">Hazard/Aspect/Threat Number</th>
                  <th className="border border-gray-200 p-2 text-left">Hazard/Aspect/Threat Description</th>
                  <th className="border border-gray-200 p-2 text-center w-16">Health</th>
                  <th className="border border-gray-200 p-2 text-center w-16">Safety</th>
                  <th className="border border-gray-200 p-2 text-center w-16">Security</th>
                  <th className="border border-gray-200 p-2 text-center w-16">Environment</th>
                  <th className="border border-gray-200 p-2 text-center w-16">Social</th>
                  <th className="border border-gray-200 p-2 text-left">Sources</th>
                  <th className="border border-gray-200 p-2 text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedHazards).map(category => {
                  const categoryData = groupedHazards[category][0];
                  return (
                    <React.Fragment key={category}>
                      <tr className="bg-gray-200">
                        <td className="border border-gray-300 p-2 font-bold">{category}</td>
                        <td className="border border-gray-300 p-2 font-bold" colSpan={8}>{categoryData.categoryName}</td>
                      </tr>
                      {groupedHazards[category].map(hazard => (
                        <tr key={hazard.id}>
                          <td className="border border-gray-300 p-2">{hazard.id}</td>
                          <td className="border border-gray-300 p-2">{hazard.description}</td>
                          <td className="border border-gray-300 p-2 text-center">
                            {hazard.health && <span className="text-lg">✓</span>}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {hazard.safety && <span className="text-lg">✓</span>}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {hazard.security && <span className="text-lg">✓</span>}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {hazard.environment && <span className="text-lg">✓</span>}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {hazard.social && <span className="text-lg">✓</span>}
                          </td>
                          <td className="border border-gray-300 p-2">{hazard.sources}</td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button 
                              onClick={() => handleEdit(hazard.id)}
                              className="text-blue-600 hover:text-blue-800 mr-2"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(hazard.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
                
                {Object.keys(groupedHazards).length === 0 && (
                  <tr>
                    <td colSpan={9} className="border border-gray-300 p-4 text-center text-gray-500">
                      No hazards found. {filterCategory && 'Try changing the filter or '} Add a new hazard to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HazardListPage;